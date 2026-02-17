import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch business membership details
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const businessId = url.searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        membershipCardImage: true,
        membershipNumber: true,
        membershipStatus: true,
        membershipType: true,
        membershipExpiryDate: true,
        membershipProvider: true,
        membershipUploadedAt: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(business);
  } catch (error) {
    console.error("Error fetching membership:", error);
    return NextResponse.json(
      { error: "Failed to fetch membership" },
      { status: 500 }
    );
  }
}

// POST - Upload membership card
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("membershipCard") as File;
    const businessId = formData.get("businessId") as string;
    const membershipNumber = formData.get("membershipNumber") as string;
    const membershipType = formData.get("membershipType") as string;
    const membershipProvider = formData.get("membershipProvider") as string;
    const membershipExpiryDate = formData.get("membershipExpiryDate") as string;

    if (!file || !businessId) {
      return NextResponse.json(
        { error: "File and Business ID are required" },
        { status: 400 }
      );
    }

    // Verify business ownership
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true },
    });

    if (!business || business.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to update this business" },
        { status: 403 }
      );
    }

    // Upload file to Supabase
    const fileExt = file.name.split(".").pop();
    const fileName = `${businessId}-${Date.now()}.${fileExt}`;
    const filePath = `business-membership/${fileName}`;

    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("business-images")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Get public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("business-images").getPublicUrl(filePath);

    // Update business with membership details
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: {
        membershipCardImage: publicUrl,
        membershipNumber: membershipNumber || null,
        membershipType: membershipType || null,
        membershipProvider: membershipProvider || null,
        membershipExpiryDate: membershipExpiryDate
          ? new Date(membershipExpiryDate)
          : null,
        membershipStatus: "PENDING",
        membershipUploadedAt: new Date(),
      },
      select: {
        id: true,
        membershipCardImage: true,
        membershipNumber: true,
        membershipStatus: true,
        membershipType: true,
        membershipExpiryDate: true,
        membershipProvider: true,
        membershipUploadedAt: true,
      },
    });

    return NextResponse.json(updatedBusiness, { status: 200 });
  } catch (error) {
    console.error("Error uploading membership:", error);
    return NextResponse.json(
      { error: "Failed to upload membership" },
      { status: 500 }
    );
  }
}

// PUT - Update membership details
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, membershipStatus, ...data } = await req.json();

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    // Verify business ownership or admin
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    if (
      business.ownerId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "You don't have permission to update this business" },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: any = {
      ...data,
      membershipExpiryDate: data.membershipExpiryDate
        ? new Date(data.membershipExpiryDate)
        : undefined,
    };

    if (membershipStatus) {
      updateData.membershipStatus = membershipStatus;
    }

    // Update membership details
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: updateData,
      select: {
        id: true,
        membershipCardImage: true,
        membershipNumber: true,
        membershipStatus: true,
        membershipType: true,
        membershipExpiryDate: true,
        membershipProvider: true,
        membershipUploadedAt: true,
      },
    });

    return NextResponse.json(updatedBusiness);
  } catch (error) {
    console.error("Error updating membership:", error);
    return NextResponse.json(
      { error: "Failed to update membership" },
      { status: 500 }
    );
  }
}

// DELETE - Remove membership
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId } = await req.json();

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    // Verify business ownership
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true, membershipCardImage: true },
    });

    if (!business || business.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to delete membership for this business" },
        { status: 403 }
      );
    }

    // Delete image from Supabase if exists
    if (business.membershipCardImage) {
      const fileName = business.membershipCardImage.split("/").pop();
      if (fileName) {
        await supabase.storage
          .from("business-images")
          .remove([`business-membership/${fileName}`]);
      }
    }

    // Clear membership details
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: {
        membershipCardImage: null,
        membershipNumber: null,
        membershipStatus: "NONE",
        membershipType: null,
        membershipExpiryDate: null,
        membershipProvider: null,
        membershipUploadedAt: null,
      },
      select: {
        id: true,
        membershipStatus: true,
      },
    });

    return NextResponse.json(updatedBusiness);
  } catch (error) {
    console.error("Error deleting membership:", error);
    return NextResponse.json(
      { error: "Failed to delete membership" },
      { status: 500 }
    );
  }
}
