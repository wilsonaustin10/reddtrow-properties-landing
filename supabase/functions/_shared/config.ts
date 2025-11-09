/**
 * Shared Configuration for Supabase Edge Functions
 * 
 * This module provides centralized configuration management for edge functions.
 * Uses Supabase Secrets (managed via Supabase dashboard) for sensitive data.
 * 
 * Important: Edge functions CANNOT access VITE_* environment variables.
 * All configuration must be stored as Supabase Secrets.
 */

export interface CustomFieldIdConfig {
  askingPrice?: string;
  timeline?: string;
  propertyListed?: string;
  condition?: string;
  gclid?: string;
  wbraid?: string;
  gbraid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmCampaignId?: string;
  utmAdgroupId?: string;
  utmTerm?: string;
  utmDevice?: string;
  utmCreative?: string;
  utmNetwork?: string;
  utmAssetGroup?: string;
  utmHeadline?: string;
  landingPage?: string;
  referrer?: string;
  sessionId?: string;
  [key: string]: string | undefined;
}

export interface EdgeFunctionConfig {
  supabase: {
    url: string;
    serviceRoleKey: string;
    anonKey: string;
  };
  integrations: {
    zapier?: {
      webhookUrl: string;
    };
    ghl?: {
      apiKey: string;
      locationId?: string;
      customFieldIds?: CustomFieldIdConfig;
    };
  };
  analytics?: {
    gtagId?: string;
    conversionLabel?: string;
  };
}

/**
 * Get configuration from Supabase Secrets
 * Throws an error if required secrets are missing
 */
export function getEdgeFunctionConfig(): EdgeFunctionConfig {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required Supabase configuration: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  }

  const config: EdgeFunctionConfig = {
    supabase: {
      url: supabaseUrl,
      serviceRoleKey: supabaseServiceKey,
      anonKey: supabaseAnonKey || ''
    },
    integrations: {}
  };

  // Optional Zapier integration
  const zapierWebhookUrl = Deno.env.get('ZAPIER_WEBHOOK_URL');
  if (zapierWebhookUrl && zapierWebhookUrl.trim()) {
    config.integrations.zapier = {
      webhookUrl: zapierWebhookUrl.trim()
    };
  }

  // Optional Go High Level integration
  const ghlApiKey = Deno.env.get('GHL_API_KEY');
  const ghlLocationId = Deno.env.get('GHL_LOCATION_ID');
  const ghlCustomFieldAskingPrice = Deno.env.get('GHL_CUSTOM_FIELD_ASKING_PRICE_ID');
  const ghlCustomFieldTimeline = Deno.env.get('GHL_CUSTOM_FIELD_TIMELINE_ID');
  const ghlCustomFieldPropertyListed = Deno.env.get('GHL_CUSTOM_FIELD_PROPERTY_LISTED_ID');
  const ghlCustomFieldCondition = Deno.env.get('GHL_CUSTOM_FIELD_CONDITION_ID');
  const attributionFieldEnvMap: Record<keyof Omit<CustomFieldIdConfig, 'askingPrice' | 'timeline' | 'propertyListed' | 'condition'>, string> = {
    gclid: 'GHL_CUSTOM_FIELD_GCLID_ID',
    wbraid: 'GHL_CUSTOM_FIELD_WBRAID_ID',
    gbraid: 'GHL_CUSTOM_FIELD_GBRAID_ID',
    utmSource: 'GHL_CUSTOM_FIELD_UTM_SOURCE_ID',
    utmMedium: 'GHL_CUSTOM_FIELD_UTM_MEDIUM_ID',
    utmCampaign: 'GHL_CUSTOM_FIELD_UTM_CAMPAIGN_ID',
    utmCampaignId: 'GHL_CUSTOM_FIELD_UTM_CAMPAIGNID_ID',
    utmAdgroupId: 'GHL_CUSTOM_FIELD_UTM_ADGROUPID_ID',
    utmTerm: 'GHL_CUSTOM_FIELD_UTM_TERM_ID',
    utmDevice: 'GHL_CUSTOM_FIELD_UTM_DEVICE_ID',
    utmCreative: 'GHL_CUSTOM_FIELD_UTM_CREATIVE_ID',
    utmNetwork: 'GHL_CUSTOM_FIELD_UTM_NETWORK_ID',
    utmAssetGroup: 'GHL_CUSTOM_FIELD_UTM_ASSETGROUP_ID',
    utmHeadline: 'GHL_CUSTOM_FIELD_UTM_HEADLINE_ID',
    landingPage: 'GHL_CUSTOM_FIELD_LANDING_PAGE_ID',
    referrer: 'GHL_CUSTOM_FIELD_REFERRER_ID',
    sessionId: 'GHL_CUSTOM_FIELD_SESSION_ID_ID'
  };
  if (ghlApiKey && ghlApiKey.trim()) {
    const customFieldIds: CustomFieldIdConfig = {
      askingPrice: ghlCustomFieldAskingPrice?.trim(),
      timeline: ghlCustomFieldTimeline?.trim(),
      propertyListed: ghlCustomFieldPropertyListed?.trim(),
      condition: ghlCustomFieldCondition?.trim()
    };

    for (const [key, envVar] of Object.entries(attributionFieldEnvMap)) {
      const envValue = Deno.env.get(envVar);
      if (envValue && envValue.trim()) {
        customFieldIds[key] = envValue.trim();
      }
    }

    const hasCustomFieldOverrides = Object.values(customFieldIds).some(Boolean);

    config.integrations.ghl = {
      apiKey: ghlApiKey.trim(),
      locationId: ghlLocationId?.trim(),
      customFieldIds: hasCustomFieldOverrides ? customFieldIds : undefined
    };
  }

  // Optional Analytics
  const gtagId = Deno.env.get('GTAG_ID');
  const conversionLabel = Deno.env.get('CONVERSION_LABEL');
  if (gtagId || conversionLabel) {
    config.analytics = {
      gtagId: gtagId?.trim(),
      conversionLabel: conversionLabel?.trim()
    };
  }

  return config;
}

/**
 * Validate that all required secrets for a specific integration are present
 */
export function validateIntegrationConfig(integration: 'zapier' | 'ghl'): boolean {
  const config = getEdgeFunctionConfig();
  
  switch (integration) {
    case 'zapier':
      return !!config.integrations.zapier?.webhookUrl;
    case 'ghl':
      return !!config.integrations.ghl?.apiKey;
    default:
      return false;
  }
}

/**
 * Log configuration status (without sensitive data)
 */
export function logConfigStatus() {
  const config = getEdgeFunctionConfig();
  
  console.log('Edge Function Configuration Status:', {
    supabase: {
      hasUrl: !!config.supabase.url,
      hasServiceKey: !!config.supabase.serviceRoleKey,
      hasAnonKey: !!config.supabase.anonKey
    },
    integrations: {
      zapier: !!config.integrations.zapier,
      ghl: !!config.integrations.ghl
    },
    analytics: {
      hasGtag: !!config.analytics?.gtagId,
      hasConversionLabel: !!config.analytics?.conversionLabel
    }
  });
}
