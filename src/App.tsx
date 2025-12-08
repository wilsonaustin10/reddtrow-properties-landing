import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import About from "./pages/About";
import ThankYou from "./pages/ThankYou";
import Testimonials from "./pages/Testimonials";
import GhlDiagnostic from "./pages/GhlDiagnostic";

// Landing Pages - Tier 1 (Highest Intent, Lowest CPC)
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
