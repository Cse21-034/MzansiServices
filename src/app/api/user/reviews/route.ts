import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mutationLimiter } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // Rate limiting
    // Get client IP or session ID
    const clientId = crypto.randomUUID(); // In production, use IP or session
    try {
      await mutationLimiter.check(NextResponse, 10, clientId);
    } catch (err) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { businessId, rating, title, comment, images = [] } = body;

    if (!businessId || !rating) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Check if user has already reviewed this business
    const existingReview = await prisma.review.findUnique({
      where: {
        businessId_userId: {
          businessId,
          userId: session.user.id
        }
      }
    });

    if (existingReview) {
      return new NextResponse('You have already reviewed this business', { status: 400 });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        businessId,
        userId: session.user.id,
        rating,
        title,
        comment,
        images,
      }
    });

    // Update business average rating
    await prisma.business.update({
      where: { id: businessId },
      data: {
        reviewCount: { increment: 1 },
        averageRating: {
          set: await calculateNewAverageRating(businessId)
        }
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Review API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await mutationLimiter.check(NextResponse, 5, 'review_delete_api');
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(req.url);
    const reviewId = url.searchParams.get('id');

    if (!reviewId) {
      return new NextResponse('Review ID is required', { status: 400 });
    }

    // Check if review exists and belongs to user
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        userId: session.user.id
      }
    });

    if (!review) {
      return new NextResponse('Review not found', { status: 404 });
    }

    // Delete review
    await prisma.review.delete({
      where: { id: reviewId }
    });

    // Update business average rating
    await prisma.business.update({
      where: { id: review.businessId },
      data: {
        reviewCount: { decrement: 1 },
        averageRating: {
          set: await calculateNewAverageRating(review.businessId)
        }
      }
    });

    return new NextResponse('Review deleted', { status: 200 });
  } catch (error) {
    console.error('Review Delete API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

async function calculateNewAverageRating(businessId: string): Promise<number> {
  const reviews = await prisma.review.findMany({
    where: { businessId },
    select: { rating: true }
  });

  if (reviews.length === 0) return 0;

  const total = reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
  return total / reviews.length;
}
