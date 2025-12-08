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
import { divorceContent as content } from '@/content/landing-pages';

const DivorcePage = () => {
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
          title="Get a Fair Cash Offer"
          subtitle="Fair for both parties. Fast closing."
          buttonText="Get My Cash Offer"
        />
      </LandingHero>

      <TrustBar />

      <ProcessSteps
        steps={content.process}
        title="How It Works for Divorce Sales"
        subtitle="A simple process that's fair for both parties"
      />

      <BenefitGrid
        benefits={content.benefits}
        title="Why Divorcing Couples Choose Us"
        subtitle="We make the process simple and fair for everyone"
      />

      <TestimonialSection
        testimonials={content.testimonials}
        title="We've Helped Other Couples Move On"
        subtitle="Real stories from people who sold during divorce"
      />

      <FAQAccordion
        faqs={content.faqs}
        title="Divorce Sale Questions Answered"
        subtitle="Common questions about selling your house during divorce"
      />

      <FinalCTA
        headline="Ready to Move On?"
        subheadline="Get one thing off your plate. A fair cash offer with no drama."
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

export default DivorcePage;
