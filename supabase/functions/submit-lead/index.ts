import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Zapier webhook URL for lead submissions
const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/24118417/uae0wfe/';

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
  lastName: z.string().trim().max(100, "Last name too long").optional().default(''),
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

    // Get Supabase configuration
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required Supabase configuration');
    }

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
      console.log('Bot detected: honeypot field filled with value:', leadData.website);

      // Return success response to avoid tipping off the bot
      return new Response(JSON.stringify({
        success: true,
        message: 'Lead submitted successfully'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Honeypot check passed (field empty)');
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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // Prepare lead data for Zapier
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
        full_name: `${leadData.firstName} ${leadData.lastName}`.trim(),
        email: leadData.email,
        phone: leadData.phone,
        sms_consent: leadData.smsConsent
      },
      source: 'website_form',
      attribution: storedAttribution ?? undefined
    };

    // Send to Zapier webhook
    console.log('Sending to Zapier webhook...');
    runBackgroundTask(async () => {
      await sendToZapier(leadPayload, supabase, lead.id);
    }, 'Zapier Integration');

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

async function sendToZapier(leadPayload: any, supabase: any, leadId: string) {
  try {
    const response = await fetch(ZAPIER_WEBHOOK_URL, {
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

serve(handler);
