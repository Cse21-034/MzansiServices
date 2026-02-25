import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Fetch single listing (PUBLIC - no authentication required)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: { 
        business: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            website: true,
            city: true,
            coverImage: true,
            description: true,
          }
        }
      }
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(listing, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      }
    });
  } catch (error) {
    console.error("Get listing error:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}
