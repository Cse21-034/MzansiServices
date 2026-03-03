# Quick Ad Network Configuration Reference

## Find & Replace Guide

Use this guide to quickly update all your ad network scripts with your actual credentials.

---

## 📍 Location 1: Promotions Page (`src/app/promotions/page.tsx`)

### Current Code (Lines ~469-483):
```tsx
<ExternalAdScript 
  scriptSrc="https://js.partnershipsprogram.com/javascript.php?prefix=-1DpJjc-4UjzqbYFgbz_omNd7ZgqdRLk&media=2910&campaign=1"
/>
<ExternalAdScript 
  scriptSrc="https://js.example-ad-network.com/ads?channel=promotions&format=rectangle"
/>
```

### Replace With (Example - Using Propeller Ads + BidVertiser):

**Option A: Propeller Ads + BidVertiser**
```tsx
<ExternalAdScript 
  scriptSrc="https://js.propellerads.com/js/pa.js?zoneid=YOUR_PROPELLER_ZONEID"
/>
<ExternalAdScript 
  scriptSrc="https://ajax.bidvertiser.com/bidvertiser.js?zoneid=YOUR_BIDVERTISER_ZONEID"
/>
```

**Option B: Google AdSense + Sovrn**
```tsx
<ExternalAdScript 
  scriptSrc="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
/>
<ExternalAdScript 
  scriptSrc="https://ap.lijit.com/www/delivery/fpi.js?r=YOUR_SOVRN_ID"
/>
```

---

## 📍 Location 2: Promotions Page - Featured Partnerships Section (`src/app/promotions/page.tsx`, Lines ~567-571)

### Current Code:
```tsx
<ExternalAdScript 
  scriptSrc="https://js.partnershipsprogram.com/javascript.php?prefix=-1DpJjc-4UjzqbYFgbz_omNd7ZgqdRLk&media=2911&campaign=2"
/>
```

### Replace With:
```tsx
<ExternalAdScript 
  scriptSrc="https://js.propellerads.com/js/pa.js?zoneid=YOUR_PROPELLER_ZONEID"
/>
```

---

## 📍 Location 3: Promotion Detail Page - Featured Partnership (`src/app/promotions/[id]/page.tsx`)

### Current Code:
```tsx
<ExternalAdScript 
  scriptSrc="https://js.partnershipsprogram.com/javascript.php?prefix=-1DpJjc-4UjzqbYFgbz_omNd7ZgqdRLk&media=2912&campaign=3"
/>
```

### Replace With:
```tsx
<ExternalAdScript 
  scriptSrc="https://ajax.bidvertiser.com/bidvertiser.js?zoneid=YOUR_BIDVERTISER_ZONEID"
/>
```

---

## 📍 Location 4: Promotion Detail Page - More Great Offers (`src/app/promotions/[id]/page.tsx`)

### Current Code:
```tsx
<ExternalAdScript 
  scriptSrc="https://js.partnershipsprogram.com/javascript.php?prefix=-1DpJjc-4UjzqbYFgbz_omNd7ZgqdRLk&media=2913&campaign=4"
/>
```

### Replace With:
```tsx
<ExternalAdScript 
  scriptSrc="https://ap.lijit.com/www/delivery/fpi.js?r=YOUR_SOVRN_ID"
/>
```

---

## 🔧 Getting Your Credentials

### Google AdSense
1. Go to https://adsense.google.com
2. Sign in with Google account
3. Add your website & wait for approval
4. Your Publisher ID appears in: **Settings > Account Information**
5. Format: `ca-pub-1234567890123456`

### Propeller Ads
1. Go to https://www.propellerads.com/sign-up
2. Create account
3. Create "Advertising Zone"
4. Your Zone ID shows on the **Zones** page
5. Format: `1234567`

### BidVertiser
1. Go to https://www.bidvertiser.com
2. Create account
3. Create "Zone/Ad Unit"
4. Zone ID shows in **My Zones**
5. Format: `1234567`

### Sovrn
1. Go to https://www.sovrn.com
2. Create publisher account
3. Add your domain
4. Your Sovrn ID shows in **Account Settings**
5. Format: `1234567`

---

## 📋 Complete Replacement Examples

### Example 1: Propeller Ads (All Placements)

**Replace ALL scriptSrc values with:**
```tsx
scriptSrc="https://js.propellerads.com/js/pa.js?zoneid=1234567"
```
(Replace `1234567` with your actual Zone ID)

---

### Example 2: BidVertiser (All Placements)

**Replace ALL scriptSrc values with:**
```tsx
scriptSrc="https://ajax.bidvertiser.com/bidvertiser.js?zoneid=1234567"
```
(Replace `1234567` with your actual Zone ID)

---

### Example 3: Google AdSense (All Placements)

**Replace ALL scriptSrc values with:**
```tsx
scriptSrc="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
```
(Replace `ca-pub-1234567890123456` with your actual Publisher ID)

---

### Example 4: Mixed Networks (Recommended for Diversity)

```tsx
// Promotion Page - Top Section
<ExternalAdScript 
  scriptSrc="https://js.propellerads.com/js/pa.js?zoneid=PROPELLER_ZONE_1"
/>
<ExternalAdScript 
  scriptSrc="https://ajax.bidvertiser.com/bidvertiser.js?zoneid=BIDVERTISER_ZONE_1"
/>

// Promotion Page - Featured Partnerships
<ExternalAdScript 
  scriptSrc="https://ap.lijit.com/www/delivery/fpi.js?r=SOVRN_ID"
/>

// Promotion Detail - Featured Partnership
<ExternalAdScript 
  scriptSrc="https://js.propellerads.com/js/pa.js?zoneid=PROPELLER_ZONE_2"
/>

// Promotion Detail - More Great Offers
<ExternalAdScript 
  scriptSrc="https://ajax.bidvertiser.com/bidvertiser.js?zoneid=BIDVERTISER_ZONE_2"
/>
```

---

## 🚀 Recommended Setup Strategy

### Phase 1: Immediate (Week 1)
- Sign up with **Propeller Ads** (instant approval)
- Sign up with **BidVertiser** (instant approval)
- Update all scriptSrc with one of these
- Start earning immediately

### Phase 2: Diversify (Week 2-3)
- Apply to **Google AdSense**
- Sign up with **Sovrn**
- Mix networks across pages
- Test different combinations

### Phase 3: Optimize (Month 2+)
- Monitor earnings from each network
- Keep top 2-3 performing networks
- Remove underperforming networks
- Apply to **Mediavine** if traffic allows (25k+ monthly)

---

## ⚡ Testing Your Setup

### Test in Browser:
1. Open page in incognito/private window (bypasses some ad blockers)
2. Open Developer Tools (F12)
3. Go to **Console** tab
4. Look for messages:
   - ✅ "Ad script loaded successfully" = Working
   - ❌ "Failed to load ad script" = Check URL
5. Check **Network** tab to see if script loaded

### Check Block Lists:
- Ads might be blocked by ad blockers
- Test with ad blocker disabled
- Look for placeholders where ads should be

---

## 📊 Monitoring Your Earnings

### Daily Checks:
1. Each ad network dashboard
2. Check impressions and clicks
3. Calculate CPM (Cost Per Mille)
4. Formula: **CPM = (Earnings / Impressions) * 1000**

### Weekly Reviews:
1. Compare networks
2. Check which placement gets most traffic
3. Adjust underperforming placements
4. Update configuration

### Monthly Analysis:
1. Total earnings across all networks
2. Remove networks with CPM < $1
3. Apply for premium networks (if eligible)
4. Plan optimizations

---

## 🆘 Troubleshooting

### Ads Not Showing?
- ✅ Check script URL exact (no typos)
- ✅ Verify after "YOUR_" placeholder is replaced
- ✅ Wait 24-48 hours after account setup
- ✅ Test without ad blockers
- ✅ Check browser console (F12) for errors

### Low Earnings?
- ✅ Need more traffic first (minimum 1000 daily views)
- ✅ Improve article/content quality
- ✅ Try different ad networks
- ✅ Test different ad placements
- ✅ Use Google Analytics to find high-traffic pages

### Account Approval Issues?
- ❌ **AdSense slow?** Normal (2-3 weeks)
- ✅ Use Propeller/BidVertiser while waiting
- ✅ Ensure content quality before applying
- ✅ Complete GDPR/Privacy policies on site
- ✅ Check email for approval status

---

## 📞 Need Help?

**Quick Contact Info:**
- Google AdSense: https://support.google.com/adsense
- Propeller Ads: support@propellerads.com
- BidVertiser: https://www.bidvertiser.com/contact
- Sovrn: https://help.sovrn.com

**In Your Code:**
- Check `ExternalAdScript.tsx` component
- Read console logs for detailed error messages
- Verify scriptSrc URLs are exact

---

## ✅ Checklist Before Going Live

- [ ] Created account(s) with ad network(s)
- [ ] Got Publisher ID / Zone ID
- [ ] Updated all scriptSrc values
- [ ] Tested ads in incognito browser
- [ ] No console errors (F12 > Console)
- [ ] Ads appear in correct locations
- [ ] All 4 locations updated:
  - [ ] Promotions page (top)
  - [ ] Promotions page (featured)
  - [ ] Promotion detail (featured partnership)
  - [ ] Promotion detail (more offers)
