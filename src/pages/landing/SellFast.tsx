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
import { sellFastContent as content } from '@/content/landing-pages';

const SellFastPage = () => {
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
          title="Get Your Cash Offer"
          subtitle="Fair offer in 24 hours. Close in 7 days."
          buttonText="Get My Cash Offer"
        />
      </LandingHero>

      <TrustBar />

      {/* Comparison Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              Compare Your Options
            </h2>
            <p className="text-lg text-muted-foreground">
              See why selling to us is faster and easier
            </p>
          </div>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full bg-white rounded-lg border shadow-sm">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  {content.comparison.headers.map((header, index) => (
                    <th key={index} className="py-4 px-4 text-left font-semibold text-sm md:text-base">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.comparison.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="py-4 px-4 font-medium text-sm md:text-base">
                        {cellIndex === 3 ? (
                          <span className="text-green-600 font-bold">{cell}</span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ProcessSteps
        steps={content.process}
        title="How It Works"
        subtitle="Sell your house fast in 3 simple steps"
      />

      <BenefitGrid
        benefits={content.benefits}
        title="Why Sell Your House Fast With Us"
        subtitle="The fastest, easiest way to sell your house"
      />

      <TestimonialSection
        testimonials={content.testimonials}
        title="Homeowners Who Sold Fast"
        subtitle="Real stories from people who needed to sell quickly"
      />

      <FAQAccordion
        faqs={content.faqs}
        title="Fast Sale Questions Answered"
        subtitle="Everything you need to know about selling fast"
      />

      <FinalCTA
        headline="Ready to Sell Your House Fast?"
        subheadline="Get your cash offer in 24 hours and close in as little as 7 days."
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

export default SellFastPage;
