/**
 * Shared Configuration for Supabase Edge Functions
 *
 * This module provides centralized configuration management for edge functions.
 * Uses Supabase Secrets (managed via Supabase dashboard) for sensitive data.
 *
 * Important: Edge functions CANNOT access VITE_* environment variables.
 * All configuration must be stored as Supabase Secrets.
 */

export interface EdgeFunctionConfig {
  supabase: {
    url: string;
    serviceRoleKey: string;
    anonKey: string;
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
    }
  };

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
    analytics: {
      hasGtag: !!config.analytics?.gtagId,
      hasConversionLabel: !!config.analytics?.conversionLabel
    }
  });
}
