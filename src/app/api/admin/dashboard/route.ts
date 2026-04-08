import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch all businesses
    const businesses = await prisma.business.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true } },
        reviews: true,
        favorites: true,
        bookings: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        businesses: { select: { id: true, name: true } },
        reviews: true,
        favorites: true,
        bookings: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // Fetch all reviews
    const reviews = await prisma.review.findMany({
      include: {
        business: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' }
    });

    // Stats
    const stats = {
      totalBusinesses: businesses.length,
      publishedBusinesses: businesses.filter(b => b.status === 'PUBLISHED').length,
      pendingBusinesses: businesses.filter(b => b.status === 'PENDING').length,
      suspendedBusinesses: businesses.filter(b => b.status === 'SUSPENDED').length,
      verifiedBusinesses: businesses.filter(b => b.verified).length,
      totalReviews: reviews.length,
      totalUsers: users.length,
      totalViews: businesses.reduce((sum, b) => sum + (b.viewCount || 0), 0),
      averageRating: reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
    };

    // Recent activity (last 10)
    const recentActivity = {
      businesses: businesses.slice(0, 10),
      reviews: reviews.slice(0, 10),
      users: users.slice(0, 10),
    };

    return NextResponse.json({
      stats,
      businesses,
      users,
      reviews,
      recentActivity
    });
  } catch (error) {
    console.error('Admin Dashboard API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
