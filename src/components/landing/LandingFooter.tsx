import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import emblemLogo from "@/assets/reddtrow-emblem.webp";

interface LandingFooterProps {
  phoneNumber?: string;
  email?: string;
}

const LandingFooter = ({
  phoneNumber = "210-972-0134",
  email = "info@reddtrowproperties.com"
}: LandingFooterProps) => {
  return (
    <footer className="bg-primary text-primary-foreground pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <img src={emblemLogo} alt="Reddtrow Properties" className="h-16 w-auto mx-auto md:mx-0 mb-4" loading="lazy" decoding="async" width="51" height="64" />
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              We're local cash home buyers helping homeowners sell their properties quickly and fairly.
            </p>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a
                href={`tel:+1${phoneNumber.replace(/-/g, '')}`}
                className="flex items-center justify-center md:justify-start space-x-2 hover:text-urgency transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{phoneNumber}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center justify-center md:justify-start space-x-2 hover:text-urgency transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{email}</span>
              </a>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Serving Your Area</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link to="/privacy-policy" className="block hover:text-urgency transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-conditions" className="block hover:text-urgency transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/about" className="block hover:text-urgency transition-colors">
                About Us
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6">
          <div className="text-center space-y-3">
            <p className="text-xs text-primary-foreground/60">
              &copy; {new Date().getFullYear()} Reddtrow Properties, LLC. All rights reserved.
            </p>
            <p className="text-xs text-primary-foreground/60 max-w-2xl mx-auto">
              We are professional real estate investors. We are not real estate agents.
              We do not list houses. We buy houses directly from homeowners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
