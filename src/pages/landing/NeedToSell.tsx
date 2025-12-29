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
  MidPageCTA,
} from '@/components/landing';
import { needToSellContent as content } from '@/content/landing-pages';
import { Link } from 'react-router-dom';

const NeedToSellPage = () => {
  return (
    <LandingLayout meta={content.meta}>
      <LandingHero
        h1={content.hero.h1}
        h2={content.hero.h2}
        bullets={content.hero.bullets}
        badge={content.hero.badge}
        ctaButtonText="Get My Cash Offer"
      >
        <LeadForm
          slug={content.slug}
          adGroup={content.adGroup}
          title="Get Your Free Cash Offer"
          subtitle="No obligation. See your options in 24 hours."
          buttonText="Get My Cash Offer"
        />
      </LandingHero>

      <TrustBar />

      {/* Unique Section: Situations Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              Situations We Help With
            </h2>
            <p className="text-lg text-muted-foreground">
              Whatever you're facing, we've helped others in the same situation
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {content.situations.map((situation, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border-2 border-primary/10 hover:border-primary/30 transition-colors text-center"
              >
                <span className="font-semibold text-foreground">{situation}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Don't see your situation?{' '}
              <Link to="#" className="text-primary font-semibold hover:underline">
                Contact us anyway
              </Link>
              . We've seen it all.
            </p>
          </div>
        </div>
      </section>

      {/* Mid-page CTA after Situations */}
      <MidPageCTA
        headline="Whatever your situation, we can help"
        buttonText="Get My Cash Offer"
        variant="secondary"
        showPhone
      />

      <ProcessSteps
        steps={content.process}
        title="How It Works"
        subtitle="Get your cash offer in 3 simple steps"
      />

      <BenefitGrid
        benefits={content.benefits}
        title="Why This Is Your Best Option"
        subtitle="Compare the alternatives and see why we make sense"
      />

      {/* Mid-page CTA after Benefits */}
      <MidPageCTA
        headline="See Your Options Today"
        buttonText="Get Your Cash Offer Now"
        variant="primary"
        showPhone
      />

      <TestimonialSection
        testimonials={content.testimonials}
        title="We've Helped Homeowners Like You"
        subtitle="Real stories from people who needed to sell fast"
      />

      <FAQAccordion
        faqs={content.faqs}
        title="Your Questions Answered"
        subtitle="Common questions about selling your house fast"
      />

      <FinalCTA
        headline="Whatever Your Situation, We Can Help"
        subheadline="Get a fair cash offer with no obligation. See your options today."
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

export default NeedToSellPage;
