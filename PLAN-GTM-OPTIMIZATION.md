# GTM Performance Optimization Plan

## Problem Summary

PageSpeed Insights identifies GTM as a major contributor to "Reduce unused JavaScript" with **~235 KiB** of unused JS, specifically:

| Script | Transfer Size | Unused |
|--------|---------------|--------|
| `/gtm.js?id=GTM-MGDBJPQQ` | 120.3 KiB | 51.9 KiB |
| `/gtag/js?id=AW-176...` | 110.2 KiB | 46.7 KiB |
| `/gtag/js?id=AW-101...` | 110.2 KiB | 46.1 KiB |

**Root Cause**: Two separate Google Ads accounts are loading redundant gtag.js scripts through GTM.

## Current Implementation

- GTM loads via `setTimeout` with 3-second delay
- Preconnect hints are in place
- Conversion tracking uses `dataLayer.push()` and `gtag()` calls

## Optimization Strategy

### Phase 1: Interaction-Based Loading (High Impact, Low Risk)

**Goal**: Delay GTM until first user interaction, not a fixed timer.

**Changes**:
1. Replace `setTimeout(3000)` with interaction-based trigger
2. Queue all dataLayer events before GTM loads
3. Use `requestIdleCallback` as fallback for non-interactive sessions

**Implementation** (`index.html`):

```javascript
// Initialize dataLayer queue immediately
window.dataLayer = window.dataLayer || [];

// GTM loader function
function loadGTM() {
  if (window.__gtmLoaded) return;
  window.__gtmLoaded = true;

  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-MGDBJPQQ');
}

// Interaction triggers
var interactions = ['scroll', 'click', 'touchstart', 'keydown'];
interactions.forEach(function(event) {
  document.addEventListener(event, loadGTM, { once: true, passive: true });
});

// Fallback: load after 5 seconds if no interaction (for bounce rate tracking)
setTimeout(loadGTM, 5000);
```

**Why This Works**:
- Most users scroll or click within 1-2 seconds
- GTM loads when user is already engaged
- dataLayer events are queued and processed once GTM loads
- 5-second fallback ensures bounce tracking still works

**Conversion Tracking Impact**: NONE
- `dataLayer.push()` events queue before GTM loads
- When GTM loads, it processes the queue
- All conversions are captured

---

### Phase 2: Optimize GTM Container (High Impact, Requires GTM Access)

**Issue**: Two Google Ads accounts loading separate gtag.js scripts:
- `AW-176...`
- `AW-101...`

**Recommendation**:
1. **Audit GTM container** at https://tagmanager.google.com
2. **Consolidate Google Ads tags** - Use a single Google Ads Conversion Linker tag
3. **Remove duplicate gtag.js loads** - Configure both conversion IDs in one tag
4. **Use GTM's built-in Google Ads tag** instead of raw gtag.js

**Expected Savings**: ~100 KiB (one less gtag.js load)

---

### Phase 3: Server-Side GTM (Future Enhancement)

**Benefits**:
- Reduces client-side JavaScript to near zero
- Moves conversion tracking to server
- First-party cookies for better tracking accuracy

**Requirements**:
- Google Cloud or custom server infrastructure
- GTM Server Container setup
- Approximately $40-100/month for Cloud Run

**Recommendation**: Defer to Phase 3 unless client-side optimizations are insufficient.

---

## Implementation Checklist

### Phase 1: Interaction-Based Loading
- [ ] Update `index.html` with interaction-based GTM loader
- [ ] Ensure `dataLayer` is initialized before any tracking code
- [ ] Test form submission tracking works correctly
- [ ] Test phone click tracking works correctly
- [ ] Test thank you page conversion tracking
- [ ] Verify PSI score improvement

### Phase 2: GTM Container Audit (Requires Account Access)
- [ ] Login to GTM console
- [ ] Identify duplicate Google Ads tags
- [ ] Consolidate to single Conversion Linker
- [ ] Configure both AW- IDs in one tag
- [ ] Test conversions fire correctly
- [ ] Publish optimized container

---

## Risk Assessment

| Change | Risk | Mitigation |
|--------|------|------------|
| Interaction-based loading | Low | 5-second fallback ensures all sessions tracked |
| dataLayer queueing | None | Native GTM behavior |
| GTM container consolidation | Medium | Test thoroughly in GTM preview mode |

---

## Expected Results

| Metric | Before | After (Phase 1) | After (Phase 2) |
|--------|--------|-----------------|-----------------|
| GTM unused JS | 145 KiB | 145 KiB* | ~50 KiB |
| Time to GTM load | 3s fixed | ~1-2s (interaction) | ~1-2s |
| LCP impact | Moderate | Minimal | Minimal |

*Phase 1 doesn't reduce JS size but delays impact on metrics

---

## Files to Modify

1. **`index.html`** - Update GTM loading script (Phase 1)
2. **GTM Container** - Consolidate Google Ads tags (Phase 2, external)
