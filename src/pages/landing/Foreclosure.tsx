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
import { foreclosureContent as content } from '@/content/landing-pages';

const ForeclosurePage = () => {
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
          title="Stop Foreclosure Now"
          subtitle="Get your free cash offer in 24 hours"
          buttonText="Get My Cash Offer"
        />
      </LandingHero>

      <TrustBar />

      <ProcessSteps
        steps={content.process}
        title="How We Stop Foreclosure"
        subtitle="Our proven 3-step process to help you avoid foreclosure"
      />

      {/* Mid-page CTA after Process */}
      <MidPageCTA
        headline="Time is critical. Get your offer now."
        buttonText="Get My Cash Offer"
        variant="secondary"
        showPhone
      />

      <BenefitGrid
        benefits={content.benefits}
        title="Why Homeowners Facing Foreclosure Choose Us"
        subtitle="We specialize in helping people in difficult situations"
      />

      {/* Mid-page CTA after Benefits */}
      <MidPageCTA
        headline="Don't Wait Until It's Too Late"
        buttonText="Get My Cash Offer Now"
        variant="primary"
        showPhone
      />

      <TestimonialSection
        testimonials={content.testimonials}
        title="We've Helped Others Avoid Foreclosure"
        subtitle="Real stories from homeowners we've helped"
      />

      <FAQAccordion
        faqs={content.faqs}
        title="Foreclosure Questions Answered"
        subtitle="Get answers to common questions about selling before foreclosure"
      />

      <FinalCTA
        headline="Don't Wait. Time Is Critical"
        subheadline="The sooner you act, the more options you have. Get your cash offer today."
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

export default ForeclosurePage;
