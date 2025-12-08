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
import { cashBuyersContent as content } from '@/content/landing-pages';

const CashBuyersPage = () => {
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
          title="Cash Offer in 24 Hours"
          subtitle="No banks. No delays. Just cash."
          buttonText="Get My Cash Offer"
        />
      </LandingHero>

      <TrustBar />

      {/* Cash vs. Financed Comparison */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              Cash vs. Financed Buyer
            </h2>
            <p className="text-lg text-muted-foreground">
              See why a cash sale is faster and more certain
            </p>
          </div>
          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full bg-white rounded-lg border shadow-sm">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  {content.comparison.headers.map((header, index) => (
                    <th key={index} className="py-4 px-6 text-left font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.comparison.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="py-4 px-6 font-medium">
                        {cellIndex === 2 ? (
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
        title="How Cash Buying Works"
        subtitle="Get cash for your house in 3 simple steps"
      />

      <BenefitGrid
        benefits={content.benefits}
        title="Benefits of Selling to Cash Buyers"
        subtitle="Why a cash sale makes sense for you"
      />

      <TestimonialSection
        testimonials={content.testimonials}
        title="Homeowners Who Chose Cash"
        subtitle="Real stories from people who sold for cash"
      />

      <FAQAccordion
        faqs={content.faqs}
        title="Cash Buyer Questions Answered"
        subtitle="Common questions about selling for cash"
      />

      <FinalCTA
        headline="Get Cash for Your House Today"
        subheadline="No banks, no delays, no contingencies. Just a fair cash offer."
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

export default CashBuyersPage;
