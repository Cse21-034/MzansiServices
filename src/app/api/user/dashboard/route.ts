import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch all user data in parallel
    const [
      reviews,
      favorites,
      bookings,
      notifications,
      user
    ] = await Promise.all([
      // Get user's reviews with business details
      prisma.review.findMany({
        where: { userId: session.user.id },
        include: {
          business: {
            select: {
              name: true,
              category: { select: { name: true } },
              city: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      // Get user's favorites with business details
      prisma.favorite.findMany({
        where: { userId: session.user.id },
        include: {
          business: {
            select: {
              id: true,
              name: true,
              category: { select: { name: true } },
              city: true,
              averageRating: true,
              reviewCount: true,
              businessHours: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      // Get user's bookings
      prisma.booking.findMany({
        where: { userId: session.user.id },
        include: {
          business: {
            select: {
              name: true,
              city: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      // Get user's notifications
      prisma.notification.findMany({
        where: { 
          userId: session.user.id,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      // Get detailed user info
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          name: true,
          email: true,
          image: true,
          createdAt: true,
          membershipType: true,
          phone: true,
          bio: true,
          location: true,
          website: true,
          _count: {
            select: {
              reviews: true,
              favorites: true,
              bookings: true
            }
          }
        }
      })
    ]);

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Calculate stats
    const stats = {
      totalReviews: user._count.reviews,
      totalFavorites: user._count.favorites,
      totalBookings: user._count.bookings,
      averageRating: reviews.length ? 
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0,
      totalLikes: reviews.reduce((sum, review) => sum + review.likes, 0)
    };

    // Format response
    const response = {
      user,
      stats,
      recentActivity: {
        reviews: reviews.slice(0, 5),
        favorites: favorites.slice(0, 5),
        bookings: bookings.slice(0, 5),
        notifications: notifications.slice(0, 5)
      },
      allData: {
        reviews,
        favorites,
        bookings,
        notifications: notifications.filter(n => !n.read)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}