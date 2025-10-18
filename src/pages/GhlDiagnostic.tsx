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

              <div className="space-y-2">
                <h4 className="font-semibold">API Tests:</h4>
                {Object.entries(results.tests || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="p-3 bg-muted rounded border-l-4 border-l-primary">
                    <div className="font-medium">{key}</div>
                    <div className="text-sm text-muted-foreground">
                      Status: {value.status} | Success: {value.success ? "✅" : "❌"}
                    </div>
                    {value.error && (
                      <div className="text-sm text-destructive mt-1">Error: {value.error}</div>
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
