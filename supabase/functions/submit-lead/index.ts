import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { getEdgeFunctionConfig, logConfigStatus } from '../_shared/config.ts';

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

interface LeadData {
  address: string;
  phone: string;
  smsConsent: boolean;
  isListed: string;
  condition: string;
  timeline: string;
  askingPrice: string;
  firstName: string;
  lastName: string;
  email: string;
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
    
    const leadData: LeadData = await req.json();
    console.log('Received lead data:', { ...leadData, phone: '***', email: '***' });
    
    // Initialize Supabase client with service role key for database operations
    const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);
    
    // Validate required fields
    if (!leadData.address || !leadData.phone || !leadData.firstName || !leadData.lastName || !leadData.email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
      source: 'website_form'
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

type CustomFieldOverrideConfig = {
  askingPrice?: string;
  timeline?: string;
  propertyListed?: string;
  condition?: string;
};

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
    const customFieldsBaseUrl = `https://services.leadconnectorhq.com/locations/${locationId}/customFields`;
    const cfHeaders: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
      'Version': '2021-07-28',
      'Accept': 'application/json',
    };

    const paginationVariants: Array<{ params: Record<string, string>; description: string }> = [
      { params: { model: 'contact', limit: '200' }, description: 'model=contact&limit=200' },
      { params: { model: 'contact', pageSize: '200' }, description: 'model=contact&pageSize=200' },
      { params: { model: 'contact' }, description: 'model=contact (no pagination params)' },
    ];

    let cfResp: Response | undefined;
    let cfText = '';
    let lastCustomFieldsUrl = '';

    for (const variant of paginationVariants) {
      const url = new URL(customFieldsBaseUrl);
      url.search = new URLSearchParams(variant.params).toString();
      lastCustomFieldsUrl = url.toString();

      console.log(`Fetching GHL custom fields for location: ${locationId} (${variant.description})`);
      cfResp = await fetch(lastCustomFieldsUrl, { headers: cfHeaders });
      cfText = await cfResp.text();

      if (cfResp.ok) {
        break;
      }

      const lowered = cfText.toLowerCase();
      if (
        cfResp.status === 422 &&
        (lowered.includes('property limit should not exist') || lowered.includes('property pagesize should not exist'))
      ) {
        console.warn('Custom fields endpoint rejected the pagination parameter; retrying without it.');
        continue;
      }

      // For other errors, do not retry with additional variants.
      break;
    }

    if (!cfResp) {
      throw new Error('Failed to contact GHL custom fields endpoint');
    }
    
    console.log('Fetching GHL custom fields for location:', locationId);
    const cfResp = await fetch(customFieldsUrl, { headers: cfHeaders });
    const cfText = await cfResp.text();

    if (!cfResp.ok) {
      console.error(`Custom fields fetch failed (${lastCustomFieldsUrl}): ${cfResp.status} ${cfText.substring(0, 200)}`);
      if (cfResp.status === 401) {
        console.error('⚠️  401 Unauthorized: Check that GHL_API_KEY is a valid PIT token starting with "pit-"');
      } else if (cfResp.status === 403) {
        console.error('⚠️  403 Forbidden: Verify that the PIT token has access to this location and has contacts.write scope');
      } else if (cfResp.status === 422) {
        console.error('⚠️  422 Unprocessable Entity from custom fields endpoint. Verify the token scopes and pagination parameters');
      }
    }

    const normalizeIdentifier = (value: string) => value.replace(/[^a-z0-9]/gi, '').toLowerCase();

    // Map lead data to custom field keys with proper type handling
    // Support both snake_case and camelCase variations that GHL auto-generates
    const customFieldDefinitions: Array<{
      value: string;
      keys: string[];
      names: string[];
    }> = [
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

    addOverride('asking_price', customFieldOverrides?.askingPrice, ['contact.asking_price', 'contact.askingPrice'], ['Asking Price']);
    addOverride('timeline', customFieldOverrides?.timeline, ['contact.timeline', 'contact.propertyTimeline'], ['Timeline']);
    addOverride('property_listed', customFieldOverrides?.propertyListed, ['contact.property_listed', 'contact.propertyListed'], ['Property Listed']);
    addOverride('condition', customFieldOverrides?.condition, ['contact.condition', 'contact.propertyCondition'], ['Condition']);

    let customFieldsPayload: Array<{ id: string; value: string }> = [];

    for (const { value: val, keys, names } of customFieldDefinitions) {
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
      } else {
        console.log(`Custom field not found in GHL for keys: ${keys.join(', ')}`);
      }
    }

    console.log(`Successfully mapped ${customFieldsPayload.length} custom fields`);

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
