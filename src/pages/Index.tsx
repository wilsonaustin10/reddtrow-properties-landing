import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

// Lazy load below-the-fold components for better initial load
const Benefits = lazy(() => import("@/components/Benefits"));
const HowItWorks = lazy(() => import("@/components/HowItWorks"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Suspense fallback={<div className="h-20" />}>
        <Benefits />
      </Suspense>
      <Suspense fallback={<div className="h-20" />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<div className="h-20" />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<div className="h-20" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
