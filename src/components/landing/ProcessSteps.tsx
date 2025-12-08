import { Card, CardContent } from "@/components/ui/card";

interface Step {
  step: number;
  title: string;
  description: string;
}

interface ProcessStepsProps {
  steps: Step[];
  title?: string;
  subtitle?: string;
}

const ProcessSteps = ({
  steps,
  title = "How It Works",
  subtitle = "Get Your Cash Offer in 3 Simple Steps"
}: ProcessStepsProps) => {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="text-center relative overflow-visible">
              <CardContent className="p-6 pt-8">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-3 mt-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>

              {/* Connector arrow (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
