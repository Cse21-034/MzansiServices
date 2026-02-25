import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Fetch single listing
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: { business: { include: { owner: true } } }
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Verify authorization
    if (listing.business.owner.email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json(listing, { status: 200 });
  } catch (error) {
    console.error("Get listing error:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}

// PUT - Update listing
export async function PUT(request: NextRequest, { params }: RouteParams) {
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
    const status = formData.get("status") as string;
    const imageFile = formData.get("image") as File | null;

    // Get existing listing
    const existingListing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: { business: { include: { owner: true } } }
    });

    if (!existingListing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Verify authorization
    if (existingListing.business.owner.email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    let imageUrl = existingListing.image;

    // Handle image upload/update
    if (imageFile) {
      try {
        // Delete old image if exists
        if (existingListing.image) {
          const oldImagePath = join(process.cwd(), "public", existingListing.image.replace(/^\//, ""));
          if (existsSync(oldImagePath)) {
            await unlink(oldImagePath);
          }
        }

        // Upload new image
        const buffer = await imageFile.arrayBuffer();
        const timestamp = Date.now();
        const filename = `listing-${existingListing.businessId}-${timestamp}.${imageFile.type.split("/")[1]}`;
        
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
      }
    }

    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status: status as any }),
        ...(imageUrl && { image: imageUrl })
      }
    });

    return NextResponse.json(updatedListing, { status: 200 });
  } catch (error) {
    console.error("Update listing error:", error);
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    );
  }
}

// DELETE - Delete listing
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: { business: { include: { owner: true } } }
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Verify authorization
    if (listing.business.owner.email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete image if exists
    if (listing.image) {
      try {
        const imagePath = join(process.cwd(), "public", listing.image.replace(/^\//, ""));
        if (existsSync(imagePath)) {
          await unlink(imagePath);
        }
      } catch (imageError) {
        console.error("Image deletion error:", imageError);
      }
    }

    await prisma.listing.delete({
      where: { id: params.id }
    });

    return NextResponse.json(
      { message: "Listing deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete listing error:", error);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}
