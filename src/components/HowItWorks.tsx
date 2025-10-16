import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Submit Your Info",
      description: "Within 7 minutes or less, a member of our team will reach out to arrange a consultation, entirely free of any obligation."
    },
    {
      number: "2", 
      title: "Let's Have A Conversation",
      description: "Anticipate a call from our team to discuss the details of your property with you."
    },
    {
      number: "3",
      title: "Receive Your Cash Offer",
      description: "When you approve our offer, we will close on your timeline and you get paid within days. It is that simple."
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            The Process Is As Simple As 1,2,3
          </h2>
          <p className="text-xl text-muted-foreground">
            Sell Your House Fast For Cash In 3 Simple Steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="text-center relative">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;