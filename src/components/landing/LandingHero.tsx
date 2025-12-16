import { ReactNode } from "react";
import { Check } from "lucide-react";

interface LandingHeroProps {
  h1: string;
  h2: string;
  bullets: string[];
  badge?: string;
  children: ReactNode; // Form slot
}

const LandingHero = ({ h1, h2, bullets, badge, children }: LandingHeroProps) => {
  return (
    <section
      className="hero-section relative min-h-[550px] md:min-h-[600px] lg:min-h-[650px] flex items-center py-8 md:py-12 text-white"
      style={{
        contain: 'layout style paint',
        containIntrinsicBlockSize: '600px',
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-4 lg:space-y-6 order-2 lg:order-1">
            {badge && (
              <div className="inline-block">
                <div className="success-badge px-4 lg:px-6 py-2 lg:py-3 rounded-full text-sm lg:text-lg font-bold shadow-lg">
                  {badge}
                </div>
              </div>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              {h1}
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed">
              {h2}
            </p>

            <ul className="space-y-3 py-2">
              {bullets.map((bullet, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Check className="w-6 h-6 text-urgency flex-shrink-0 mt-0.5" />
                  <span className="text-base lg:text-lg font-medium">{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-4 space-y-2 md:space-y-0 text-sm lg:text-base text-white/90 pt-2">
              <span className="font-medium">No Obligation</span>
              <span className="hidden md:inline">|</span>
              <span className="font-medium">100% Free</span>
              <span className="hidden md:inline">|</span>
              <span className="font-medium">Completely Confidential</span>
            </div>
          </div>

          {/* Form Side */}
          <div className="order-1 lg:order-2 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
