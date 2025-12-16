# Landing Page Performance Optimization Plan: Target 95+ PSI

**Date:** December 16, 2025
**Current Score:** 66 (Mobile)
**Target Score:** 95+
**Auditor:** Performance Architecture Review

---

## Executive Summary

After a comprehensive codebase analysis, I've identified **12 critical bottlenecks** preventing a 95+ PageSpeed score. The primary issues are:

1. **Bundle Size:** 310 KB main JS + 278 KB React vendor = 588 KB total JS (173 KB gzipped)
2. **Eager Loading:** All 10 landing pages loaded upfront instead of lazy-loaded
3. **CLS Issues:** Layout containment added but missing explicit dimensions
4. **Third-Party Scripts:** GTM + Google Ads tracking adding 235+ KB unused JS
5. **Font Loading:** No font-display optimization for Google Fonts
6. **Missing Preloading:** Critical resources not preloaded

### Why the Page Cannot Currently Score 95+

| Bottleneck | Current Impact | Score Penalty |
|------------|----------------|---------------|
| Large JS bundle (588 KB) | TBT +300ms | -15 points |
| 10 eager-loaded landing pages | Initial load +150 KB | -8 points |
| GTM/Analytics unused code | 235 KB unused | -6 points |
| No font preloading | LCP +200ms | -3 points |
| CLS from hydration | CLS 0.608 | -8 points |

**Total Estimated Penalty: ~40 points (100 - 40 = 60 baseline)**

---

## Section 1: Complete Diagnostic Analysis

### 1.1 Bundle Size Breakdown

**Current Build Output:**
```
dist/assets/vendor-react-*.js       277.84 KB │ gzip: 91.14 KB
dist/assets/index-*.js              310.01 KB │ gzip: 81.93 KB
dist/assets/index-*.css              71.51 KB │ gzip: 12.84 KB
```

**Total Initial JS:** 587.85 KB (173.07 KB gzipped)

**Root Cause Analysis:**

| Module | Estimated Size | Reason |
|--------|----------------|--------|
| React + ReactDOM + Router | ~278 KB | Vendor chunk (acceptable) |
| 10 Landing Pages (eager) | ~120 KB | All imported in App.tsx |
| Radix UI Components | ~80 KB | 25 Radix packages in package.json |
| Lucide Icons | ~30 KB | Icon imports (not fully tree-shaken) |
| TanStack Query | ~25 KB | State management |
| Supabase Client | ~20 KB | Database client |
| Other (forms, validation) | ~35 KB | React Hook Form, Zod, etc. |

### 1.2 Landing Page Loading Issue

**File:** `src/App.tsx` (Lines 9-21)

```tsx
// PROBLEM: All 10 landing pages eagerly imported
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
```

This barrel export causes Vite to bundle ALL landing pages into the main chunk, even though a user only visits ONE landing page per session.

**Impact:** ~120 KB of unused code on every page load

### 1.3 Third-Party Script Analysis

**Google Tag Manager (GTM-MGDBJPQQ):**
- Total Size: ~365 KB
- Unused JS (per PSI): 51.9 KB in gtm.js
- Currently deferred via interaction trigger (good)
- Additional scripts loaded by GTM:
  - Google Ads conversion (2 accounts): ~93 KB
  - Clixtell tracking: ~33 KB

**Current Mitigation (index.html:276-302):**
```javascript
// GTM loads on first user interaction OR requestIdleCallback
['scroll', 'click', 'touchstart', 'keydown'].forEach(function(event) {
  document.addEventListener(event, loadGTM, { once: true, passive: true });
});
requestIdleCallback(loadGTM, { timeout: 4000 });
```

**Issue:** Still loads ~400 KB of analytics JS after first interaction, blocking main thread for 300-500ms.

### 1.4 CSS Analysis

**Current CSS Build:**
```
dist/assets/index-*.css    71.51 KB │ gzip: 12.84 KB
```

**Breakdown:**
- Tailwind base + utilities: ~50 KB
- Custom component styles: ~10 KB
- Radix UI component styles: ~8 KB
- Dark mode variables: ~3 KB (unused on landing pages)

**Issues:**
1. Dark mode CSS included but not used on landing pages
2. Tailwind utilities not purged optimally
3. CSS not split per route

### 1.5 Image Status (Previously Optimized)

✅ Images have been optimized in previous sprints:
- `Reddtrow Logo.webp`: 4.65 KB
- `bbb-logo.webp`: 8.47 KB
- `reddtrow-emblem.webp`: 6.78 KB
- `favicon-96x96.png`: 5.36 KB
- `sandra-nesbitt.jpg`: 21.29 KB

**Total image assets:** ~46.5 KB (acceptable)

### 1.6 Font Loading Analysis

**index.html** does not explicitly load Google Fonts, relying on system fonts:
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

**Issue:** If Inter is loaded via CSS (not visible in current code), it needs:
- `font-display: swap` in @font-face
- Preload hint for critical font weights

### 1.7 CLS Analysis

**Current CLS:** 0.608 (Target: <0.1)

**Root Causes:**

1. **LandingLayout.tsx:46** - Has `contain: 'layout'` but children don't have explicit dimensions
2. **LandingHero.tsx:14** - Uses `min-h-[500px]` but CSS grid can still shift
3. **React Hydration** - Virtual DOM replacement causes brief layout recalculation
4. **Mobile Phone Bar** - Fixed positioning at bottom may cause layout shift

**HTML Skeleton (index.html:224-270):**
The skeleton is well-implemented but has two issues:
1. Grid is single-column (`grid-template-columns: 1fr`) but actual hero is 2-column on desktop
2. Skeleton dimensions don't exactly match React component dimensions

---

## Section 2: Optimization Strategy

### Phase 1: Critical Path Optimizations (Expected +20 points)

#### 1.1 Lazy Load All Landing Pages

**File:** `src/App.tsx`

**Current (Problem):**
```tsx
import {
  ForeclosurePage, DivorcePage, /* ... 8 more */
} from "./pages/landing";
```

**Solution:**
```tsx
import { lazy, Suspense } from "react";

// Eager load: Only the Index page (home)
import Index from "./pages/Index";

// Lazy load: ALL landing pages (loaded on-demand per route)
const ForeclosurePage = lazy(() => import('./pages/landing/Foreclosure'));
const DivorcePage = lazy(() => import('./pages/landing/Divorce'));
const RelocationPage = lazy(() => import('./pages/landing/Relocation'));
const NeedToSellPage = lazy(() => import('./pages/landing/NeedToSell'));
const UglyHousesPage = lazy(() => import('./pages/landing/UglyHouses'));
const SellAsIsPage = lazy(() => import('./pages/landing/SellAsIs'));
const CompaniesThatBuyHousesPage = lazy(() => import('./pages/landing/CompaniesThatBuyHouses'));
const SellFastPage = lazy(() => import('./pages/landing/SellFast'));
const WeBuyHousesPage = lazy(() => import('./pages/landing/WeBuyHouses'));
const CashBuyersPage = lazy(() => import('./pages/landing/CashBuyers'));
```

**Expected Impact:**
- Initial bundle: -120 KB
- Each landing page: ~12 KB loaded on-demand
- TBT improvement: -100ms

#### 1.2 Fix CLS with Explicit Dimensions

**File:** `src/components/landing/LandingHero.tsx`

**Add fixed aspect ratio container:**
```tsx
<section
  className="hero-section relative flex items-center py-8 md:py-12 text-white"
  style={{
    minHeight: '550px',
    contain: 'layout style paint',
  }}
>
```

**File:** `src/components/landing/LandingLayout.tsx`

**Add isolation context:**
```tsx
<div
  className="min-h-screen bg-background flex flex-col"
  style={{
    contain: 'layout',
    isolation: 'isolate'
  }}
>
```

#### 1.3 Update HTML Skeleton for CLS Prevention

**File:** `index.html`

Match skeleton to actual component structure:
```html
<div id="root">
  <!-- Skeleton matches React component structure exactly -->
  <div style="min-height: 100vh; background: hsl(0 0% 100%);">
    <!-- Header skeleton with exact dimensions -->
    <div style="
      height: 72px; /* Matches LandingHeader */
      background: rgba(255,255,255,0.95);
      border-bottom: 1px solid hsl(210 20% 90%);
    "></div>
    <!-- Hero skeleton -->
    <div style="
      min-height: 550px;
      background: linear-gradient(135deg, hsl(1 64% 28%), hsl(1 64% 38%));
      display: flex;
      align-items: center;
      contain: layout style paint;
    ">
      <!-- Content matched to actual grid -->
    </div>
  </div>
</div>
```

### Phase 2: Bundle Optimization (Expected +10 points)

#### 2.1 Optimize Vite Chunking Strategy

**File:** `vite.config.ts`

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        if (id.includes('node_modules')) {
          // Core React chunk
          if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
            return 'vendor-react';
          }
          // React Router (can be lazy loaded for landing pages)
          if (id.includes('react-router')) {
            return 'vendor-router';
          }
          // Form handling (only needed after interaction)
          if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
            return 'vendor-forms';
          }
          // Radix UI (split by category)
          if (id.includes('@radix-ui')) {
            if (id.includes('accordion') || id.includes('collapsible')) {
              return 'vendor-radix-interactive';
            }
            return 'vendor-radix-core';
          }
          // Icons (lazy load)
          if (id.includes('lucide-react')) {
            return 'vendor-icons';
          }
          // Query client
          if (id.includes('@tanstack')) {
            return 'vendor-query';
          }
          // Supabase (only needed for form submission)
          if (id.includes('@supabase')) {
            return 'vendor-supabase';
          }
        }
      }
    }
  },
  // Reduce chunk size warning threshold
  chunkSizeWarningLimit: 500,
}
```

#### 2.2 Tree-Shake Unused Radix Components

Many Radix UI packages are installed but likely unused. Review and remove:

**package.json - Candidates for removal:**
```json
// Remove if unused:
"@radix-ui/react-aspect-ratio"      // Check usage
"@radix-ui/react-context-menu"      // Check usage
"@radix-ui/react-hover-card"        // Check usage
"@radix-ui/react-menubar"           // Check usage
"@radix-ui/react-navigation-menu"   // Check usage
"@radix-ui/react-progress"          // Check usage
"@radix-ui/react-radio-group"       // Check usage
"@radix-ui/react-slider"            // Check usage
"@radix-ui/react-switch"            // Check usage
"@radix-ui/react-tabs"              // Check usage
"@radix-ui/react-toggle"            // Check usage
"@radix-ui/react-toggle-group"      // Check usage
```

#### 2.3 Dynamic Import for Heavy Components

**AddressAutocomplete** already uses dynamic import for Google Places (good).

Apply same pattern to other heavy components:

```tsx
// LeadForm.tsx - Lazy load Supabase client
const submitLead = async (data) => {
  const { supabase } = await import('@/integrations/supabase/client');
  return supabase.functions.invoke('submit-lead', { body: data });
};
```

### Phase 3: Advanced Optimizations (Expected +5 points)

#### 3.1 Preload Critical Resources

**File:** `index.html`

```html
<head>
  <!-- Preload critical JS chunks -->
  <link rel="modulepreload" href="/src/main.tsx" />

  <!-- Preload critical images -->
  <link rel="preload" as="image" type="image/webp" href="/src/assets/Reddtrow Logo.webp" />

  <!-- DNS prefetch (already present, verify) -->
  <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
</head>
```

#### 3.2 Inline Critical CSS for Hero

Extract and inline only hero-critical CSS (~2 KB) in HTML head to enable instant first paint.

Current implementation has partial critical CSS. Expand to include:
- Hero gradient background
- Form card styling
- Button primary styles
- Typography for h1, p

#### 3.3 Optimize Animation Performance

**Current (Good):**
```css
.urgency-button {
  animation: pulse-scale 2s ease-in-out infinite;
  will-change: transform;
}

@keyframes pulse-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
```

This is already GPU-accelerated. No changes needed.

#### 3.4 Service Worker for Return Visitors

Consider adding a service worker for caching static assets:
- Logo images
- CSS bundle
- Vendor chunks

**Not recommended for initial optimization** - adds complexity.

---

## Section 3: Implementation Checklist

### Sprint 1: Critical Optimizations (Day 1)

- [ ] **1.1** Lazy load all 10 landing pages in App.tsx
- [ ] **1.2** Add explicit hero section dimensions (550px min-height)
- [ ] **1.3** Update HTML skeleton to match actual dimensions
- [ ] **1.4** Add layout containment to LandingLayout
- [ ] **1.5** Verify all images have width/height attributes

### Sprint 2: Bundle Optimization (Day 2)

- [ ] **2.1** Update Vite chunking strategy
- [ ] **2.2** Audit and remove unused Radix packages
- [ ] **2.3** Dynamic import Supabase in LeadForm
- [ ] **2.4** Verify tree-shaking is working (check build output)

### Sprint 3: Final Polish (Day 3)

- [ ] **3.1** Add modulepreload for critical chunks
- [ ] **3.2** Preload hero image
- [ ] **3.3** Expand inline critical CSS
- [ ] **3.4** Test with Lighthouse CI

---

## Section 4: Expected Results

### Performance Score Projection

| Phase | Changes | Mobile Score | Delta |
|-------|---------|--------------|-------|
| Current | - | 66 | - |
| Sprint 1 | Lazy loading + CLS fixes | 82-85 | +16-19 |
| Sprint 2 | Bundle optimization | 88-92 | +6-7 |
| Sprint 3 | Advanced optimizations | 93-97 | +3-5 |

### Core Web Vitals Targets

| Metric | Current | Target | Expected After |
|--------|---------|--------|----------------|
| **LCP** | 2.3s | <2.5s | <1.8s |
| **CLS** | 0.608 | <0.1 | <0.05 |
| **TBT** | 240ms | <200ms | <150ms |
| **FCP** | 2.1s | <1.8s | <1.5s |
| **Speed Index** | 5.0s | <3.4s | <2.8s |

### Bundle Size Targets

| Chunk | Current | Target | Method |
|-------|---------|--------|--------|
| Main bundle | 310 KB | <150 KB | Lazy loading |
| React vendor | 278 KB | 278 KB | (unchanged) |
| Per landing page | 0 | ~12 KB | On-demand loading |
| Total initial | 588 KB | ~428 KB | 27% reduction |

---

## Section 5: Risks and Limitations

### Why 95+ May Not Be Achievable

1. **Third-Party Analytics (Unavoidable):**
   - GTM + Google Ads tracking adds 200+ KB after interaction
   - PSI still counts this in unused JS audit
   - Mitigation: Already deferred, consider Partytown (advanced)

2. **React Hydration Cost:**
   - React 18 concurrent rendering still has hydration overhead
   - SSR/SSG would help but requires architecture change
   - Mitigation: Skeleton UI reduces perceived delay

3. **Mobile Network Variability:**
   - PSI simulates slow 3G which heavily penalizes JS
   - Real-world 4G/5G users experience faster loads
   - Mitigation: Focus on gzipped size, not raw size

4. **Supabase Client Size:**
   - ~50 KB library required for form submission
   - Cannot be eliminated without backend changes
   - Mitigation: Dynamic import after form interaction

### Recommended Trade-offs

| If score is... | Consider... |
|----------------|-------------|
| 90-94 | Accept as excellent performance |
| 85-89 | Add SSR with Vite SSR plugin |
| <85 | Move GTM/analytics to Partytown |

---

## Section 6: Verification Protocol

### After Each Sprint

1. **Local Lighthouse Audit:**
   ```bash
   npx lighthouse https://localhost:5173 --view
   ```

2. **Production Build Check:**
   ```bash
   npm run build
   # Verify chunk sizes reduced
   ```

3. **PageSpeed Insights:**
   - Test: https://pagespeed.web.dev/
   - Compare mobile score before/after

### Rollback Plan

Each sprint's changes should be committed separately:
```bash
git commit -m "feat: lazy load landing pages for -120KB bundle"
git commit -m "fix: CLS reduction with explicit hero dimensions"
git commit -m "perf: optimize Vite chunking strategy"
```

If score regresses, revert specific commit and investigate.

---

## Section 7: Summary

### Key Actions (Priority Order)

1. ⚡ **Lazy load landing pages** - Biggest single improvement (-120 KB)
2. ⚡ **Fix CLS with dimensions** - Core Web Vital improvement
3. 📦 **Optimize bundle chunking** - Further reduce initial load
4. 🔍 **Remove unused packages** - Clean up dependencies
5. 🚀 **Add resource hints** - Improve perceived performance

### Expected Outcome

With all optimizations implemented:
- **Mobile Score:** 93-97 (vs current 66)
- **CLS:** <0.05 (vs current 0.608)
- **LCP:** <1.8s (vs current 2.3s)
- **Initial JS:** ~428 KB (vs current 588 KB)

The landing page will provide an excellent user experience while maintaining all existing functionality.
