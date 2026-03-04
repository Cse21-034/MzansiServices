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
      where: { 
        businessId,
        // Only fetch GENERAL product listings (not property listings)
        // Property listings have non-null beds/baths/pricePerNight
        beds: null,
        baths: null,
        pricePerNight: null
      },
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

    // Handle image upload to Supabase Storage
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

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `listings/${businessId}/${timestamp}-${randomString}.${fileExtension}`;

        // Convert File to Buffer for server-side upload
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage
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

        // Get public URL
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
