# Quick Start: Adding More Ads to Namibia Services

## ⚡ 5-Minute Setup

### 1. Add Your Ad Images
Place image files in: `public/images/`

**Recommended sizes:**
- Banner ads: 1200px × 300px (or 5:1 aspect ratio)
- Sidebar ads: 300px × 400px (or 3:4 aspect ratio)
- Inline ads: Any size 16:9 or better

---

### 2. Register Your Ads
Edit: `src/data/ads.ts`

```tsx
export const ADS_LIST: AdConfig[] = [
  // ... existing ads
  
  // Add your new ad here:
  {
    id: 'my-new-ad',
    title: 'My Business Promotion',
    image: '/images/my-ad-image.jpg',  // Point to your image
    link: 'https://mybusiness.com',     // Click destination
    alt: 'My Business Promo',
    type: 'banner',                     // Choose: banner, sidebar, inline, sticky
    priority: 1,
  },
];
```

---

### 3. Use the Ad Component
Pick any page and add the ad:

```tsx
// At the top of your page file
import RotatingBannerAd from "@/components/ads/RotatingBannerAd";
import StickyAd from "@/components/ads/StickyAd";

export default function MyPage() {
  return (
    <>
      <StickyAd position="bottom-right" />
      
      {/* Your existing content */}
      <main>
        <h1>Welcome</h1>
        
        {/* Add the rotating banner */}
        <RotatingBannerAd />
        
        {/* More content */}
      </main>
    </>
  );
}
```

---

## 📋 Available Components

**Just pick one and drop it in:**

```tsx
// Full-width rotating banner (5-second rotation)
<RotatingBannerAd />

// Sticky corner ad (auto-rotating)
<StickyAd position="bottom-right" />

// Inline ad between content (3 styles available)
<InlineAd style="highlight" />

// Sidebar ad (sticky on right side)
<SidebarAd />
```

---

## 🎯 Where to Add Ads

**High-traffic pages (get most visibility):**
- ✅ Homepage (`src/app/page.tsx`) - DONE
- ✅ Listings page (`src/app/listings/page.tsx`) - DONE
- ✅ Promotions (`src/app/promotions/page.tsx`) - DONE
- [ ] Business directory (`src/app/business/`)
- [ ] Categories (`src/app/categories/`)
- [ ] Stay listings (`src/app/(stay-listings)/`)

---

## 💡 Best Practices

### Banner Ads
- Use for hero sections
- Limit to 1-2 per page
- Auto-rotation: 5-10 seconds is good

```tsx
<RotatingBannerAd rotationInterval={8000} />
```

### Sidebar Ads
- Perfect for detail pages
- Shows business listings, category pages
- Sticky = stays visible while scrolling

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3">
  <main className="lg:col-span-2">Content</main>
  <aside><SidebarAd /></aside>
</div>
```

### Inline Ads
- Insert between content sections
- Use `style="highlight"` for prominence
- User can dismiss these

```tsx
<section>First content block</section>
<InlineAd style="highlight" className="my-8" />
<section>Next content block</section>
```

### Sticky Ads
- Fixed position while user scrolls
- Good for announcements/promotions
- Don't overuse (can be annoying)

```tsx
// Only one per page, usually
<StickyAd position="bottom-right" />
```

---

## 🎨 Styling

All components support custom CSS:

```tsx
<RotatingBannerAd className="rounded-xl shadow-2xl" />
<SidebarAd className="border-2 border-burgundy-600" />
<InlineAd className="bg-red-50 dark:bg-red-900/20" />
```

Dark mode is built-in! No extra work needed.

---

## 🚦 Control Rotation Speed

**Banner ads (milliseconds):**
```tsx
<RotatingBannerAd rotationInterval={3000} />  // 3 seconds (fast)
<RotatingBannerAd rotationInterval={10000} /> // 10 seconds (slow)
<RotatingBannerAd autoRotate={false} />       // Manual only
```

**Sidebar ads:** Edit `src/components/ads/SidebarAd.tsx` line 24

---

## 🔗 Full Ads Already Added

### Homepage
```
1. Rotating banner ad (premium)
2. Highlight inline ad 
3. Default inline ad
4. Minimal inline ad
5. Sticky ad (bottom-right)
```

### Listings Page
```
1. Rotating banner ad in header
2. Highlight inline ad after grid
3. Minimal inline ad in CTA
4. Sticky ad (bottom-left)
```

### Promotions Page
```
1. Highlight inline ad (6th item)
2. Sticky ad (bottom-right)
```

---

## 📊 Ad Performance Tips

1. **Image quality matters**
   - Use high-quality images
   - Compress for web (use tinypng.com or similar)
   - Stay under 500KB per image

2. **Keep links working**
   - Test all click-through URLs
   - Make sure URLs start with `https://`

3. **Rotate inventory**
   - Change ads weekly/monthly
   - Keep content fresh
   - Users ignore stale ads

4. **Match brand colors**
   - Burgundy (#600-#700) matches your theme
   - Use consistent fonts
   - Professional appearance matters

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Ads not showing | Check `ADS_LIST` in `src/data/ads.ts` |
| Images broken | Verify path starts with `/images/` |
| Rotation not working | Check rotation timer component |
| Sticky ad stuck | Clear browser cache and restart |
| Dark mode colors wrong | Check `dark:` class names |

---

## 📝 Example: Add a Real Business Ad

```tsx
// 1. Place image: public/images/restaurant-promo.jpg

// 2. Add to src/data/ads.ts
{
  id: 'pizza-palace-ad',
  title: 'Pizza Palace - Best in Town!',
  image: '/images/restaurant-promo.jpg',
  link: 'https://pizzapalace.com.na',
  alt: 'Pizza Palace Promotion',
  type: 'banner',
  priority: 1,
}

// 3. Add to any page
<RotatingBannerAd />

// 4. Done! Pizza ad now shows in rotation
```

---

## 🎯 Next Steps

- [ ] Add real ad images to `public/images/`
- [ ] Update `src/data/ads.ts` with your ads
- [ ] Add components to more pages
- [ ] Test on mobile/dark mode
- [ ] Monitor which positions get most clicks
- [ ] Rotate ads monthly

---

## 💬 Questions?

See full docs: `ADS_SYSTEM_GUIDE.md`

---

**Ready to monetize? Start by adding ads today!** 🚀
