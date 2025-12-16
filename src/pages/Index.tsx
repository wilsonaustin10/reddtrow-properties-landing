import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

// Lazy load below-the-fold components for better initial load
const Benefits = lazy(() => import("@/components/Benefits"));
const HowItWorks = lazy(() => import("@/components/HowItWorks"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Footer = lazy(() => import("@/components/Footer"));

// Skeleton placeholders with accurate heights to prevent CLS
const BenefitsSkeleton = () => (
  <div className="py-16 bg-muted/30" style={{ minHeight: '400px' }} />
);
const HowItWorksSkeleton = () => (
  <div className="py-16 bg-background" style={{ minHeight: '500px' }} />
);
const TestimonialsSkeleton = () => (
  <div className="py-16 bg-muted/30" style={{ minHeight: '400px' }} />
);
const FooterSkeleton = () => (
  <div className="bg-foreground" style={{ minHeight: '300px' }} />
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Suspense fallback={<BenefitsSkeleton />}>
        <Benefits />
      </Suspense>
      <Suspense fallback={<HowItWorksSkeleton />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<TestimonialsSkeleton />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
