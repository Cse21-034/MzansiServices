import type { User, Review, Favorite, Booking, Notification, UserMembershipType } from "@prisma/client";

export interface DashboardUser extends Omit<User, "password"> {
  _count: {
    reviews: number;
    favorites: number;
    bookings: number;
  };
}

export interface ReviewWithBusiness extends Review {
  business: {
    name: string;
    category: { name: string };
    city: string;
  };
}

export interface FavoriteWithBusiness extends Favorite {
  business: {
    id: string;
    name: string;
    category: { name: string };
    city: string;
    averageRating: number | null;
    reviewCount: number;
    businessHours: Array<{
      dayOfWeek: number;
      openTime: string | null;
      closeTime: string | null;
      isClosed: boolean;
    }>;
  };
}

export interface BookingWithBusiness extends Booking {
  business: {
    name: string;
    city: string;
  };
}

export interface DashboardData {
  user: DashboardUser;
  stats: {
    totalReviews: number;
    totalFavorites: number;
    totalBookings: number;
    averageRating: number;
    totalLikes: number;
  };
  recentActivity: {
    reviews: ReviewWithBusiness[];
    favorites: FavoriteWithBusiness[];
    bookings: BookingWithBusiness[];
    notifications: Notification[];
  };
  allData: {
    reviews: ReviewWithBusiness[];
    favorites: FavoriteWithBusiness[];
    bookings: BookingWithBusiness[];
    notifications: Notification[];
  };
}
