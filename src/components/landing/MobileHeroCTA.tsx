import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface MobileHeroCTAProps {
  buttonText?: string;
  formId?: string;
}

const MobileHeroCTA = ({
  buttonText = "Get My Cash Offer",
  formId = "lead-form"
}: MobileHeroCTAProps) => {
  const scrollToForm = () => {
    const form = document.getElementById(formId);
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Button
      onClick={scrollToForm}
      className="w-full h-14 urgency-button font-bold text-lg shadow-lg"
      size="lg"
    >
      {buttonText}
      <ArrowRight className="w-5 h-5 ml-2" />
    </Button>
  );
};

export default MobileHeroCTA;
