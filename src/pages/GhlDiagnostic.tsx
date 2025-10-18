import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GhlDiagnostic = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const runDiagnostic = async () => {
    setIsLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke("ghl-diagnose", {
        body: {},
      });

      if (error) {
        console.error("Diagnostic error:", error);
        toast({
          title: "Diagnostic Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setResults(data);
      toast({
        title: "Diagnostic Complete",
        description: "Check results below",
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "Failed to run diagnostic",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>GHL Integration Diagnostic</CardTitle>
          <CardDescription>
            Test your GoHighLevel API connection and configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runDiagnostic} disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Run Diagnostic
          </Button>

          {results && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Diagnosis: {results.diagnosis}</h3>
                {results.recommendedEndpoint && (
                  <p className="text-sm text-muted-foreground">
                    Recommended Endpoint: {results.recommendedEndpoint}
                  </p>
                )}
              </div>

              {/* Configuration Summary */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>API Key:</span>
                    <span className={results.apiKey_is_pit ? "text-green-600" : "text-destructive"}>
                      {results.apiKey_present ? (results.apiKey_is_pit ? "✅ Valid PIT" : "❌ Not a PIT token") : "❌ Missing"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location ID:</span>
                    <span className={results.location_id_present && !results.location_id_looks_like_pit ? "text-green-600" : "text-destructive"}>
                      {results.location_id_present 
                        ? (results.location_id_looks_like_pit ? "❌ Looks like PIT token" : "✅ Present") 
                        : "❌ Missing"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custom Fields:</span>
                    <span className={results.custom_fields_count > 0 ? "text-green-600" : "text-yellow-600"}>
                      {results.custom_fields_count > 0 
                        ? `✅ ${results.custom_fields_count} fields found` 
                        : "⚠️ No custom fields"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Custom Fields Details */}
              {results.custom_fields && results.custom_fields.length > 0 && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">Custom Fields (First 10)</h4>
                  <div className="space-y-2">
                    {results.custom_fields.map((field: any, idx: number) => (
                      <div key={idx} className="text-sm p-2 bg-muted rounded">
                        <div className="font-medium">{field.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Key: {field.fieldKey || "N/A"} | ID: {field.id}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {(results.custom_fields_count === 0 || !results.apiKey_is_pit || results.location_id_looks_like_pit) && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">⚠️ Action Required</h4>
                  <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                    {!results.apiKey_is_pit && (
                      <li>• GHL_API_KEY must be a Private Integration Token (starts with "pit-")</li>
                    )}
                    {results.location_id_looks_like_pit && (
                      <li>• GHL_LOCATION_ID should be your Sub-Account Location ID, not a PIT token</li>
                    )}
                    {results.custom_fields_count === 0 && (
                      <li>• Create custom fields in GHL: asking_price, timeline, condition, property_listed</li>
                    )}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-semibold">API Tests:</h4>
                {Object.entries(results.tests || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="p-3 bg-muted rounded border-l-4 border-l-primary">
                    <div className="font-medium">{key}</div>
                    <div className="text-sm text-muted-foreground">
                      Status: {value.status} | Success: {value.ok ? "✅" : "❌"}
                    </div>
                    {value.count !== undefined && (
                      <div className="text-sm mt-1">Fields: {value.count}</div>
                    )}
                  </div>
                ))}
              </div>

              <details className="p-4 bg-muted rounded-lg">
                <summary className="cursor-pointer font-semibold">Raw Results</summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GhlDiagnostic;
