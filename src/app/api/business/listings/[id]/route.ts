import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Initialize Supabase Admin directly in the route
const initSupabaseAdmin = async () => {
  const { createClient } = await import('@supabase/supabase-js');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(url, key);
};

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
        const supabaseAdmin = await initSupabaseAdmin();

        // Validate file type
        if (!imageFile.type.startsWith('image/')) {
          return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
        }

        // Validate file size (5MB max)
        if (imageFile.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
        }

        // Delete old image if exists
        if (existingListing.image) {
          try {
            // Extract file path from URL
            const urlParts = existingListing.image.split('/');
            const bucketIndex = urlParts.indexOf('business-images');
            if (bucketIndex !== -1) {
              const filePath = urlParts.slice(bucketIndex + 1).join('/');
              await supabaseAdmin.storage
                .from("business-images")
                .remove([filePath]);
            }
          } catch (deleteError) {
            console.error("Error deleting old image:", deleteError);
          }
        }

        // Upload new image
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `listings/${existingListing.businessId}/${timestamp}-${randomString}.${fileExtension}`;

        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data, error } = await supabaseAdmin.storage
          .from("business-images")
          .upload(fileName, buffer, {
            cacheControl: '3600',
            upsert: false,
            contentType: imageFile.type
          });

        if (error) {
          console.error('Upload error:', error);
          return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
        }

        const { data: publicUrlData } = supabaseAdmin.storage
          .from("business-images")
          .getPublicUrl(fileName);

        if (!publicUrlData.publicUrl) {
          throw new Error('Failed to get public URL');
        }

        imageUrl = publicUrlData.publicUrl;
      } catch (imageError) {
        console.error("Image upload error:", imageError);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
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

    // Delete image from Supabase if exists
    if (listing.image) {
      try {
        const supabaseAdmin = await initSupabaseAdmin();
        // Extract file path from URL
        const urlParts = listing.image.split('/');
        const bucketIndex = urlParts.indexOf('business-images');
        if (bucketIndex !== -1) {
          const filePath = urlParts.slice(bucketIndex + 1).join('/');
          await supabaseAdmin.storage
            .from("business-images")
            .remove([filePath]);
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
