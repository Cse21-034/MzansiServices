import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// GET - Fetch all listings for a business
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const businessId = request.nextUrl.searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    // Verify user owns this business
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { owner: true }
    });

    if (!business || business.owner.email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const listings = await prisma.listing.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(listings, { status: 200 });
  } catch (error) {
    console.error("Get listings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

// POST - Create new listing with image
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const businessId = formData.get("businessId") as string;
    const imageFile = formData.get("image") as File | null;

    // Validate required fields
    if (!title || !businessId) {
      return NextResponse.json(
        { error: "Title and Business ID are required" },
        { status: 400 }
      );
    }

    // Verify user owns this business
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { owner: true }
    });

    if (!business || business.owner.email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    let imageUrl: string | null = null;

    // Handle image upload
    if (imageFile) {
      try {
        const buffer = await imageFile.arrayBuffer();
        const timestamp = Date.now();
        const filename = `listing-${businessId}-${timestamp}.${imageFile.type.split("/")[1]}`;
        
        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), "public", "uploads", "listings");
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true });
        }

        const filepath = join(uploadsDir, filename);
        const uint8Array = new Uint8Array(buffer);
        await writeFile(filepath, uint8Array);
        imageUrl = `/uploads/listings/${filename}`;
      } catch (imageError) {
        console.error("Image upload error:", imageError);
        // Continue without image if upload fails
      }
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        image: imageUrl,
        status: "ACTIVE",
        businessId
      }
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
