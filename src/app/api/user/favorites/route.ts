import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mutationLimiter } from "@/lib/rate-limit";

// Rate limiting is handled by middleware

export async function POST(req: Request) {
  try {
    await mutationLimiter.check(NextResponse, 10, 'favorites_api');

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { businessId } = body;

    if (!businessId) {
      return new NextResponse('Business ID is required', { status: 400 });
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_businessId: {
          userId: session.user.id,
          businessId
        }
      }
    });

    if (existing) {
      return new NextResponse('Business already in favorites', { status: 400 });
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        businessId
      },
      include: {
        business: {
          select: {
            name: true,
            category: { select: { name: true } },
            city: true,
            averageRating: true,
            reviewCount: true
          }
        }
      }
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error('Favorites API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
  await mutationLimiter.check(NextResponse, 10, 'favorites_delete_api');

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(req.url);
    const businessId = url.searchParams.get('businessId');

    if (!businessId) {
      return new NextResponse('Business ID is required', { status: 400 });
    }

    // Remove from favorites
    await prisma.favorite.delete({
      where: {
        userId_businessId: {
          userId: session.user.id,
          businessId
        }
      }
    });

    return new NextResponse('Removed from favorites', { status: 200 });
  } catch (error) {
    console.error('Favorites Delete API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
