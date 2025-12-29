import { Star, Shield, Award } from "lucide-react";
import bbbLogo from "@/assets/bbb-logo.webp";

const MobileTrustBadges = () => {
  return (
    <div className="flex flex-col items-center space-y-3">
      {/* BBB Badge - Most Prominent */}
      <a
        href="https://www.bbb.org/us/tx/midlothian/profile/real-estate-investing/reddtrow-properties-llc-0875-90843940#bbbseal"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/20 transition-colors"
      >
        <img
          src={bbbLogo}
          alt="BBB Accredited Business"
          className="h-12 w-auto"
          decoding="async"
          width="30"
          height="48"
        />
        <span className="ml-3 text-white font-semibold text-sm">BBB Accredited</span>
      </a>

      {/* Trust Stats Row */}
      <div className="flex items-center justify-center space-x-4 text-white/90 text-sm">
        {/* Star Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="font-medium">4.9</span>
        </div>

        <span className="text-white/50">|</span>

        {/* Homes Purchased */}
        <div className="flex items-center space-x-1">
          <Shield className="w-4 h-4 text-green-400" />
          <span className="font-medium">100+ Homes</span>
        </div>

        <span className="text-white/50">|</span>

        {/* Verified */}
        <div className="flex items-center space-x-1">
          <Award className="w-4 h-4 text-green-400" />
          <span className="font-medium">Verified</span>
        </div>
      </div>
    </div>
  );
};

export default MobileTrustBadges;
