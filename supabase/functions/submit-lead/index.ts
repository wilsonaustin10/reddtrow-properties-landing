import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { getEdgeFunctionConfig, logConfigStatus } from '../_shared/config.ts';
import type { CustomFieldIdConfig } from '../_shared/config.ts';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Simple background task handler with immediate error logging
async function runBackgroundTask(task: () => Promise<void>, taskName: string) {
  try {
    await task();
  } catch (error) {
    console.error(`${taskName} failed:`, error);
  }
}

// Helper to update lead GHL status in database
async function updateLeadGhlStatus(supabase: any, leadId: string, success: boolean, message: string) {
  await supabase
    .from('leads')
    .update({
      ghl_sent: success,
      [success ? 'ghl_response' : 'ghl_error']: message,
      ghl_sent_at: new Date().toISOString()
    })
    .eq('id', leadId);
}

// Input validation schema for security
const ATTRIBUTION_FIELD_NAMES = [
  'gclid',
  'wbraid',
  'gbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_campaignid',
  'utm_adgroupid',
  'utm_term',
  'utm_device',
  'utm_creative',
  'utm_network',
  'utm_assetgroup',
  'utm_headline',
  'landing_page',
  'referrer',
  'session_id'
] as const;

type AttributionFieldName = typeof ATTRIBUTION_FIELD_NAMES[number];
type AttributionData = Partial<Record<AttributionFieldName, string>>;

const trackingString = (max: number, message: string) => z.string().trim().max(max, message).optional();

const attributionSchema = z.object({
  gclid: trackingString(255, 'gclid is too long'),
  wbraid: trackingString(255, 'wbraid is too long'),
  gbraid: trackingString(255, 'gbraid is too long'),
  utm_source: trackingString(255, 'utm_source is too long'),
  utm_medium: trackingString(255, 'utm_medium is too long'),
  utm_campaign: trackingString(255, 'utm_campaign is too long'),
  utm_campaignid: trackingString(255, 'utm_campaignid is too long'),
  utm_adgroupid: trackingString(255, 'utm_adgroupid is too long'),
  utm_term: trackingString(255, 'utm_term is too long'),
  utm_device: trackingString(255, 'utm_device is too long'),
  utm_creative: trackingString(255, 'utm_creative is too long'),
  utm_network: trackingString(255, 'utm_network is too long'),
  utm_assetgroup: trackingString(255, 'utm_assetgroup is too long'),
  utm_headline: trackingString(255, 'utm_headline is too long'),
  landing_page: trackingString(2048, 'landing_page is too long'),
  referrer: trackingString(2048, 'referrer is too long'),
  session_id: trackingString(255, 'session_id is too long')
});

const leadSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100, "First name too long"),
  lastName: z.string().trim().min(1, "Last name is required").max(100, "Last name too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  phone: z.string().trim().min(10, "Phone number too short").max(20, "Phone number too long"),
  address: z.string().trim().min(5, "Address too short").max(500, "Address too long"),
  isListed: z.enum(['yes', 'no']).optional(),
  condition: z.enum(['poor', 'fair', 'good', 'excellent']).optional(),
  timeline: z.enum(['asap', '30days', '60days', '90days', '90plus']).optional(),
  askingPrice: z.string().trim().max(50, "Asking price too long").optional(),
  smsConsent: z.boolean().optional(),
  website: z.string().optional() // Honeypot field - should be empty
}).merge(attributionSchema);

interface LeadData extends AttributionData {
  address: string;
  phone: string;
  smsConsent?: boolean;
  isListed?: string;
  condition?: string;
  timeline?: string;
  askingPrice?: string;
  firstName: string;
  lastName: string;
  email: string;
  website?: string; // Honeypot field
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log('Starting lead submission process...');
    
    // Load configuration using shared config module
    const config = getEdgeFunctionConfig();
    logConfigStatus();
    
    const rawData = await req.json();
    
    // Validate input data with Zod schema
    let leadData: LeadData;
    try {
      leadData = leadSchema.parse(rawData) as LeadData;
      console.log('Lead data validated successfully');
    } catch (validationError) {
      console.error("Validation error:", validationError);
      if (validationError instanceof z.ZodError) {
        return new Response(
          JSON.stringify({ 
            error: "Invalid input data", 
            details: validationError.errors.map(e => `${e.path.join('.')}: ${e.message}`)
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw validationError;
    }
    
    // Honeypot check - reject if filled (bot detection)
    if (leadData.website && leadData.website.trim() !== '') {
      console.log('🤖 Bot detected: honeypot field filled with value:', leadData.website);
      
      // Return success response to avoid tipping off the bot
      return new Response(JSON.stringify({
        success: true,
        message: 'Lead submitted successfully'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Honeypot check passed (field empty)');
    console.log('Received validated lead data:', { ...leadData, phone: '***', email: '***' });

    const attributionData: AttributionData = {};
    for (const key of ATTRIBUTION_FIELD_NAMES) {
      const value = leadData[key];
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed !== '') {
          attributionData[key] = trimmed;
        }
      }
    }

    const storedAttribution = Object.keys(attributionData).length > 0 ? attributionData : null;

    // Initialize Supabase client with service role key for database operations
    const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);

    // Store lead in database
    console.log('Storing lead in database...');
    const { data: lead, error: dbError } = await supabase
      .from('leads')
      .insert({
        address: leadData.address,
        phone: leadData.phone,
        sms_consent: leadData.smsConsent,
        is_listed: leadData.isListed,
        condition: leadData.condition,
        timeline: leadData.timeline,
        asking_price: leadData.askingPrice,
        first_name: leadData.firstName,
        last_name: leadData.lastName,
        email: leadData.email,
        attribution: storedAttribution,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(JSON.stringify({ error: 'Failed to store lead data' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Lead stored successfully with ID:', lead.id);

    // Prepare lead data for external APIs
    const leadPayload = {
      lead_id: lead.id,
      timestamp: new Date().toISOString(),
      property: {
        address: leadData.address,
        condition: leadData.condition,
        timeline: leadData.timeline,
        asking_price: leadData.askingPrice,
        is_listed: leadData.isListed === 'yes'
      },
      contact: {
        first_name: leadData.firstName,
        last_name: leadData.lastName,
        full_name: `${leadData.firstName} ${leadData.lastName}`,
        email: leadData.email,
        phone: leadData.phone,
        sms_consent: leadData.smsConsent
      },
      source: 'website_form',
      attribution: storedAttribution ?? undefined
    };

    // Send to Zapier webhook if configured
    if (config.integrations.zapier) {
      console.log('Sending to Zapier webhook...');
      runBackgroundTask(async () => {
        await sendToZapier(config.integrations.zapier!.webhookUrl, leadPayload, supabase, lead.id);
      }, 'Zapier Integration');
    } else {
      console.log('Zapier webhook URL not configured, skipping...');
    }

    // Send to Go High Level API if configured with PIT token
    const ghlApiKey = config.integrations.ghl?.apiKey;
    const ghlLocationId = config.integrations.ghl?.locationId;
    
    if (ghlApiKey && ghlApiKey.startsWith('pit-')) {
      console.log('Starting GHL v2 integration with PIT token');
      runBackgroundTask(async () => {
        await sendToGoHighLevel(
          ghlApiKey,
          ghlLocationId,
          leadPayload,
          supabase,
          lead.id,
          config.integrations.ghl?.customFieldIds
        );
      }, 'GHL Integration');
    } else if (ghlApiKey) {
      const errorMsg = 'GHL v2 requires a Private Integration Token (PIT). Please update GHL_API_KEY to a PIT token (starts with "pit-").';
      console.log('Configuration error:', errorMsg);
      await updateLeadGhlStatus(supabase, lead.id, false, errorMsg);
    } else {
      console.log('GHL API key not configured, skipping...');
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Lead submitted successfully',
      lead_id: lead.id
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in submit-lead function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

async function sendToZapier(webhookUrl: string, leadPayload: any, supabase: any, leadId: string) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadPayload),
    });

    if (response.ok) {
      console.log('Successfully sent lead to Zapier');
      await supabase
        .from('leads')
        .update({
          zapier_sent: true,
          zapier_sent_at: new Date().toISOString()
        })
        .eq('id', leadId);
    } else {
      const errorText = await response.text();
      console.error('Failed to send to Zapier:', response.status, errorText);
    }
  } catch (error) {
    console.error('Error sending to Zapier:', error);
  }
}

type CustomFieldOverrideConfig = CustomFieldIdConfig;

type AttributionFieldDefinition = {
  key: AttributionFieldName;
  configKey: keyof CustomFieldOverrideConfig;
  label: string;
  keys: string[];
  names: string[];
};

const ATTRIBUTION_FIELD_DEFINITIONS: AttributionFieldDefinition[] = [
  {
    key: 'gclid',
    configKey: 'gclid',
    label: 'GCLID',
    keys: ['contact.gclid'],
    names: ['GCLID']
  },
  {
    key: 'wbraid',
    configKey: 'wbraid',
    label: 'WBRAID',
    keys: ['contact.wbraid'],
    names: ['WBRAID']
  },
  {
    key: 'gbraid',
    configKey: 'gbraid',
    label: 'GBRAID',
    keys: ['contact.gbraid'],
    names: ['GBRAID']
  },
  {
    key: 'utm_source',
    configKey: 'utmSource',
    label: 'UTM Source',
    keys: ['contact.utm_source', 'contact.utmSource'],
    names: ['UTM Source']
  },
  {
    key: 'utm_medium',
    configKey: 'utmMedium',
    label: 'UTM Medium',
    keys: ['contact.utm_medium', 'contact.utmMedium'],
    names: ['UTM Medium']
  },
  {
    key: 'utm_campaign',
    configKey: 'utmCampaign',
    label: 'UTM Campaign',
    keys: ['contact.utm_campaign', 'contact.utmCampaign'],
    names: ['UTM Campaign']
  },
  {
    key: 'utm_campaignid',
    configKey: 'utmCampaignId',
    label: 'UTM Campaign ID',
    keys: ['contact.utm_campaignid', 'contact.utmCampaignId'],
    names: ['UTM Campaign ID']
  },
  {
    key: 'utm_adgroupid',
    configKey: 'utmAdgroupId',
    label: 'UTM Ad Group ID',
    keys: ['contact.utm_adgroupid', 'contact.utmAdgroupId'],
    names: ['UTM Ad Group ID']
  },
  {
    key: 'utm_term',
    configKey: 'utmTerm',
    label: 'UTM Term',
    keys: ['contact.utm_term', 'contact.utmTerm'],
    names: ['UTM Term']
  },
  {
    key: 'utm_device',
    configKey: 'utmDevice',
    label: 'UTM Device',
    keys: ['contact.utm_device', 'contact.utmDevice'],
    names: ['UTM Device']
  },
  {
    key: 'utm_creative',
    configKey: 'utmCreative',
    label: 'UTM Creative',
    keys: ['contact.utm_creative', 'contact.utmCreative'],
    names: ['UTM Creative']
  },
  {
    key: 'utm_network',
    configKey: 'utmNetwork',
    label: 'UTM Network',
    keys: ['contact.utm_network', 'contact.utmNetwork'],
    names: ['UTM Network']
  },
  {
    key: 'utm_assetgroup',
    configKey: 'utmAssetGroup',
    label: 'UTM Asset Group',
    keys: ['contact.utm_assetgroup', 'contact.utmAssetGroup'],
    names: ['UTM Asset Group']
  },
  {
    key: 'utm_headline',
    configKey: 'utmHeadline',
    label: 'UTM Headline',
    keys: ['contact.utm_headline', 'contact.utmHeadline'],
    names: ['UTM Headline']
  },
  {
    key: 'landing_page',
    configKey: 'landingPage',
    label: 'Landing Page',
    keys: ['contact.landing_page', 'contact.landingPage'],
    names: ['Landing Page']
  },
  {
    key: 'referrer',
    configKey: 'referrer',
    label: 'Referrer',
    keys: ['contact.referrer'],
    names: ['Referrer']
  },
  {
    key: 'session_id',
    configKey: 'sessionId',
    label: 'Session ID',
    keys: ['contact.session_id', 'contact.sessionId'],
    names: ['Session ID']
  }
];

async function sendToGoHighLevel(
  apiKey: string,
  locationId: string | undefined,
  leadPayload: any,
  supabase: any,
  leadId: string,
  customFieldOverrides?: CustomFieldOverrideConfig
) {
  // Use /contacts/upsert per GHL v2 best practices (respects duplicate settings)
  const apiUrl = 'https://services.leadconnectorhq.com/contacts/upsert';

  try {
    console.log('Starting GHL v2 API call (upsert) for lead:', leadId);

    // Validate configuration
    if (!locationId) {
      const errorMsg = 'GHL_LOCATION_ID is required for API v2';
      console.error(errorMsg);
      await updateLeadGhlStatus(supabase, leadId, false, errorMsg);
      return;
    }

    if (locationId.startsWith('pit-')) {
      const errorMsg = 'GHL_LOCATION_ID appears to be a PIT token (starts with "pit-"). It should be your Sub-Account Location ID (e.g., "GbOoP9eUwGI1Eb30Baex")';
      console.error(errorMsg);
      await updateLeadGhlStatus(supabase, leadId, false, errorMsg);
      return;
    }

    // Fetch contact custom field IDs using Bearer auth (API v2 standard)
    // Note: Do not use limit/pageSize params as they cause 422 errors on some GHL tenants
    const customFieldsUrl = `https://services.leadconnectorhq.com/locations/${locationId}/customFields?model=contact`;
    const cfHeaders: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
      'Version': '2021-07-28',
      'Accept': 'application/json',
    };

    console.log('Fetching GHL custom fields for location:', locationId);
    const cfResp = await fetch(customFieldsUrl, { headers: cfHeaders });
    const cfText = await cfResp.text();

    if (!cfResp.ok) {
      console.error(`Custom fields fetch failed: ${cfResp.status} ${cfText.substring(0, 200)}`);
      if (cfResp.status === 401) {
        console.error('⚠️  401 Unauthorized: Check that GHL_API_KEY is a valid PIT token starting with "pit-"');
      } else if (cfResp.status === 403) {
        console.error('⚠️  403 Forbidden: Verify that the PIT token has access to this location and has contacts.write scope');
      } else if (cfResp.status === 422) {
        console.error('⚠️  422 Unprocessable Entity: This may indicate invalid parameters or missing scopes');
      }
      console.log('Proceeding with configured custom field IDs only (API lookup unavailable)');
    }

    const normalizeIdentifier = (value: string) => value.replace(/[^a-z0-9]/gi, '').toLowerCase();

    // Map lead data to custom field keys with proper type handling
    // Support both snake_case and camelCase variations that GHL auto-generates
    type FieldDefinition = {
      value: string;
      keys: string[];
      names: string[];
      sourceKey?: AttributionFieldName;
    };

    const customFieldDefinitions: FieldDefinition[] = [
      {
        value: String(leadPayload.property.asking_price ?? ''),
        keys: ['contact.asking_price', 'contact.askingPrice'],
        names: ['Asking Price']
      },
      {
        value: String(leadPayload.property.timeline ?? ''),
        keys: ['contact.timeline', 'contact.propertyTimeline'],
        names: ['Timeline']
      },
      {
        value: leadPayload.property.is_listed ? 'Yes' : 'No',
        keys: ['contact.property_listed', 'contact.propertyListed'],
        names: ['Property Listed']
      },
      {
        value: String(leadPayload.property.condition ?? ''),
        keys: ['contact.condition', 'contact.propertyCondition'],
        names: ['Condition']
      }
    ];

    const processedAttributionDefinitions: Array<{ key: AttributionFieldName; value: string }> = [];

    const attributionPayload = (leadPayload.attribution && typeof leadPayload.attribution === 'object')
      ? leadPayload.attribution as AttributionData
      : {};

    for (const definition of ATTRIBUTION_FIELD_DEFINITIONS) {
      const rawValue = attributionPayload[definition.key];
      if (!rawValue) {
        continue;
      }

      const trimmedValue = rawValue.trim();
      if (!trimmedValue) {
        continue;
      }

      customFieldDefinitions.push({
        value: trimmedValue,
        keys: definition.keys,
        names: definition.names,
        sourceKey: definition.key
      });
      processedAttributionDefinitions.push({ key: definition.key, value: trimmedValue });
    }

    const idByKey: Record<string, string> = {};
    const idByName: Record<string, string> = {};
    const normalizedIdByKey: Record<string, string> = {};
    const normalizedIdByName: Record<string, string> = {};

    const registerKey = (key: string, id: string) => {
      idByKey[key] = id;
      normalizedIdByKey[normalizeIdentifier(key)] = id;
    };

    const registerName = (name: string, id: string) => {
      idByName[name.toLowerCase()] = id;
      normalizedIdByName[normalizeIdentifier(name)] = id;
    };

    if (cfResp.ok) {
      try {
        const cfData = JSON.parse(cfText);
        const available = Array.isArray(cfData.customFields) ? cfData.customFields : [];
        console.log(`✅ Found ${available.length} custom fields in GHL location`);

        // Log each custom field for debugging
        if (available.length > 0) {
          console.log('Available custom fields:');
          for (const f of available.slice(0, 10)) { // Log first 10
            console.log(`  - ID: ${f.id}, Name: "${f.name}", Key: "${f.fieldKey || 'N/A'}"`);
          }
          if (available.length > 10) {
            console.log(`  ... and ${available.length - 10} more`);
          }
        } else {
          console.warn('⚠️  No custom fields found. Create custom fields in GHL for asking_price, timeline, condition, property_listed');
        }

        for (const f of available) {
          if (f && typeof f === 'object' && f.id) {
            if (f.fieldKey) {
              registerKey(f.fieldKey, f.id);
            }
            if (f.name && typeof f.name === 'string') {
              registerName(f.name, f.id);
            }
          }
        }
      } catch (e) {
        console.error('Failed to parse custom fields response:', e);
        console.log('Proceeding with configured custom field IDs only');
      }
    } else {
      console.log('Proceeding with configured custom field IDs only (API lookup unavailable)');
    }

    // Apply configured custom field ID overrides if provided
    const addOverride = (label: string, id: string | undefined, keys: string[], names: string[]) => {
      if (!id) return;
      console.log(`Using configured custom field ID for ${label}: ${id}`);
      for (const key of keys) {
        registerKey(key, id);
      }
      for (const name of names) {
        registerName(name, id);
      }
    };

    const propertyOverrideDefinitions: Array<{ label: string; overrideKey: keyof CustomFieldOverrideConfig; keys: string[]; names: string[] }> = [
      {
        label: 'asking_price',
        overrideKey: 'askingPrice',
        keys: ['contact.asking_price', 'contact.askingPrice'],
        names: ['Asking Price']
      },
      {
        label: 'timeline',
        overrideKey: 'timeline',
        keys: ['contact.timeline', 'contact.propertyTimeline'],
        names: ['Timeline']
      },
      {
        label: 'property_listed',
        overrideKey: 'propertyListed',
        keys: ['contact.property_listed', 'contact.propertyListed'],
        names: ['Property Listed']
      },
      {
        label: 'condition',
        overrideKey: 'condition',
        keys: ['contact.condition', 'contact.propertyCondition'],
        names: ['Condition']
      }
    ];

    for (const override of propertyOverrideDefinitions) {
      addOverride(override.label, customFieldOverrides?.[override.overrideKey], override.keys, override.names);
    }

    for (const attrDefinition of ATTRIBUTION_FIELD_DEFINITIONS) {
      addOverride(attrDefinition.key, customFieldOverrides?.[attrDefinition.configKey], attrDefinition.keys, attrDefinition.names);
    }

    const customFieldsPayload: Array<{ id: string; value: string }> = [];
    const matchedAttributionKeys = new Set<AttributionFieldName>();

    for (const { value: val, keys, names, sourceKey } of customFieldDefinitions) {
      if (!val || val.trim() === '') {
        console.log('Skipping custom field (empty value)');
        continue;
      }

      let matchedKey: string | undefined;
      let id: string | undefined;

      for (const key of keys) {
        if (idByKey[key]) {
          matchedKey = key;
          id = idByKey[key];
          break;
        }

        const normalizedKey = normalizeIdentifier(key);
        if (!id && normalizedIdByKey[normalizedKey]) {
          matchedKey = key;
          id = normalizedIdByKey[normalizedKey];
          break;
        }
      }

      // Fallback: match by name if fieldKey didn't work
      if (!id) {
        for (const name of names) {
          const lowerName = name.toLowerCase();
          if (idByName[lowerName]) {
            id = idByName[lowerName];
            matchedKey = name;
            console.log(`Matched custom field by name fallback: ${name}`);
            break;
          }

          const normalizedName = normalizeIdentifier(name);
          if (!id && normalizedIdByName[normalizedName]) {
            id = normalizedIdByName[normalizedName];
            matchedKey = name;
            console.log(`Matched custom field by normalized name fallback: ${name}`);
            break;
          }
        }
      }

      if (id) {
        customFieldsPayload.push({ id, value: val });
        console.log(`Added custom field: ${matchedKey ?? 'unknown'} = ${val}`);
        if (sourceKey) {
          matchedAttributionKeys.add(sourceKey);
        }
      } else {
        console.log(`Custom field not found in GHL for keys: ${keys.join(', ')}`);
      }
    }

    console.log(`Successfully mapped ${customFieldsPayload.length} custom fields`);

    const unmatchedAttributionNotes: string[] = [];
    const attributionLabelByKey = ATTRIBUTION_FIELD_DEFINITIONS.reduce<Record<AttributionFieldName, string>>((acc, definition) => {
      acc[definition.key] = definition.label;
      return acc;
    }, {} as Record<AttributionFieldName, string>);

    for (const { key, value } of processedAttributionDefinitions) {
      if (!matchedAttributionKeys.has(key)) {
        unmatchedAttributionNotes.push(`${attributionLabelByKey[key]}: ${value}`);
      }
    }

    // Normalize phone to E.164 format (+1XXXXXXXXXX for US)
    let normalizedPhone = leadPayload.contact.phone;
    if (normalizedPhone && !normalizedPhone.startsWith('+')) {
      // Remove any non-digit characters
      const digits = normalizedPhone.replace(/\D/g, '');
      // Add +1 prefix for US numbers (10 digits)
      if (digits.length === 10) {
        normalizedPhone = `+1${digits}`;
      } else if (digits.length === 11 && digits.startsWith('1')) {
        normalizedPhone = `+${digits}`;
      }
      console.log(`Normalized phone: ${leadPayload.contact.phone} -> ${normalizedPhone}`);
    }

    const ghlPayload: any = {
      firstName: leadPayload.contact.first_name,
      lastName: leadPayload.contact.last_name,
      email: leadPayload.contact.email,
      phone: normalizedPhone,
      address1: leadPayload.property.address,
      locationId: locationId,
      tags: ['ppc'],
      source: leadPayload.source || 'website_form',
    };

    if (customFieldsPayload.length > 0) {
      ghlPayload.customFields = customFieldsPayload;
      console.log(`✅ Sending ${customFieldsPayload.length} custom fields to GHL`);
    } else {
      console.warn('⚠️  No custom fields will be sent (none matched or none exist in GHL)');
    }

    if (unmatchedAttributionNotes.length > 0) {
      const notesText = `Attribution Data:\n${unmatchedAttributionNotes.join('\n')}`;
      if (typeof ghlPayload.notes === 'string' && ghlPayload.notes.trim() !== '') {
        ghlPayload.notes = `${ghlPayload.notes}\n\n${notesText}`;
      } else {
        ghlPayload.notes = notesText;
      }
      console.log(`Adding attribution notes to GHL payload (${unmatchedAttributionNotes.length} items)`);
    }

    // Use Bearer authorization per GHL v2 API documentation
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Version': '2021-07-28',
    };

    console.log(`Calling ${apiUrl} with locationId: ${locationId}`);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(ghlPayload),
    });

    const responseText = await response.text();
    console.log('GHL Response Status:', response.status);

    // Process result
    if (response.ok) {
      let contactId = 'unknown';
      try {
        const responseData = JSON.parse(responseText);
        contactId = responseData.contact?.id || responseData.id || 'unknown';
        console.log('✅ SUCCESS - Contact upserted with ID:', contactId);
      } catch (_) {
        console.log('✅ SUCCESS - Response not JSON');
      }

      await updateLeadGhlStatus(supabase, leadId, true, `Contact upserted: ${contactId}`);
      return;
    }

    // Failed - provide actionable error messages with full response for debugging
    console.error('GHL Response Body:', responseText);
    let errorDetails = `Status ${response.status}: ${responseText.substring(0, 500)}`;
    
    if (response.status === 401) {
      errorDetails = `401 Unauthorized - Check that GHL_API_KEY is a valid PIT token starting with "pit-" and has required scopes (contacts.write, contacts.readonly, contacts/customFields.readonly). ${responseText.substring(0, 200)}`;
    } else if (response.status === 403) {
      errorDetails = `403 Forbidden - Verify: 1) PIT has contacts.write scope, 2) PIT has access to location ${locationId}, 3) Custom field scopes are granted. ${responseText.substring(0, 200)}`;
    } else if (response.status === 422) {
      errorDetails = `422 Validation Error - Check: 1) Email format valid, 2) Phone in E.164 format (+1XXXXXXXXXX), 3) Custom field types match (text/select/checkbox). ${responseText.substring(0, 300)}`;
    }
    
    console.error('❌ FAILED:', errorDetails);
    await updateLeadGhlStatus(supabase, leadId, false, errorDetails);

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Exception in GHL integration:', msg);
    await updateLeadGhlStatus(supabase, leadId, false, `Exception: ${msg}`);
  }
}

serve(handler);
