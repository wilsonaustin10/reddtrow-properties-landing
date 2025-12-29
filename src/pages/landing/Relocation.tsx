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
import { relocationContent as content } from '@/content/landing-pages';

const RelocationPage = () => {
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
          title="Sell Before You Move"
          subtitle="Close on your timeline. No double mortgage."
          buttonText="Get My Cash Offer"
        />
      </LandingHero>

      <TrustBar />

      <ProcessSteps
        steps={content.process}
        title="How Our Relocation Process Works"
        subtitle="We work around your moving schedule"
      />

      {/* Mid-page CTA after Process */}
      <MidPageCTA
        headline="Don't pay two mortgages"
        buttonText="Get My Cash Offer"
        variant="secondary"
        showPhone
      />

      <BenefitGrid
        benefits={content.benefits}
        title="Why Relocating Homeowners Choose Us"
        subtitle="We specialize in helping people who need to move fast"
      />

      {/* Mid-page CTA after Benefits */}
      <MidPageCTA
        headline="Focus on Your New Chapter"
        buttonText="Sell Your House Now"
        variant="primary"
        showPhone
      />

      <TestimonialSection
        testimonials={content.testimonials}
        title="We've Helped Others Relocate Stress-Free"
        subtitle="Real stories from homeowners who relocated quickly"
      />

      <FAQAccordion
        faqs={content.faqs}
        title="Relocation Sale Questions Answered"
        subtitle="Common questions about selling while relocating"
      />

      <FinalCTA
        headline="Don't Let Your Old House Hold You Back"
        subheadline="Focus on your new chapter. We'll handle your old house."
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

export default RelocationPage;
