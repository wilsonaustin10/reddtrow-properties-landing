import { ReactNode } from "react";
import { Check, Star, Shield, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import bbbLogo from "@/assets/bbb-logo.webp";

interface LandingHeroProps {
  h1: string;
  h2: string;
  bullets: string[];
  badge?: string;
  ctaButtonText?: string;
  children: ReactNode; // Form slot
}

const LandingHero = ({ h1, h2, bullets, badge, ctaButtonText = "Get My Cash Offer", children }: LandingHeroProps) => {
  const scrollToForm = () => {
    const form = document.getElementById("lead-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      className="hero-section relative min-h-[auto] lg:min-h-[650px] flex items-center py-8 md:py-12 text-white"
      style={{
        contain: 'layout style paint',
        containIntrinsicBlockSize: '600px',
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-4 lg:space-y-6 order-1">
            {/* Badge - Desktop only */}
            {badge && (
              <div className="hidden lg:inline-block">
                <div className="success-badge px-4 lg:px-6 py-2 lg:py-3 rounded-full text-sm lg:text-lg font-bold shadow-lg">
                  {badge}
                </div>
              </div>
            )}

            {/* 1. H1 */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              {h1}
            </h1>

            {/* 2. H2 */}
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed">
              {h2}
            </p>

            {/* 3. Benefits/Bullets */}
            <ul className="space-y-2 lg:space-y-3 py-2">
              {bullets.map((bullet, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 lg:w-6 lg:h-6 text-urgency flex-shrink-0 mt-0.5" />
                  <span className="text-base lg:text-lg font-medium">{bullet}</span>
                </li>
              ))}
            </ul>

            {/* 4. Trust Badges - Mobile Prominent */}
            <div className="lg:hidden">
              {/* BBB Badge - Most Prominent */}
              <a
                href="https://www.bbb.org/us/tx/midlothian/profile/real-estate-investing/reddtrow-properties-llc-0875-90843940#bbbseal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 hover:bg-white/20 transition-colors mb-3"
              >
                <img
                  src={bbbLogo}
                  alt="BBB Accredited Business"
                  className="h-12 w-auto"
                  decoding="async"
                  width="30"
                  height="48"
                />
                <span className="ml-3 text-white font-semibold">BBB Accredited Business</span>
              </a>

              {/* Trust Stats Row */}
              <div className="flex items-center justify-center space-x-3 text-white/90 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-medium">4.9</span>
                </div>
                <span className="text-white/50">|</span>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="font-medium">100+ Homes</span>
                </div>
                <span className="text-white/50">|</span>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-green-400" />
                  <span className="font-medium">Verified</span>
                </div>
              </div>
            </div>

            {/* 5. CTA Button - Mobile Only */}
            <div className="lg:hidden pt-2">
              <Button
                onClick={scrollToForm}
                className="w-full h-14 urgency-button font-bold text-lg shadow-lg"
                size="lg"
              >
                {ctaButtonText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-center text-sm text-white/70 mt-2">
                No obligation - takes 60 seconds
              </p>
            </div>

            {/* Desktop Trust Text */}
            <div className="hidden lg:flex flex-col md:flex-row items-start md:items-center md:space-x-4 space-y-2 md:space-y-0 text-sm lg:text-base text-white/90 pt-2">
              <span className="font-medium">No Obligation</span>
              <span className="hidden md:inline">|</span>
              <span className="font-medium">100% Free</span>
              <span className="hidden md:inline">|</span>
              <span className="font-medium">Completely Confidential</span>
            </div>
          </div>

          {/* Form Side - Desktop: Visible. Mobile: Shows after scrolling past CTA */}
          <div className="order-2 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
