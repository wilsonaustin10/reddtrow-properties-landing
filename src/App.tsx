import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Eager load: Main landing page and ad landing pages (direct entry points)
import Index from "./pages/Index";
import {
  ForeclosurePage,
  DivorcePage,
  RelocationPage,
  NeedToSellPage,
  UglyHousesPage,
  SellAsIsPage,
  CompaniesThatBuyHousesPage,
  SellFastPage,
  WeBuyHousesPage,
  CashBuyersPage,
} from "./pages/landing";

// Lazy load: Non-critical pages (accessed via navigation, not direct entry)
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
