# Performance Optimization Plan
## Reddtrow Properties Landing Page

**Analysis Date:** December 15, 2025
**Target:** https://www.reddtrowhomebuyers.com
**Goal:** Improve PageSpeed Insights scores for mobile and desktop without altering UI/UX

---

## Executive Summary

The primary performance bottleneck is **unoptimized images**. The site has good foundational optimizations (CSS containment, deferred scripts, code splitting) but images are significantly oversized for their display dimensions and lack modern optimization attributes.

**Estimated Impact:** Implementing these optimizations could improve mobile PageSpeed score by 20-40 points.

---

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

### Manual Actions Required (Priority Order)

- [ ] **1. Optimize BBB logo** (140KB → ~10KB) - HIGHEST IMPACT
- [ ] **2. Create optimized favicon set** (104KB → ~5KB)
- [ ] **3. Optimize Reddtrow emblem** (53KB → ~12KB)
- [ ] **4. Optimize Reddtrow logo** (17KB → ~5KB)
- [ ] **5. (Optional) Convert Sandra headshot to WebP**

### Code Changes (Can Be Automated)

- [ ] Add `loading`, `decoding`, `width`, `height` attributes to all images
- [ ] Update favicon references in `index.html`
- [ ] Delete unused assets (hero-house.jpg, team-photo.jpg, logo.png)
- [ ] (Optional) Install vite-plugin-image-optimizer
- [ ] (Optional) Create OptimizedImage component

---

## Expected Results

### File Size Reductions

| Asset | Before | After | Savings |
|-------|--------|-------|---------|
| bbb-logo | 140KB | ~10KB | **130KB** |
| favicon.png | 104KB | ~5KB | **99KB** |
| reddtrow-emblem | 53KB | ~12KB | **41KB** |
| reddtrow-logo | 17KB | ~5KB | **12KB** |
| Unused assets removed | 947KB | 0KB | **947KB** |
| **Total** | **1.26MB** | **~32KB** | **~1.23MB** |

### PageSpeed Impact Estimates

| Metric | Current (Est.) | After Optimization |
|--------|----------------|-------------------|
| LCP (Largest Contentful Paint) | Poor/Needs Improvement | Good |
| CLS (Cumulative Layout Shift) | May have issues | Improved (with width/height) |
| Total Blocking Time | - | No change |
| First Contentful Paint | - | Slight improvement |

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
