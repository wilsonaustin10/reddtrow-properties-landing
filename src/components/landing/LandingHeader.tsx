import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/Reddtrow Logo.webp";

interface LandingHeaderProps {
  phoneNumber?: string;
  onPhoneClick?: () => void;
}

const LandingHeader = ({
  phoneNumber = "210-972-0134",
  onPhoneClick
}: LandingHeaderProps) => {
  const handlePhoneClick = () => {
    // Fire tracking event
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'phone_click',
        phone_number: phoneNumber
      });
    }
    onPhoneClick?.();
  };

  return (
    <>
      <header
        className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50"
        style={{ minHeight: '72px', contain: 'layout style' }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img src={logo} alt="Reddtrow Properties" className="h-12 md:h-14 w-auto" fetchPriority="high" decoding="async" width="127" height="56" />
            </Link>

            {/* Phone CTA */}
            <a
              href={`tel:+1${phoneNumber.replace(/-/g, '')}`}
              onClick={handlePhoneClick}
              className="flex items-center space-x-2 text-primary hover:text-primary-hover transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-bold text-lg hidden sm:inline">{phoneNumber}</span>
              <span className="font-bold text-lg sm:hidden">Call Now</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile sticky phone bar - outside header to prevent CLS */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-urgency text-white py-3 px-4 flex items-center justify-center space-x-3 md:hidden z-50 shadow-lg"
        style={{ contain: 'layout style' }}
      >
        <Phone className="w-5 h-5" />
        <a
          href={`tel:+1${phoneNumber.replace(/-/g, '')}`}
          onClick={handlePhoneClick}
          className="font-bold text-lg"
        >
          Call {phoneNumber}
        </a>
      </div>
    </>
  );
};

export default LandingHeader;
