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
        await sendToGoHighLevel(ghlApiKey, ghlLocationId, leadPayload, supabase, lead.id);
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

async function sendToGoHighLevel(apiKey: string, locationId: string | undefined, leadPayload: any, supabase: any, leadId: string) {
  const apiUrl = 'https://services.leadconnectorhq.com/contacts/';

  try {
    console.log('Starting GHL v2 API call for lead:', leadId);

    // Include required locationId per GHL docs
    const effectiveLocationId = locationId || 'unxTj89xWq1FbRdTt2rH';

    // Fetch contact custom field IDs so we can map values correctly
    const customFieldsUrl = `https://services.leadconnectorhq.com/locations/${effectiveLocationId}/customFields?model=contact`;
    let cfHeaders: Record<string, string> = {
      'Authorization': apiKey,
      'Accept': 'application/json',
      'Version': '2021-07-28',
    };
    console.log('Fetching GHL custom fields for location:', effectiveLocationId);
    let cfResp = await fetch(customFieldsUrl, { headers: cfHeaders });
    let cfText = await cfResp.text();
    if (cfResp.status === 401 || cfResp.status === 403) {
      console.log('Custom fields fetch: retrying with Bearer prefix');
      cfHeaders['Authorization'] = `Bearer ${apiKey}`;
      cfResp = await fetch(customFieldsUrl, { headers: cfHeaders });
      cfText = await cfResp.text();
    }

    const desiredKeysToValues: Record<string, string> = {
      'contact.asking_price': String(leadPayload.property.asking_price ?? ''),
      'contact.timeline': String(leadPayload.property.timeline ?? ''),
      'contact.property_listed': String(leadPayload.property.is_listed ? 'Yes' : 'No'),
      'contact.condition': String(leadPayload.property.condition ?? ''),
    };

    // Fallback mapping by name (case-insensitive) if fieldKey doesn't match
    const fallbackNameMap: Record<string, string> = {
      'contact.asking_price': 'Asking Price',
      'contact.timeline': 'Timeline',
      'contact.property_listed': 'Property Listed',
      'contact.condition': 'Condition',
    };

    let customFieldsPayload: Array<{ id: string; value: string }> = [];
    try {
      const cfData = JSON.parse(cfText);
      const available = Array.isArray(cfData.customFields) ? cfData.customFields : [];
      console.log(`Found ${available.length} custom fields in GHL location`);
      
      const idByKey: Record<string, string> = {};
      const idByName: Record<string, string> = {};
      
      for (const f of available) {
        if (f && typeof f === 'object' && f.id) {
          if (f.fieldKey) {
            idByKey[f.fieldKey] = f.id;
          }
          if (f.name && typeof f.name === 'string') {
            idByName[f.name.toLowerCase()] = f.id;
          }
        }
      }
      
      for (const key of Object.keys(desiredKeysToValues)) {
        const val = desiredKeysToValues[key];
        if (!val || val.trim() === '') {
          console.log(`Skipping custom field (empty value): ${key}`);
          continue;
        }
        
        let id = idByKey[key];
        
        // Fallback: match by name if fieldKey didn't work
        if (!id && fallbackNameMap[key]) {
          const fallbackName = fallbackNameMap[key].toLowerCase();
          id = idByName[fallbackName];
          if (id) {
            console.log(`Matched custom field by name fallback: ${key} -> ${fallbackNameMap[key]}`);
          }
        }
        
        if (id) {
          customFieldsPayload.push({ id, value: val });
          console.log(`Added custom field: ${key} = ${val}`);
        } else {
          console.log(`Custom field not found in GHL: ${key}`);
        }
      }
      
      console.log(`Successfully mapped ${customFieldsPayload.length} custom fields`);
    } catch (e) {
      console.error('Failed to parse custom fields response:', e);
      console.log('Proceeding without custom fields');
    }

    const ghlPayload: any = {
      firstName: leadPayload.contact.first_name,
      lastName: leadPayload.contact.last_name,
      email: leadPayload.contact.email,
      phone: leadPayload.contact.phone,
      address1: leadPayload.property.address,
      locationId: effectiveLocationId,
      tags: ['ppc'],
      source: leadPayload.source || 'website_form',
    };

    if (customFieldsPayload.length > 0) {
      ghlPayload.customFields = customFieldsPayload;
    }

    // Attempt 1: Raw PIT token (v2 standard)
    let headers: Record<string, string> = {
      'Authorization': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Version': '2021-07-28',
    };

    console.log('Attempt 1: Raw PIT Authorization');
    let response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(ghlPayload),
    });

    let responseText = await response.text();
    console.log('Response Status:', response.status);

    // Attempt 2: Fallback to Bearer prefix if 401/403
    if (response.status === 401 || response.status === 403) {
      console.log('Attempt 2: Trying with Bearer prefix');
      headers['Authorization'] = `Bearer ${apiKey}`;
      
      response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(ghlPayload),
      });

      responseText = await response.text();
      console.log('Response Status:', response.status);
    }

    // Attempt 3 removed: docs require locationId in body, not header

    // Process final result
    if (response.ok) {
      let contactId = 'unknown';
      try {
        const responseData = JSON.parse(responseText);
        contactId = responseData.contact?.id || responseData.id || 'unknown';
        console.log('SUCCESS - Contact ID:', contactId);
      } catch (_) {
        console.log('SUCCESS - Response not JSON');
      }

      await updateLeadGhlStatus(supabase, leadId, true, `Contact ID: ${contactId}`);
      return;
    }

    // All attempts failed
    const errorDetails = `Status ${response.status}: ${responseText.substring(0, 500)}`;
    console.error('FAILED after all attempts:', errorDetails);
    await updateLeadGhlStatus(supabase, leadId, false, errorDetails);

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Exception in GHL integration:', msg);
    await updateLeadGhlStatus(supabase, leadId, false, `Exception: ${msg}`);
  }
}

serve(handler);
