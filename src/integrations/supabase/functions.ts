const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL) {
  throw new Error("VITE_SUPABASE_URL is not defined");
}

if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("VITE_SUPABASE_PUBLISHABLE_KEY is not defined");
}

export type InvokeSupabaseFunctionOptions = {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
};

export type InvokeSupabaseFunctionResult<T> = {
  data: T | null;
  error: Error | null;
};

export async function invokeSupabaseFunction<T = unknown>(
  name: string,
  options: InvokeSupabaseFunctionOptions = {}
): Promise<InvokeSupabaseFunctionResult<T>> {
  const { method = "POST", body, headers } = options;

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_PUBLISHABLE_KEY,
        ...(headers ?? {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    let parsed: unknown = null;

    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch (parseError) {
        parsed = text;
      }
    }

    if (!response.ok) {
      const message =
        (typeof parsed === "object" && parsed !== null && "error" in parsed
          ? String((parsed as { error?: unknown }).error)
          : typeof parsed === "object" && parsed !== null && "message" in parsed
            ? String((parsed as { message?: unknown }).message)
            : response.statusText) || "Unexpected error";

      return {
        data: null,
        error: new Error(message),
      };
    }

    return {
      data: parsed as T,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
