import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    // Verify the user owns the business
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true }
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // Check if user is the owner
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user || user.id !== business.ownerId) {
      return NextResponse.json(
        { error: "Unauthorized - You don't own this business" },
        { status: 403 }
      );
    }

    // Fetch all property listings for this business
    const listings = await prisma.propertyListing.findMany({
      where: {
        businessId: businessId
      },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        status: true,
        category: true,
        type: true,
        beds: true,
        baths: true,
        pricePerNight: true,
        amenities: true,
        features: true,
        rules: true,
        address: true,
        city: true,
        latitude: true,
        longitude: true,
        minNights: true,
        maxNights: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
        approvedBy: true,
        approvedAt: true
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      success: true,
      listings
    });
  } catch (error) {
    console.error("Error fetching property listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch property listings" },
      { status: 500 }
    );
  }
}
