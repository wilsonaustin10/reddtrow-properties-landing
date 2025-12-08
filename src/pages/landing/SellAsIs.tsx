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
import { sellAsIsContent as content } from '@/content/landing-pages';
import { Check } from 'lucide-react';

const SellAsIsPage = () => {
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
          title="Sell As-Is Today"
          subtitle="No repairs. No cleaning. No hassle."
          buttonText="Get My Cash Offer"
        />
      </LandingHero>

      <TrustBar />

      {/* Unique Section: What You Can Leave Behind */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              What You Can Leave Behind
            </h2>
            <p className="text-lg text-muted-foreground">
              Don't worry about any of this — we'll take care of it
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {content.leaveBehinds.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white p-4 rounded-lg border shadow-sm"
              >
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProcessSteps
        steps={content.process}
        title="How Our As-Is Process Works"
        subtitle="The simplest way to sell your house"
      />

      <BenefitGrid
        benefits={content.benefits}
        title="Benefits of Selling As-Is"
        subtitle="Why homeowners love our no-hassle approach"
      />

      <TestimonialSection
        testimonials={content.testimonials}
        title="Homeowners Who Sold As-Is"
        subtitle="Real stories from people who skipped the repairs"
      />

      <FAQAccordion
        faqs={content.faqs}
        title="As-Is Sale Questions Answered"
        subtitle="Common questions about selling your house as-is"
      />

      <FinalCTA
        headline="Leave the Mess to Us"
        subheadline="Sell your house exactly as it is. Get a fair cash offer today."
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

export default SellAsIsPage;
