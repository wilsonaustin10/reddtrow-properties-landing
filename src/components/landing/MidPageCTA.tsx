import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

interface MidPageCTAProps {
  headline?: string;
  buttonText?: string;
  formId?: string;
  variant?: "primary" | "secondary" | "minimal";
  showPhone?: boolean;
}

const MidPageCTA = ({
  headline = "Ready to get your cash offer?",
  buttonText = "Get My Cash Offer Now",
  formId = "lead-form",
  variant = "primary",
  showPhone = false
}: MidPageCTAProps) => {
  const scrollToForm = () => {
    const form = document.getElementById(formId);
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (variant === "minimal") {
    return (
      <div className="py-6 text-center">
        <Button
          onClick={scrollToForm}
          className="urgency-button font-bold text-base px-8 h-12"
          size="lg"
        >
          {buttonText}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  if (variant === "secondary") {
    return (
      <section className="py-8 bg-gray-50 border-y">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold text-primary mb-4">{headline}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={scrollToForm}
              className="urgency-button font-bold text-base px-8 h-12"
              size="lg"
            >
              {buttonText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            {showPhone && (
              <a href="tel:+14693041747" className="flex items-center text-primary font-medium hover:underline">
                <Phone className="w-4 h-4 mr-1" />
                (469) 304-1747
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Primary variant (default)
  return (
    <section className="py-10 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">{headline}</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={scrollToForm}
            variant="secondary"
            className="font-bold text-base px-8 h-14 bg-white text-primary hover:bg-gray-100"
            size="lg"
          >
            {buttonText}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          {showPhone && (
            <a href="tel:+14693041747" className="flex items-center text-white font-medium hover:underline">
              <Phone className="w-5 h-5 mr-2" />
              Or Call: (469) 304-1747
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default MidPageCTA;
