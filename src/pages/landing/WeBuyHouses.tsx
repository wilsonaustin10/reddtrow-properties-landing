import {
  LandingLayout,
  LandingHero,
  LeadForm,
  TrustBar,
  ProcessSteps,
  BenefitGrid,
  TestimonialSection,
  FAQAccordion,
  FinalCTA,
} from '@/components/landing';
import { weBuyHousesContent as content } from '@/content/landing-pages';
import { Home } from 'lucide-react';

const WeBuyHousesPage = () => {
  return (
    <LandingLayout meta={content.meta}>
      <LandingHero
        h1={content.hero.h1}
        h2={content.hero.h2}
        bullets={content.hero.bullets}
        badge={content.hero.badge}
      >
        <LeadForm
          slug={content.slug}
          adGroup={content.adGroup}
          title="We Buy Houses"
          subtitle="Any condition. Fair cash offer."
          buttonText="Get My Cash Offer"
        />
      </LandingHero>

      <TrustBar />

      {/* Types of Houses We Buy */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              Types of Houses We Buy
            </h2>
            <p className="text-lg text-muted-foreground">
              We buy all types of residential properties
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {content.houseTypes.map((type, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white p-4 rounded-lg border shadow-sm"
              >
                <Home className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="font-medium text-foreground">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProcessSteps
        steps={content.process}
        title="How We Buy Houses"
        subtitle="A simple 3-step process"
      />

      <BenefitGrid
        benefits={content.benefits}
        title="Why Sell Your House to Us"
        subtitle="Local buyers, fair offers, fast closing"
      />

      <TestimonialSection
        testimonials={content.testimonials}
        title="Homeowners We've Helped"
        subtitle="Real stories from people who sold to us"
      />

      <FAQAccordion
        faqs={content.faqs}
        title="Questions About Selling to Us"
        subtitle="Common questions about our home buying process"
      />

      <FinalCTA
        headline="We Buy Houses, Including Yours"
        subheadline="Get your fair cash offer today. No obligation, no pressure."
      >
        <LeadForm
          slug={content.slug}
          adGroup={content.adGroup}
          title="Get Your Cash Offer"
          buttonText="Get My Cash Offer Now"
          compact
        />
      </FinalCTA>
    </LandingLayout>
  );
};

export default WeBuyHousesPage;
