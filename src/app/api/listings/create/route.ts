import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    const {
      title,
      description,
      category,
      type,
      beds,
      baths,
      amenities,
      features,
      pricePerNight,
      rules,
      address,
      city,
      latitude,
      longitude,
      minNights,
      maxNights,
    } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Find user's primary business
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { businesses: { where: { isBranch: false } } }
    });

    if (!user || !user.businesses || user.businesses.length === 0) {
      return NextResponse.json(
        { error: "Please create a business profile first" },
        { status: 400 }
      );
    }

    const business = user.businesses[0];

    // Create the property listing (using PropertyListing model, not Listing)
    const listing = await prisma.propertyListing.create({
      data: {
        title,
        description,
        category: category || "General",
        type: type || "General",
        beds: beds || 1,
        baths: baths || 1,
        amenities: amenities || [],
        features: features || [],
        pricePerNight: pricePerNight || 0,
        rules: rules || "",
        address: address || "",
        city: city || "",
        latitude: latitude || null,
        longitude: longitude || null,
        minNights: minNights || 1,
        maxNights: maxNights || 365,
        status: "PENDING",
        businessId: business.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        listing,
        message: "Listing created successfully! It's pending review.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create listing error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
