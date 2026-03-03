# Namibia Services - Comprehensive Ads System Guide

## 📢 Overview

Your application now has a fully-featured advertising system with multiple ad placement types and flexible configuration options. This guide explains how to use and customize the ads system.

---

## 🎯 Ad Types & Placements

### 1. **Rotating Banner Ads** (`RotatingBannerAd`)
**Purpose:** Full-width promotional banners with auto-rotation  
**Best For:** Homepage hero sections, category pages  
**Features:**
- Auto-rotating carousel (5-second rotation by default)
- Manual navigation with previous/next buttons
- Dot indicators showing current ad
- Hover effects and smooth transitions
- Responsive design (aspect ratio: 5:1 on desktop, 4:1 on mobile)

**Usage:**
```tsx
import RotatingBannerAd from "@/components/ads/RotatingBannerAd";

export default function Page() {
  return (
    <div>
      <RotatingBannerAd />
      {/* or with custom props */}
      <RotatingBannerAd 
        autoRotate={true} 
        rotationInterval={7000}  // 7 seconds
        className="mt-8"
      />
    </div>
  );
}
```

---

### 2. **Sidebar Ads** (`SidebarAd`)
**Purpose:** Sticky sidebar ads that rotate automatically  
**Best For:** Listing pages, detailed product/business pages  
**Features:**
- Sticky positioning (stays visible while scrolling)
- Rotating carousel (8-second rotation)
- Clickable indicators to jump to specific ads
- Compact design (3:4 aspect ratio)
- Dark mode support

**Usage:**
```tsx
import SidebarAd from "@/components/ads/SidebarAd";

export default function LayoutPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <main className="lg:col-span-2">
        {/* Main content */}
      </main>
      <aside className="lg:col-span-1">
        <SidebarAd />
      </aside>
    </div>
  );
}
```

---

### 3. **Inline Ads** (`InlineAd`)
**Purpose:** Flexible inline ads between content sections  
**Best For:** Between sections, in feeds, within listings  
**Features:**
- Three style variants: `default`, `minimal`, `highlight`
- Dismissible (user can close)
- Responsive grid layouts
- Call-to-action buttons

**Usage:**
```tsx
import InlineAd from "@/components/ads/InlineAd";

export default function Page() {
  return (
    <div>
      <section>Content Section 1</section>
      
      {/* Default style - full width */}
      <InlineAd style="default" className="my-6" />
      
      <section>Content Section 2</section>
      
      {/* Highlight style - featured */}
      <InlineAd style="highlight" className="my-6" />
      
      <section>Content Section 3</section>
      
      {/* Minimal style - compact */}
      <InlineAd style="minimal" className="my-6" />
    </div>
  );
}
```

**Style Variants:**
- **default**: Full-width video aspect ratio with overlay
- **minimal**: Horizontal compact design, good for sidebars
- **highlight**: Featured design with image and text layout

---

### 4. **Sticky Ads** (`StickyAd`)
**Purpose:** Fixed position ads that persist while scrolling  
**Best For:** Page-wide promotion, newsletter signup ads  
**Features:**
- Fixed positioning (bottom-right, bottom-left, or top-right)
- Auto-rotation with manual navigation
- Dismissible
- Perfectly sized for compact spaces

**Usage:**
```tsx
import StickyAd from "@/components/ads/StickyAd";

export default function Layout({ children }) {
  return (
    <>
      <StickyAd position="bottom-right" />
      {/* Positions: 'bottom-right', 'bottom-left', 'top-right' */}
      {children}
    </>
  );
}
```

---

## 🎨 Ad Configuration

All ads are configured in:  
**File:** `src/data/ads.ts`

### Adding New Ads

Edit the `ADS_LIST` array to add new ads:

```tsx
export const ADS_LIST: AdConfig[] = [
  {
    id: 'ad-unique-id',           // Unique identifier
    title: 'Ad Title',             // Display title
    image: '/path/to/image.jpg',   // Image path in public folder
    link: 'https://example.com',   // Click-through URL
    alt: 'Alt text',               // Image alt text
    type: 'banner',                // 'banner' | 'sidebar' | 'inline' | 'sticky'
    priority: 1,                   // Order (lower number = higher priority)
    category?: 'optional',         // Optional categorization
  },
  // ... more ads
];
```

### Ad Types Explained

- **banner**: For `RotatingBannerAd` component
- **sidebar**: For `SidebarAd` component  
- **inline**: For `InlineAd` component
- **sticky**: For `StickyAd` component

### Helper Functions

```tsx
// Get ads of specific type
getAdsByType('banner')  // Returns array of banner ads

// Get random ad of specific type
getRandomAd('sidebar')  // Returns single random sidebar ad

// Get random ad from all ads
getRandomAd()          // Returns any random ad
```

---

## 📍 Where Ads Are Currently Implemented

### Homepage (`src/app/page.tsx`)
- ✅ Rotating banner ad after hero
- ✅ Highlight inline ad after categories
- ✅ Default inline ad after featured businesses
- ✅ Minimal inline ad before newsletter
- ✅ Sticky ad (bottom-right)

### Listings Page (`src/app/listings/page.tsx`)
- ✅ Rotating banner ad in header
- ✅ Highlight inline ad after listing grid
- ✅ Minimal inline ad in Business CTA section
- ✅ Sticky ad (bottom-left)

### Promotions Page (`src/app/promotions/page.tsx`)
- ✅ Highlight inline ad after 6th promotion item
- ✅ Sticky ad (bottom-right)

---

## 🚀 Adding Ads to More Pages

### Step 1: Import Ad Components
```tsx
import RotatingBannerAd from "@/components/ads/RotatingBannerAd";
import InlineAd from "@/components/ads/InlineAd";
import SidebarAd from "@/components/ads/SidebarAd";
import StickyAd from "@/components/ads/StickyAd";
```

### Step 2: Add to JSX
```tsx
export default function BusinessPage() {
  return (
    <>
      <StickyAd position="bottom-right" />
      
      <main className="container">
        <section>Business Details</section>
        <InlineAd style="default" className="my-8" />
        
        <section>Reviews</section>
        <InlineAd style="minimal" className="my-8" />
      </main>
      
      <aside>
        <SidebarAd />
      </aside>
    </>
  );
}
```

### Step 3: Customize with Props
```tsx
// Rotate every 10 seconds instead of 5
<RotatingBannerAd rotationInterval={10000} />

// Prevent auto-rotation
<RotatingBannerAd autoRotate={false} />

// Custom styling
<InlineAd style="highlight" className="bg-white rounded-2xl" />

// Position sticky ad at top-right
<StickyAd position="top-right" />
```

---

## 🎯 Ad Layout Component

For consistent ad layouts with sidebar ads:

```tsx
import AdLayout from "@/components/ads/AdLayout";

export default function Page() {
  return (
    <AdLayout showSidebar={true} showSticky={true}>
      <main>
        {/* Your content here */}
      </main>
      {/* SidebarAd automatically rendered on right */}
      {/* StickyAd automatically rendered */}
    </AdLayout>
  );
}
```

**Props:**
- `showSidebar`: Whether to show sidebar ad (default: true)
- `showSticky`: Whether to show sticky ad (default: true)
- `stickyPosition`: Position of sticky ad (default: 'bottom-right')

---

## 🎨 Customization

### Styling Ads

All ad components use consistent color schemes:
- **Primary**: Burgundy (#600 - #700)
- **Text**: Neutral 900/200 (light/dark mode)
- **Backgrounds**: White/Neutral 800 (light/dark mode)

Override with custom CSS:

```tsx
<RotatingBannerAd className="rounded-lg shadow-2xl" />
<InlineAd className="border-2 border-burgundy-600" />
```

### Changing Rotation Speed

```tsx
// Slower rotation (15 seconds)
<RotatingBannerAd rotationInterval={15000} />

// Sidebar ads (default 8 seconds - edit SidebarAd.tsx line ~24)
```

---

## 📊 Performance Considerations

- **Lazy Loading**: Images use Next.js Image optimization
- **Automatic Cleanup**: Intervals cleared on unmount
- **Responsive Images**: Different aspect ratios for different devices
- **Dark Mode**: Full dark mode support (dark: classes)

---

## 🔄 Updating Ad Inventory

### Quick Update
Edit `src/data/ads.ts`:

```tsx
const ADS_LIST: AdConfig[] = [
  // Update existing ads
  {
    id: 'ad-1',
    title: 'New Campaign Title',
    image: '/images/new-image.jpg',
    link: 'https://new-url.com',
    // ... rest of config
  },
];
```

### For Real-World Ads

Consider migrating to a database:

```tsx
// Example: Fetch from database
async function getAds() {
  const ads = await prisma.advertisement.findMany({
    where: { active: true },
    orderBy: { priority: 'asc' }
  });
  return ads;
}
```

---

## 🧪 Testing Ads

### Manual Testing Checklist

- [ ] Banner ads rotate automatically
- [ ] Inline ads dismiss when close button clicked
- [ ] Sticky ads remain visible while scrolling
- [ ] Sidebar ads rotate on their timer
- [ ] All click-throughs work correctly
- [ ] Dark mode colors display properly
- [ ] Responsive on mobile/tablet
- [ ] No layout shift when ads load

### Adding Test Ads

In `src/data/ads.ts`, add test data:

```tsx
export const TEST_ADS: AdConfig[] = [
  {
    id: 'test-1',
    title: 'Test Banner Ad',
    image: '/images/ad.png',
    link: 'https://example.com',
    alt: 'Test',
    type: 'banner',
  },
  // ... more test ads
];
```

---

## 📚 Component Props Reference

### RotatingBannerAd

```tsx
interface RotatingBannerAdProps {
  className?: string;           // Custom CSS classes
  autoRotate?: boolean;          // Enable auto-rotation (default: true)
  rotationInterval?: number;     // Rotation speed in ms (default: 5000)
}
```

### SidebarAd

```tsx
interface SidebarAdProps {
  className?: string;            // Custom CSS classes
}
```

### InlineAd

```tsx
interface InlineAdProps {
  className?: string;            // Custom CSS classes
  style?: 'default' | 'minimal' | 'highlight';  // Variant
}
```

### StickyAd

```tsx
interface StickyAdProps {
  position?: 'bottom-left' | 'bottom-right' | 'top-right';
  className?: string;            // Custom CSS classes
}
```

---

## 🐛 Troubleshooting

### Ads not showing?
1. Check `src/data/ads.ts` - ensure `ADS_LIST` has items
2. Verify image paths exist in `public/` folder
3. Check browser console for errors

### Images not loading?
- Ensure image paths are relative to `/public` folder
- Use absolute paths: `/images/filename.jpg`
- Images should be 1200x300px for banners, 300x400px for sidebar

### Rotation not working?
- Check `rotationInterval` prop (default 5000ms)
- Verify no console errors
- Ensure component is not unmounting

### Dark mode colors off?
- Check `dark:` classes in components
- Verify Tailwind dark mode is enabled in `tailwind.config.js`

---

## 🚀 Future Enhancements

Suggested improvements:

1. **Database-driven ads**
   - Store ads in database
   - Admin panel to manage ads
   - Schedule ads by date

2. **Analytics**
   - Track impressions
   - Track click-throughs
   - A/B testing

3. **Targeting**
   - Show ads by location
   - Show ads by category
   - User-based targeting

4. **Dynamic Loading**
   - Fetch ads from API
   - Real-time updates
   - Cache management

---

## 📧 Support

For questions or issues with the ads system:

1. Check this guide
2. Review ad components in `src/components/ads/`
3. Check `src/data/ads.ts` configuration
4. Review component props in their TypeScript interfaces

---

**Last Updated:** March 3, 2026  
**System Version:** 1.0  
**Components:** 4 (RotatingBannerAd, SidebarAd, InlineAd, StickyAd)
