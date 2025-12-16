# Performance Optimization Plan
## Reddtrow Properties Landing Page

**Analysis Date:** December 16, 2025 (Updated from Dec 15 PSI Report)
**Target:** https://www.reddtrowhomebuyers.com
**Current Score:** 66 (Mobile) | **Target:** 85+
**Goal:** Fix CLS, optimize LCP, and improve overall PageSpeed scores

---

## PSI Report Summary (Dec 15, 2025)

| Metric | Value | Status |
|--------|-------|--------|
| **Performance** | 66 | 🟠 Needs Improvement |
| **CLS** | 0.608 | 🔴 Critical (target: <0.1) |
| **LCP** | 2.3s | 🟠 Needs Improvement |
| **TBT** | 240ms | 🟠 Needs Improvement |
| **FCP** | 2.1s | 🟠 Needs Improvement |
| **Speed Index** | 5.0s | 🔴 Poor |

---

## Executive Summary

The PSI report reveals **three critical issues** beyond image optimization:

1. **CLS of 0.608** - Layout shift from `<div class="min-h-screen bg-background">`
2. **Non-composited `pulse-glow` animation** - Using `box-shadow` (not GPU-accelerated)
3. **LCP render delay of 2,310ms** - JavaScript blocking the hero text render

**Estimated Impact:** Fixing these issues should improve score from 66 to 85+.

---

## PRIORITY 1: Fix CLS (0.608 → <0.1)

### Root Cause
The CLS culprit identified by Lighthouse is:
```
Element: <div class="min-h-screen bg-background">
Layout shift score: 0.608
```

This is the root container in `LandingLayout.tsx`. Layout shifts occur because:
1. **Font loading** causes text reflow
2. **React hydration** changes element dimensions
3. **No explicit dimensions** on critical layout containers

### Solution 1.1: Add Explicit Hero Dimensions

**File:** `src/components/landing/LandingHero.tsx` (Line 14)

```diff
- <section className="hero-section relative min-h-[50vh] flex items-center py-8 md:py-12 text-white">
+ <section className="hero-section relative min-h-[500px] md:min-h-[550px] lg:min-h-[600px] flex items-center py-8 md:py-12 text-white">
```

Rationale: Using fixed `min-h-[500px]` instead of viewport-relative `min-h-[50vh]` prevents layout shifts when viewport changes during load.

### Solution 1.2: Add Layout Containment to Root

**File:** `src/components/landing/LandingLayout.tsx` (Line 46)

```diff
- <div className="min-h-screen bg-background flex flex-col">
+ <div className="min-h-screen bg-background flex flex-col" style={{ contain: 'layout' }}>
```

### Solution 1.3: Add Font Display Swap

Already present in `index.html` critical CSS. Verify Google Fonts also use `font-display: swap`.

---

## PRIORITY 2: Fix Non-Composited Animations

### Root Cause
PSI flagged 3 elements with non-composited animations:
- "Get Cash Offer" button - `pulse-glow` animation using `box-shadow`
- "Get My Cash Offer" button - `pulse-glow` animation using `box-shadow`

`box-shadow` animations cannot be GPU-accelerated and cause:
- Janky animations (60fps → ~30fps)
- Additional layout shifts
- Main thread blocking

### Solution 2.1: Convert to Composited Animation

**File:** `src/index.css` (Lines 151-168)

**BEFORE:**
```css
.urgency-button {
  background: linear-gradient(135deg, hsl(var(--urgency)), hsl(var(--urgency-hover)));
  box-shadow: var(--urgency-glow);
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: var(--urgency-glow); }
  50% { box-shadow: 0 0 30px hsl(var(--urgency) / 0.6); }
}
```

**AFTER (Option A - Scale animation, GPU-accelerated):**
```css
.urgency-button {
  background: linear-gradient(135deg, hsl(var(--urgency)), hsl(var(--urgency-hover)));
  box-shadow: var(--urgency-glow);
  animation: pulse-scale 2s ease-in-out infinite;
  will-change: transform;
}

@keyframes pulse-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
```

**AFTER (Option B - Opacity pseudo-element, GPU-accelerated):**
```css
.urgency-button {
  background: linear-gradient(135deg, hsl(var(--urgency)), hsl(var(--urgency-hover)));
  box-shadow: var(--urgency-glow);
  position: relative;
  overflow: hidden;
}

.urgency-button::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 0 30px hsl(var(--urgency) / 0.6);
  opacity: 0;
  animation: pulse-opacity 2s ease-in-out infinite;
  pointer-events: none;
  will-change: opacity;
}

@keyframes pulse-opacity {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
```

**Recommendation:** Use Option A (scale) for simplicity and maximum compatibility.

---

## PRIORITY 3: Reduce LCP Render Delay (2,310ms)

### Root Cause
The LCP element is text in the hero:
```html
<p class="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed">
  Get a fair cash offer in 7 minutes or less...
</p>
```

**LCP Breakdown:**
- Time to First Byte: 0ms ✅
- Element render delay: **2,310ms** 🔴

This means JavaScript is blocking the render for 2.3 seconds.

### Solution 3.1: Add Hero Skeleton in HTML

**File:** `index.html` (Replace line 215)

```html
<div id="root">
  <!-- Hero skeleton - prevents blank screen during JS load -->
  <div class="hero-skeleton" style="
    min-height: 600px;
    background: linear-gradient(135deg, hsl(1 64% 28%), hsl(1 64% 38%));
    display: flex;
    align-items: center;
    padding: 2rem;
  ">
    <div style="
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
    ">
      <div style="color: white; opacity: 0.3;">
        <div style="height: 3rem; background: currentColor; border-radius: 0.5rem; margin-bottom: 1rem; width: 80%;"></div>
        <div style="height: 1.5rem; background: currentColor; border-radius: 0.25rem; margin-bottom: 0.5rem; width: 60%;"></div>
        <div style="height: 1.5rem; background: currentColor; border-radius: 0.25rem; width: 70%;"></div>
      </div>
      <div style="
        background: white;
        border-radius: 0.75rem;
        padding: 2rem;
        min-height: 400px;
        opacity: 0.9;
      "></div>
    </div>
  </div>
</div>
```

### Solution 3.2: Lazy Load Non-Critical Routes

**File:** `src/App.tsx`

```tsx
import { lazy, Suspense } from 'react';

// Eager load: Home page
import Index from "./pages/Index";

// Lazy load: All other pages
const NotFound = lazy(() => import('./pages/NotFound'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const About = lazy(() => import('./pages/About'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
// ... etc
```

### Solution 3.3: Consider SSG/Prerendering

For maximum LCP improvement, consider:
- Vite plugin: `vite-plugin-ssr` or `vite-plugin-prerender`
- Prerender the home page to static HTML

---

## PRIORITY 4: Third-Party Script Impact

### Current Impact
| Script | Size | Main Thread |
|--------|------|-------------|
| Google Tag Manager | 365 KiB | 300ms |
| Clixtell track.js | 33 KiB | 242ms |
| Google CDN | 24 KiB | 22ms |

**Total: 422 KiB, 564ms main thread time**

### Current Mitigation (Already Implemented)
GTM is deferred by 3 seconds - good!

### Additional Optimization: Defer Clixtell Further

If Clixtell loads via GTM, configure trigger to "First User Interaction" instead of page load.

### Future Consideration: Partytown

Move third-party scripts to web worker:
```bash
npm install @builder.io/partytown
```

---

## PRIORITY 5: Image Optimization (Previous Analysis)

## Root Cause Analysis

### 1. Image Size vs Display Size Mismatch (CRITICAL)

| Image | File Size | Actual Dimensions | Display Size | Waste |
|-------|-----------|-------------------|--------------|-------|
| `bbb-logo.jpg` | 140KB | 770×1247 @300DPI | h-10 to h-20 (40-80px) | **~95%** |
| `reddtrow-emblem.png` | 53KB | 400×500 | h-24 (96px) | **~80%** |
| `favicon.png` | 104KB | Unknown | 16-32px | **~99%** |
| `reddtrow-logo.png` | 17KB | 200×88 | h-10 (40px) | ~50% |
| `sandra-nesbitt.jpg` | 21KB | 300×300 | ~200px max | Acceptable |

### 2. Unused Assets (Dead Code)

These files exist in `src/assets/` but are **never imported**:
- `hero-house.jpg` (276KB) - Not used anywhere
- `team-photo.jpg` (503KB) - Not used anywhere
- `logo.png` (168KB) - Not used anywhere

**Total waste: 947KB of unused assets**

### 3. Missing Image Optimizations

| Optimization | Status | Impact |
|--------------|--------|--------|
| `loading="lazy"` | ❌ Missing | Delays off-screen image loading |
| WebP format | ❌ Missing | 30-50% smaller file sizes |
| `width` & `height` attributes | ❌ Missing | Causes CLS (layout shift) |
| `srcset` responsive images | ❌ Missing | Serves appropriate size per device |
| `fetchpriority="high"` on hero | ❌ Missing | Prioritizes critical images |
| `decoding="async"` | ❌ Missing | Non-blocking image decode |

### 4. Favicon Bloat

- `favicon.png`: **104KB** - Extremely oversized
- `favicon.ico`: 7.5KB - Reasonable but redundant
- Current HTML references the 104KB PNG

---

## Optimization Plan

### Phase 1: Manual Image Optimization (YOU MUST DO THIS)

These require manual action as they involve creating new optimized image files:

#### 1.1 BBB Logo (HIGHEST PRIORITY)
**Current:** 140KB, 770×1247px @300DPI
**Problem:** Displayed at max 80px height, file is massively oversized

**Manual Steps:**
1. Open `src/assets/bbb-logo.jpg` in an image editor (Photoshop, GIMP, Squoosh.app)
2. Resize to **160×260px** (2x for retina, displayed at 80px max)
3. Set resolution to 72 DPI (web standard)
4. Export as WebP with 80% quality → Target: **~5-10KB**
5. Also export as optimized JPG fallback → Target: **~15KB**
6. Save as `bbb-logo.webp` and `bbb-logo-optimized.jpg`

**Expected savings: ~130KB (93% reduction)**

#### 1.2 Reddtrow Emblem
**Current:** 53KB, 400×500px
**Problem:** Displayed at 96px height (h-24)

**Manual Steps:**
1. Resize to **192×240px** (2x for retina)
2. Export as WebP with 85% quality → Target: **~8-12KB**
3. Export as optimized PNG fallback → Target: **~15-20KB**
4. Save as `reddtrow-emblem.webp` and `reddtrow-emblem-optimized.png`

**Expected savings: ~35-40KB (70% reduction)**

#### 1.3 Reddtrow Logo
**Current:** 17KB, 200×88px
**Problem:** Displayed at ~40px height, slight oversizing

**Manual Steps:**
1. Resize to **100×44px** (2x for retina at 50px display)
2. Export as WebP with 90% quality → Target: **~3-5KB**
3. Keep PNG fallback at optimized size → Target: **~8KB**
4. Save as `reddtrow-logo.webp` and `reddtrow-logo-optimized.png`

**Expected savings: ~10KB (60% reduction)**

#### 1.4 Favicon (IMPORTANT)
**Current:** 104KB PNG
**Problem:** Favicons should be <10KB total

**Manual Steps:**
1. Create optimized favicon set:
   - `favicon.ico` (16×16, 32×32 multi-res): ~5KB max
   - `apple-touch-icon.png` (180×180): ~10KB max
   - `favicon-32x32.png`: ~2KB
   - `favicon-16x16.png`: ~1KB
2. Use a tool like [RealFaviconGenerator](https://realfavicongenerator.net/) or [Favicon.io](https://favicon.io/)
3. Replace `public/favicon.png` with the optimized set

**Expected savings: ~95KB (90%+ reduction)**

#### 1.5 Sandra Nesbitt Headshot
**Current:** 21KB, 300×300px - Already reasonable
**Optional:** Convert to WebP for additional ~30% savings (~7KB savings)

---

### Phase 2: Code Changes (CAN BE AUTOMATED)

These changes can be implemented in the codebase:

#### 2.1 Add Image Loading Attributes

**File: `src/components/Footer.tsx`**
```tsx
// Line 11 - Emblem logo (below fold, lazy load)
<img
  src={emblemLogo}
  alt="Reddtrow Properties"
  className="h-24 w-auto"
  loading="lazy"
  decoding="async"
  width="77"
  height="96"
/>

// Line 116 - BBB logo (below fold, lazy load)
<img
  src={bbbLogo}
  alt="BBB Accredited Business"
  className="h-20 w-auto mx-auto hover:opacity-80 transition-opacity"
  loading="lazy"
  decoding="async"
  width="49"
  height="80"
/>
```

**File: `src/components/landing/TrustBar.tsx`**
```tsx
// Line 43 - BBB logo (potentially above fold on mobile)
<img
  src={bbbLogo}
  alt="BBB Accredited Business"
  className="h-10 w-auto"
  loading="eager"
  decoding="async"
  width="25"
  height="40"
/>
```

**File: `src/components/Header.tsx` and `src/components/landing/LandingHeader.tsx`**
```tsx
// Logo in header (critical, above fold)
<img
  src={logo}
  alt="Reddtrow Properties Logo"
  className="h-10 w-auto"
  fetchpriority="high"
  decoding="async"
  width="91"
  height="40"
/>
```

**File: `src/pages/About.tsx`**
```tsx
// Line 22-26 - Sandra headshot (below fold on most screens)
<img
  src={sandraHeadshot}
  alt="Sandra Nesbitt - Founder of Reddtrow Properties"
  className="w-full rounded-lg mb-4"
  loading="lazy"
  decoding="async"
  width="300"
  height="300"
/>
```

#### 2.2 Update Favicon Reference

**File: `index.html`**
```html
<!-- Replace line 5 -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

#### 2.3 Remove Unused Assets

Delete these files from `src/assets/`:
- `hero-house.jpg` (276KB)
- `team-photo.jpg` (503KB)
- `logo.png` (168KB)

**Total cleanup: 947KB removed from repository**

---

### Phase 3: Advanced Optimizations (OPTIONAL)

#### 3.1 Add Vite Image Optimization Plugin

**Install:**
```bash
npm install vite-plugin-image-optimizer --save-dev
```

**Update `vite.config.ts`:**
```typescript
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { lossless: false, quality: 80 },
    }),
    // ... rest of plugins
  ],
  // ... rest of config
}));
```

#### 3.2 Implement WebP with Fallback

Create a reusable `OptimizedImage` component:

```tsx
// src/components/ui/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  webpSrc?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

const OptimizedImage = ({
  src,
  webpSrc,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  priority = false,
}: OptimizedImageProps) => {
  return (
    <picture>
      {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        {...(priority && { fetchpriority: 'high' })}
      />
    </picture>
  );
};

export default OptimizedImage;
```

#### 3.3 Preload Critical Images

Add to `index.html` `<head>`:
```html
<link rel="preload" as="image" href="/src/assets/reddtrow-logo.webp" type="image/webp" />
```

---

## Implementation Checklist

### Sprint 1: Critical CLS + Animation Fixes (Impact: +15-20 points)

- [ ] **1.1** Fix hero section dimensions in `LandingHero.tsx` (min-h-[500px])
- [ ] **1.2** Add layout containment to `LandingLayout.tsx`
- [ ] **2.1** Convert `pulse-glow` to `pulse-scale` animation in `index.css`
- [ ] **2.2** Remove `will-change: auto` from hero pseudo-element

### Sprint 2: LCP + Image Optimization (Impact: +10-15 points)

- [ ] **3.1** Add hero skeleton to `index.html` for instant paint
- [ ] **3.2** Convert `reddtrow-logo.png` to WebP (17KB → ~5KB)
- [ ] **3.3** Add lazy loading to all landing page routes in `App.tsx`
- [ ] **4.1** Verify all images have explicit `width` and `height` attributes

### Sprint 3: Third-Party + Advanced (Impact: +3-5 points)

- [ ] **5.1** Configure Clixtell to load on user interaction (via GTM)
- [ ] **5.2** Add preconnect hints for third-party domains
- [ ] **5.3** Consider Partytown for analytics scripts

### Previous Image Optimization Tasks

- [ ] Optimize BBB logo (140KB → ~10KB)
- [ ] Optimize Reddtrow emblem (53KB → ~12KB)
- [ ] Create optimized favicon set (104KB → ~5KB)
- [ ] Delete unused assets (hero-house.jpg, team-photo.jpg, logo.png)

---

## Expected Results

### Performance Score Projection

| Sprint | Changes | Est. Score | Delta |
|--------|---------|------------|-------|
| Current | - | 66 | - |
| Sprint 1 | CLS + Animation fixes | 80-82 | +14-16 |
| Sprint 2 | LCP + Images | 85-88 | +5-6 |
| Sprint 3 | Third-party optimizations | 88-92 | +3-4 |

### Core Web Vitals Targets

| Metric | Current | Target | Change |
|--------|---------|--------|--------|
| **CLS** | 0.608 | <0.1 | -0.5+ |
| **LCP** | 2.3s | <2.0s | -0.3s |
| **TBT** | 240ms | <150ms | -90ms |
| **FCP** | 2.1s | <1.8s | -0.3s |
| **Speed Index** | 5.0s | <3.5s | -1.5s |

### File Size Reductions

| Asset | Before | After | Savings |
|-------|--------|-------|---------|
| bbb-logo | 140KB | ~10KB | **130KB** |
| favicon.png | 104KB | ~5KB | **99KB** |
| reddtrow-emblem | 53KB | ~12KB | **41KB** |
| reddtrow-logo | 17KB | ~5KB | **12KB** |
| Unused assets removed | 947KB | 0KB | **947KB** |
| **Total** | **1.26MB** | **~32KB** | **~1.23MB** |

---

## Tools for Manual Optimization

### Online Tools (Free)
- **[Squoosh.app](https://squoosh.app/)** - Best for WebP conversion with quality preview
- **[TinyPNG](https://tinypng.com/)** - Quick PNG/JPEG compression
- **[RealFaviconGenerator](https://realfavicongenerator.net/)** - Complete favicon set generation

### Desktop Tools
- **ImageOptim** (Mac) - Batch optimization
- **GIMP** - Free, full-featured editor
- **Photoshop** - "Export for Web" feature

### CLI Tools
```bash
# Install sharp-cli for batch conversion
npm install -g sharp-cli

# Convert to WebP
sharp -i bbb-logo.jpg -o bbb-logo.webp --format webp --quality 80

# Resize and convert
sharp -i bbb-logo.jpg -o bbb-logo.webp --resize 160 --format webp --quality 80
```

---

## Summary

The site has solid foundational performance practices but is severely impacted by oversized images. **The BBB logo alone (140KB displayed at 40-80px) likely accounts for a significant portion of the LCP delay.**

**Priority actions:**
1. Optimize BBB logo (biggest single improvement)
2. Fix favicon (second biggest)
3. Add loading/dimension attributes (prevents CLS)
4. Remove unused assets (cleanup)

These changes will significantly improve both mobile and desktop PageSpeed scores while maintaining the exact same visual appearance to users.
