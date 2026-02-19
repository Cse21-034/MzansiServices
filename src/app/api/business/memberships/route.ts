import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch all memberships for a business
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

    const memberships = await prisma.businessMembership.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(memberships);
  } catch (error) {
    console.error("Error fetching memberships:", error);
    return NextResponse.json(
      { error: "Failed to fetch memberships" },
      { status: 500 }
    );
  }
}

// POST - Add a new membership
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("cardImage") as File | null;
    const businessId = formData.get("businessId") as string;
    const issuerName = formData.get("issuerName") as string;
    const membershipNumber = formData.get("membershipNumber") as string;
    const membershipType = formData.get("membershipType") as string;
    const expiryDate = formData.get("expiryDate") as string;

    if (!businessId || !issuerName || !membershipNumber) {
      return NextResponse.json(
        { error: "Business ID, issuer name, and membership number are required" },
        { status: 400 }
      );
    }

    // Verify business ownership
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
        { error: "You don't have permission to add memberships to this business" },
        { status: 403 }
      );
    }

    // Check if membership number already exists for this business
    const existingMembership = await prisma.businessMembership.findUnique({
      where: {
        businessId_membershipNumber: {
          businessId,
          membershipNumber,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "This membership number already exists for this business" },
        { status: 400 }
      );
    }

    let cardImageUrl: string | null = null;

    // Upload card image if provided
    if (file && file.size > 0) {
      const buffer = await file.arrayBuffer();
      const fileName = `${businessId}-${membershipNumber}-${Date.now()}.${file.type.split("/")[1]}`;
      const filePath = `business-memberships/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("business-images")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json(
          { error: "Failed to upload card image" },
          { status: 500 }
        );
      }

      const { data: { publicUrl } } = supabase.storage
        .from("business-images")
        .getPublicUrl(filePath);

      cardImageUrl = publicUrl;
    }

    const newMembership = await prisma.businessMembership.create({
      data: {
        businessId,
        issuerName,
        membershipNumber,
        membershipType: membershipType || null,
        cardImage: cardImageUrl,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        status: "PENDING",
      },
    });

    return NextResponse.json(newMembership, { status: 201 });
  } catch (error) {
    console.error("Error creating membership:", error);
    return NextResponse.json(
      { error: "Failed to create membership" },
      { status: 500 }
    );
  }
}

// PUT - Update a membership
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const membershipId = formData.get("membershipId") as string;
    const issuerName = formData.get("issuerName") as string;
    const membershipType = formData.get("membershipType") as string;
    const expiryDate = formData.get("expiryDate") as string;
    const file = formData.get("cardImage") as File | null;

    if (!membershipId) {
      return NextResponse.json(
        { error: "Membership ID is required" },
        { status: 400 }
      );
    }

    const membership = await prisma.businessMembership.findUnique({
      where: { id: membershipId },
      include: { business: { select: { ownerId: true } } },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Membership not found" },
        { status: 404 }
      );
    }

    if (
      membership.business.ownerId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "You don't have permission to update this membership" },
        { status: 403 }
      );
    }

    let cardImageUrl = membership.cardImage;

    // Handle new card image
    if (file && file.size > 0) {
      // Delete old image if exists
      if (membership.cardImage) {
        const oldFileName = membership.cardImage.split("/").pop();
        if (oldFileName) {
          await supabase.storage
            .from("business-images")
            .remove([`business-memberships/${oldFileName}`]);
        }
      }

      const buffer = await file.arrayBuffer();
      const fileName = `${membership.businessId}-${membership.membershipNumber}-${Date.now()}.${file.type.split("/")[1]}`;
      const filePath = `business-memberships/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("business-images")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json(
          { error: "Failed to upload card image" },
          { status: 500 }
        );
      }

      const { data: { publicUrl } } = supabase.storage
        .from("business-images")
        .getPublicUrl(filePath);

      cardImageUrl = publicUrl;
    }

    const updateData: any = {};
    if (issuerName) updateData.issuerName = issuerName;
    if (membershipType) updateData.membershipType = membershipType;
    if (expiryDate) updateData.expiryDate = new Date(expiryDate);
    if (cardImageUrl !== undefined) updateData.cardImage = cardImageUrl;

    const updatedMembership = await prisma.businessMembership.update({
      where: { id: membershipId },
      data: updateData,
    });

    return NextResponse.json(updatedMembership);
  } catch (error) {
    console.error("Error updating membership:", error);
    return NextResponse.json(
      { error: "Failed to update membership" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a membership
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const membershipId = url.searchParams.get("membershipId");

    if (!membershipId) {
      return NextResponse.json(
        { error: "Membership ID is required" },
        { status: 400 }
      );
    }

    const membership = await prisma.businessMembership.findUnique({
      where: { id: membershipId },
      include: { business: { select: { ownerId: true } } },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Membership not found" },
        { status: 404 }
      );
    }

    if (
      membership.business.ownerId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "You don't have permission to delete this membership" },
        { status: 403 }
      );
    }

    // Delete card image
    if (membership.cardImage) {
      const fileName = membership.cardImage.split("/").pop();
      if (fileName) {
        await supabase.storage
          .from("business-images")
          .remove([`business-memberships/${fileName}`]);
      }
    }

    await prisma.businessMembership.delete({
      where: { id: membershipId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting membership:", error);
    return NextResponse.json(
      { error: "Failed to delete membership" },
      { status: 500 }
    );
  }
}
