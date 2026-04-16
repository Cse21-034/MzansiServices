import { ProductListing } from "@/types/listings";

export const DEMO_PRODUCT_LISTINGS: ProductListing[] = [
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB",
    description: "Latest iPhone with A17 Pro chip, Titanium design, and advanced camera system. Unlocked and ready to use.",
    price: 1199,
    originalPrice: 1299,
    priceUnit: "one-time",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
    category: "electronics",
    businessName: "TechHub Electronics",
    businessLogo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop",
    location: "New York, NY",
    rating: 4.8,
    reviewCount: 124,
    deliveryAvailable: true,
    isVerified: true,
    createdAt: "2024-01-15",
    promotions: [
      {
        id: "p1",
        title: "Launch Special - Limited Time",
        description: "Special launch discount for the first 100 customers. Includes free AirPods with purchase.",
        discount: 15,
        expiryDate: "2024-12-31",
        isActive: true,
        isFeatured: true,
        featuredUntil: "2024-11-30",
        promoCode: "IPHONE15",
        ctaText: "Get Offer",
        heroDescription: "The best deal when you swipe a gold card on Fridays."
      },
      {
        id: "p2",
        title: "Trade-in Bonus Program",
        description: "Extra $100 credit for your old device trade-in. All models accepted.",
        discount: 8,
        expiryDate: "2024-11-30",
        isActive: true,
        promoCode: "TRADE100"
      }
    ],
    tags: ["smartphone", "apple", "premium"]
  },
  {
    id: "2",
    title: "Professional Bridal Makeup Package",
    description: "Complete bridal makeup experience including trial session, day-of service, and touch-up kit.",
    price: 350,
    priceUnit: "per package",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
    category: "beauty-wellness",
    businessName: "Luxe Beauty Studio",
    businessLogo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100&h=100&fit=crop",
    location: "Los Angeles, CA",
    rating: 4.9,
    reviewCount: 89,
    deliveryAvailable: false,
    isVerified: true,
    createdAt: "2024-02-10",
    promotions: [
      {
        id: "p3",
        title: "First Session 50% Off",
        description: "Experience our premium service at half price for your first appointment.",
        discount: 50,
        expiryDate: "2024-10-31",
        isActive: true,
        isFeatured: true,
        featuredUntil: "2024-10-15",
        ctaText: "Book Now"
      }
    ]
  },
  {
    id: "3",
    title: "Premium Device Insurance Plan",
    description: "Comprehensive coverage for mobile devices including accidental damage, theft, and loss protection.",
    price: 18.99,
    priceUnit: "per month",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
    category: "financial",
    businessName: "SecureGuard Insurance",
    businessLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    location: "Chicago, IL",
    rating: 4.5,
    reviewCount: 256,
    deliveryAvailable: true,
    isVerified: true,
    createdAt: "2024-01-05"
  },
  {
    id: "4",
    title: "Specialty Coffee Subscription",
    description: "Monthly delivery of premium single-origin coffee beans from Ethiopia. Freshly roasted each week.",
    price: 29.99,
    originalPrice: 35.99,
    priceUnit: "per month",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    category: "food-beverage",
    businessName: "Artisan Roast Co.",
    businessLogo: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=100&h=100&fit=crop",
    location: "Seattle, WA",
    rating: 4.7,
    reviewCount: 142,
    deliveryAvailable: true,
    isVerified: true,
    createdAt: "2024-02-01",
    promotions: [
      {
        id: "p4",
        title: "Free Month + Grinder",
        description: "Subscribe for 3 months and get 1 month free plus a premium coffee grinder.",
        discount: 33,
        expiryDate: "2024-10-15",
        isActive: true,
        ctaText: "Subscribe",
        heroDescription: "Get great burgers from your nearest Wimpy for P34,90."
      }
    ]
  },
  {
    id: "5",
    title: "Enterprise Web Development",
    description: "Custom web application development with cloud hosting, maintenance, and 24/7 support.",
    price: 12500,
    priceUnit: "project-based",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    category: "professional-services",
    businessName: "Digital Solutions Inc",
    businessLogo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop",
    location: "Austin, TX",
    rating: 4.6,
    reviewCount: 31,
    deliveryAvailable: true,
    isVerified: true,
    createdAt: "2024-01-20"
  },
  {
    id: "6",
    title: "Designer Leather Handbag Collection",
    description: "Handcrafted Italian leather handbags from our exclusive designer collection.",
    price: 680,
    originalPrice: 850,
    priceUnit: "per item",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop",
    category: "retail",
    businessName: "Velvet & Craft",
    businessLogo: "https://images.unsplash.com/photo-1563178402-5c4c47eb9c8b?w=100&h=100&fit=crop",
    location: "Miami, FL",
    rating: 4.8,
    reviewCount: 67,
    deliveryAvailable: true,
    isVerified: true,
    createdAt: "2024-02-05",
    promotions: [
      {
        id: "p5",
        title: "Seasonal Luxury Sale",
        description: "Limited time discount on premium leather goods. Complimentary monogramming included.",
        discount: 20,
        expiryDate: "2024-09-30",
        isActive: true,
        isFeatured: true,
        featuredUntil: "2024-03-31",
        ctaText: "Shop Now"
      }
    ]
  }
];

// For backward compatibility
export const DEMO_STAY_LISTINGS: any[] = [];
export const DEMO_CAR_LISTINGS: any[] = [];
export const DEMO_EXPERIENCES_LISTINGS: any[] = [];
