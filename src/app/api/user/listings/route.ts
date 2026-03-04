import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user's primary business (where isBranch = false)
    const primaryBusiness = await prisma.business.findFirst({
      where: {
        ownerId: session.user.id,
        isBranch: false,
      },
    });

    if (!primaryBusiness) {
      return NextResponse.json({ listings: [] });
    }

    // Fetch all property listings for the user's primary business
    // Only fetch listings with property-specific fields (beds, baths, pricePerNight)
    const listings = await prisma.listing.findMany({
      where: {
        businessId: primaryBusiness.id,
        // Only fetch property listings (those with property-specific fields)
        OR: [
          { beds: { not: null } },
          { baths: { not: null } },
          { pricePerNight: { not: null } }
        ]
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      listings,
    });
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
