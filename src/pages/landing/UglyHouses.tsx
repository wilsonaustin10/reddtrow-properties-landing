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
import { uglyHousesContent as content } from '@/content/landing-pages';
import { Check } from 'lucide-react';

const UglyHousesPage = () => {
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
          title="We Buy Ugly Houses"
          subtitle="Any condition. Fair cash offer."
          buttonText="Get My Cash Offer"
        />
      </LandingHero>

      <TrustBar />

      {/* Unique Section: Conditions We Buy */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              Conditions We Buy
            </h2>
            <p className="text-lg text-muted-foreground">
              If your house has any of these issues, we'll still buy it
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {content.conditions.map((condition, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white p-4 rounded-lg border shadow-sm"
              >
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-medium text-foreground">{condition}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProcessSteps
        steps={content.process}
        title="How It Works"
        subtitle="Sell your ugly house in 3 simple steps"
      />

      <BenefitGrid
        benefits={content.benefits}
        title="Why Sell Your Ugly House to Us"
        subtitle="No judgment, no repairs, no hassle"
      />

      <TestimonialSection
        testimonials={content.testimonials}
        title="We've Bought These Ugly Houses"
        subtitle="Real stories from homeowners with distressed properties"
      />

      <FAQAccordion
        faqs={content.faqs}
        title="Ugly House Questions Answered"
        subtitle="Common questions about selling a house in bad condition"
      />

      <FinalCTA
        headline="Your House Isn't Too Ugly for Us"
        subheadline="We've seen worse. Get a fair cash offer today."
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

export default UglyHousesPage;
