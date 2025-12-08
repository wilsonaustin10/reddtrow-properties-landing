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
import { companiesThatBuyHousesContent as content } from '@/content/landing-pages';
import { AlertTriangle, Check } from 'lucide-react';

const CompaniesThatBuyHousesPage = () => {
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
          title="Get a Transparent Offer"
          subtitle="See why homeowners choose us."
          buttonText="Get My Cash Offer"
        />
      </LandingHero>

      <TrustBar />

      {/* Unique Section: Us vs. National iBuyers Comparison */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              How We Compare
            </h2>
            <p className="text-lg text-muted-foreground">
              See the difference between us and national iBuyers
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
        title="How to Choose the Right Company"
        subtitle="Our transparent process helps you make the right choice"
      />

      <BenefitGrid
        benefits={content.benefits}
        title="Why Homeowners Choose Us"
        subtitle="What sets us apart from other home buying companies"
      />

      {/* Red Flags Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              Red Flags to Watch For
            </h2>
            <p className="text-lg text-muted-foreground">
              Be careful of companies that do any of these things
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {content.redFlags.map((flag, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 bg-red-50 p-4 rounded-lg border border-red-100"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="font-medium text-foreground">{flag}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-2 bg-green-50 px-6 py-3 rounded-full border border-green-100">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-700">We do none of these things.</span>
            </div>
          </div>
        </div>
      </section>

      <TestimonialSection
        testimonials={content.testimonials}
        title="Why Homeowners Chose Us"
        subtitle="Real stories from people who compared their options"
      />

      <FAQAccordion
        faqs={content.faqs}
        title="Questions About Home Buying Companies"
        subtitle="What you should know before choosing a company"
      />

      <FinalCTA
        headline="Compare Us to Anyone"
        subheadline="We're confident in our fair, transparent approach. Get your offer and see for yourself."
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

export default CompaniesThatBuyHousesPage;
