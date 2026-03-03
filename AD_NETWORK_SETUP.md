# Ad Network Setup Guide

## Overview

Your application now supports multiple ad networks. The configuration system in `src/data/adNetworks.ts` provides easy integration with popular ad platforms.

## Supported Ad Networks

### 1. **Google AdSense** ⭐ (Most Popular)
- **Best For:** All types of content publishers
- **CPM Range:** $5-50 per 1000 views
- **Approval Time:** 2-3 weeks
- **Minimum Requirements:** None (but quality content helps)

**Setup Steps:**
```
1. Go to https://adsense.google.com
2. Sign in with your Google account
3. Add your website: namibiaservices.com
4. Wait for approval (review your content first)
5. Once approved, get your Publisher ID
   - It looks like: pub-1234567890123456
6. Update the config:
   scriptSrc="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
```

### 2. **Propeller Ads** 🚀 (Fastest Approval)
- **Best For:** Quick monetization, all traffic types
- **CPM Range:** $1-15 per 1000 views
- **Approval Time:** Instant
- **Minimum Requirements:** None

**Setup Steps:**
```
1. Go to https://www.propellerads.com/sign-up
2. Create account with email
3. Verify email
4. Add your website: namibiaservices.com
5. Create ad placement/zone
   - Choose format: Banner, Popunder, Native
6. Copy your Zone ID (looks like: 1234567)
7. Update the config:
   scriptSrc="https://js.propellerads.com/js/pa.js?zoneid=1234567"
```

### 3. **BidVertiser** 💰
- **Best For:** New publishers, instant monetization
- **CPM Range:** $1-8 per 1000 views
- **Approval Time:** Instant
- **Minimum Requirements:** None

**Setup Steps:**
```
1. Go to https://www.bidvertiser.com
2. Sign up with email
3. Add your website
4. Create ad zone
5. Get your Zone ID
6. Update the config:
   scriptSrc="https://ajax.bidvertiser.com/bidvertiser.js?zoneid=YOUR_ZONEID"
```

### 4. **Sovrn** (Context-Aware Ads)
- **Best For:** Content monetization, relevant ads
- **CPM Range:** $3-20 per 1000 views
- **Approval Time:** 1-2 days
- **Minimum Requirements:** Valid website

**Setup Steps:**
```
1. Go to https://www.sovrn.com
2. Click "Create Publisher Account"
3. Add your website details
4. Wait for approval
5. Get your Sovrn ID
6. Update the config:
   scriptSrc="https://ap.lijit.com/www/delivery/fpi.js?r=YOUR_SOVRN_ID"
```

### 5. **Mediavine** 🏆 (Premium)
- **Best For:** Large publishers with high traffic
- **CPM Range:** $25-100+ per 1000 views
- **Approval Time:** 1-2 weeks
- **Minimum Requirements:** 25,000+ monthly sessions

**Setup Steps:**
```
1. Go to https://www.mediavine.com/apply
2. Fill out application
3. They'll review your traffic stats
4. If approved, they'll provide setup instructions
5. Contact: partners@mediavine.com
```

### 6. **Ezoic** 🤖 (AI-Powered)
- **Best For:** Publishers wanting AI-optimized earnings
- **CPM Range:** $10-50+ per 1000 views
- **Approval Time:** 1 week
- **Minimum Requirements:** 10,000+ monthly views

**Setup Steps:**
```
1. Go to https://www.ezoic.com
2. Sign up
3. Add your domain
4. Point your DNS to Ezoic nameservers
5. They handle ad injection automatically
6. Update earnings tracking in dashboard
```

## How to Configure Your Site

### Step 1: Choose Your Ad Networks

Start with these recommendations:
- **Just Starting:** Use Propeller Ads or BidVertiser (instant approval)
- **Growing Traffic:** Add Sovrn or BidVertiser
- **Established (1000s views/day):** Add Google AdSense + Mediavine
- **Optimizing:** Use Ezoic for AI-powered optimization

### Step 2: Get Your Credentials

Each ad network will provide you with:
- **Publisher ID** (Google AdSense)
- **Zone ID** (BidVertiser, Propeller Ads)
- **Sovrn ID** (Sovrn)
- **Setup Script** (Ezoic, AdThrive)

### Step 3: Update Configuration

Edit `src/data/adNetworks.ts`:

```typescript
// Replace these with your actual IDs:

export const GOOGLE_ADSENSE: AdNetworkConfig = {
  // ...
  scriptSrc: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ACTUAL_ID",
};

export const PROPELLER_ADS: AdNetworkConfig = {
  // ...
  scriptSrc: "https://js.propellerads.com/js/pa.js?zoneid=YOUR_ACTUAL_ZONEID",
};
```

### Step 4: Update Page Implementations

**For Homepage** (`src/app/page.tsx`):
```tsx
import { getAdNetworkScript } from "@/data/adNetworks";

// Replace scriptSrc with:
const bannerScript = getAdNetworkScript("google-adsense", { 
  client: "ca-pub-YOUR_PUBLISHER_ID" 
});

<ExternalAdScript scriptSrc={bannerScript} />
```

**For Promotions Page** (`src/app/promotions/page.tsx`):
```tsx
// Update these lines:
<ExternalAdScript 
  scriptSrc="https://js.propellerads.com/js/pa.js?zoneid=YOUR_ZONEID"
/>

<ExternalAdScript 
  scriptSrc="https://ajax.bidvertiser.com/bidvertiser.js?zoneid=YOUR_ZONEID"
/>
```

**For Promotion Detail Page** (`src/app/promotions/[id]/page.tsx`):
```tsx
// Update these lines with your actual network scripts
```

## Current Implementation

Your ads are currently placed on:

1. **Homepage** (`src/app/page.tsx`)
   - RotatingBannerAd
   - InlineAds (3 placements)
   - StickyAd

2. **Listings Page** (`src/app/listings/page.tsx`)
   - VerticalFeatureBanners
   - InlineAd
   - StickyAd

3. **Promotions Page** (`src/app/promotions/page.tsx`)
   - 2x ExternalAdScript (top section)
   - 1x ExternalAdScript (bottom section)

4. **Promotion Detail Page** (`src/app/promotions/[id]/page.tsx`)
   - 1x ExternalAdScript (Featured Partnership)
   - 1x ExternalAdScript (More Great Offers)

5. **Listing Detail Page** (`src/app/(listing-detail)/listing-stay-detail/[slug]/page.tsx`)
   - VerticalAdBanners (left sidebar)

## Best Practices

### ✅ Do's
- Use multiple ad networks (diversify revenue)
- Place ads where users naturally pause to read
- Test different ad formats (banners, native, popunder)
- Monitor CPM rates and adjust accordingly
- Start with instant-approval networks while waiting for AdSense

### ❌ Don'ts
- Place too many ads (hurts user experience)
- Use deceptive ad placements
- Click your own ads (violates TOS)
- Place ads on low-traffic pages initially
- Ignore ad network policies and guidelines

## Revenue Optimization Tips

### For New Sites (0-1000 monthly views)
```
1. Set up Propeller Ads or BidVertiser (instant approval)
2. Add 1-2 ad placements only
3. Apply for Google AdSense (keep as backup)
4. Monitor traffic growth
```

### For Growing Sites (1000-10000 monthly views)
```
1. Keep Propeller/BidVertiser running
2. Add Sovrn for better targeting
3. Apply for Mediavine if you hit 5000+ views/month
4. Test Google AdSense
5. Add 2-3 ad placements total
```

### For Established Sites (10000+ monthly views)
```
1. Use Mediavine as primary (highest CPM)
2. Keep Sovrn as backup
3. Use Google AdSense for additional revenue
4. 3-4 ad placements maximum
5. Focus on user experience, ads are secondary
```

## Performance Monitoring

**In Google Analytics:**
1. Set up conversion tracking for ad clicks
2. Monitor bounce rate with ads enabled
3. Track average session duration
4. Adjust ad placement if bounce rate increases >10%

**In Ad Network Dashboards:**
1. Monitor CPM trends
2. Check click-through rates (CTR)
3. Track revenue per 1000 views (RPM)
4. A/B test different placements

## Troubleshooting

### Ads Not Showing?
- Check that script URL is correct
- Verify your account is approved
- Wait 24-48 hours after initial setup
- Check browser console for script errors
- Ensure no ad blockers are interfering

### Low Earnings?
- Increase page traffic
- Improve page load speed
- Add more high-quality content
- Diversify ad networks
- Test different ad placements

### Script Loading Errors?
- Verify scriptSrc URL is exact
- Check that there are no typos
- Ensure HTTPS (not HTTP)
- Test in incognito/private browser
- Check ExternalAdScript console logs

## Next Steps

1. **Sign up with 2-3 ad networks** (recommend: Propeller Ads + BidVertiser + Google AdSense)
2. **Get your credentials** and update `src/data/adNetworks.ts`
3. **Update the script URLs** in your pages
4. **Test ads** in different browsers
5. **Monitor performance** for first month
6. **Optimize** based on earnings and user feedback

## Support Resources

- Google AdSense Help: https://support.google.com/adsense
- Propeller Ads Support: https://www.propellerads.com/support
- BidVertiser Support: https://www.bidvertiser.com/contact
- Sovrn Help: https://help.sovrn.com
- Mediavine Support: https://www.mediavine.com/contact

---

**Questions?** Check ExternalAdScript component logs in browser developer tools (F12 > Console) for detailed error messages.
