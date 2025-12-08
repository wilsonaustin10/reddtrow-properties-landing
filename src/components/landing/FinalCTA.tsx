import { ReactNode } from "react";

interface FinalCTAProps {
  headline?: string;
  subheadline?: string;
  children: ReactNode; // Form slot
}

const FinalCTA = ({
  headline = "Ready to Get Your Cash Offer?",
  subheadline = "Fill out the form below and get a fair cash offer within 24 hours. No obligation, no pressure.",
  children
}: FinalCTAProps) => {
  return (
    <section className="py-12 md:py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {headline}
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              {subheadline}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-primary-foreground/80 text-sm">
              No repairs needed. No fees or commissions. Close on your timeline.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
