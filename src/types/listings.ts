export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  expiryDate: string;
  isActive: boolean;
  isFeatured?: boolean; // Paid featured promotion
  featuredUntil?: string; // End date for featured status
  terms?: string;
  promoCode?: string;
  ctaText?: string;
  bannerImage?: string;
  heroDescription?: string; // Added for hero section specific description
}

export interface ProductListing {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  priceUnit?: string;
  imageUrl: string;
  category: string;
  businessName: string;
  businessLogo?: string;
  location: string;
  rating: number;
  reviewCount: number;
  deliveryAvailable: boolean;
  promotions?: Promotion[];
  tags?: string[];
  createdAt: string;
  isVerified?: boolean;
}

export type BusinessCategory = "all" | "electronics" | "food-beverage" | "beauty-wellness" | "professional-services" | "retail" | "financial" | "home-services" | "automotive" | "health-fitness";
