import { Star, Shield, Award } from "lucide-react";
import bbbLogo from "@/assets/bbb-logo.jpg";

interface TrustBarProps {
  showBBB?: boolean;
}

const TrustBar = ({ showBBB = true }: TrustBarProps) => {
  return (
    <section className="bg-gray-50 border-y border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {/* Star Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-semibold text-foreground">4.9/5 Rating</span>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-gray-300" />

          {/* Reviews Count */}
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">100+ Homes Purchased</span>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-gray-300" />

          {/* BBB Logo */}
          {showBBB && (
            <a
              href="https://www.bbb.org/us/tx/midlothian/profile/real-estate-investing/reddtrow-properties-llc-0875-90843940#bbbseal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <img src={bbbLogo} alt="BBB Accredited Business" className="h-10 w-auto" />
            </a>
          )}

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-gray-300" />

          {/* Google Reviews */}
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-green-600" />
            <span className="font-medium text-foreground">Verified Cash Buyers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
