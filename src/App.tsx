import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Eager load: Only the home page (most common entry point)
import Index from "./pages/Index";

// Lazy load: All landing pages (each user visits only ONE per session)
// This reduces initial bundle by ~120KB as pages load on-demand
const ForeclosurePage = lazy(() => import("./pages/landing/Foreclosure"));
const DivorcePage = lazy(() => import("./pages/landing/Divorce"));
const RelocationPage = lazy(() => import("./pages/landing/Relocation"));
const NeedToSellPage = lazy(() => import("./pages/landing/NeedToSell"));
const UglyHousesPage = lazy(() => import("./pages/landing/UglyHouses"));
const SellAsIsPage = lazy(() => import("./pages/landing/SellAsIs"));
const CompaniesThatBuyHousesPage = lazy(() => import("./pages/landing/CompaniesThatBuyHouses"));
const SellFastPage = lazy(() => import("./pages/landing/SellFast"));
const WeBuyHousesPage = lazy(() => import("./pages/landing/WeBuyHouses"));
const CashBuyersPage = lazy(() => import("./pages/landing/CashBuyers"));

// Lazy load: Non-critical pages (accessed via navigation)
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const About = lazy(() => import("./pages/About"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const GhlDiagnostic = lazy(() => import("./pages/GhlDiagnostic"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/ghl-diagnostic" element={<GhlDiagnostic />} />

            {/* Landing Pages - Tier 1: Highest Intent, Lowest CPC (60% budget) */}
            <Route path="/foreclosure" element={<ForeclosurePage />} />
            <Route path="/divorce" element={<DivorcePage />} />
            <Route path="/relocation" element={<RelocationPage />} />
            <Route path="/need-to-sell" element={<NeedToSellPage />} />
            <Route path="/ugly-houses" element={<UglyHousesPage />} />
            <Route path="/sell-as-is" element={<SellAsIsPage />} />
            <Route path="/companies-that-buy-houses" element={<CompaniesThatBuyHousesPage />} />

            {/* Landing Pages - Tier 2: Core Volume (25% budget) */}
            <Route path="/sell-fast" element={<SellFastPage />} />

            {/* Landing Pages - Tier 3: Brand & Volume (15% budget) */}
            <Route path="/we-buy-houses" element={<WeBuyHousesPage />} />
            <Route path="/cash-buyers" element={<CashBuyersPage />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
