import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET - Fetch all memberships by status (admin only)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "PENDING";

    // Fetch from the new BusinessMembership model
    const businessMemberships = await prisma.businessMembership.findMany({
      where: {
        status: status as any,
      },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            city: true,
            owner: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });

    // Transform to match expected format
    const memberships = businessMemberships.map((m) => ({
      id: m.id,
      name: m.business.name,
      email: m.business.email,
      phone: m.business.phone,
      city: m.business.city,
      membershipCardImage: m.cardImage,
      membershipNumber: m.membershipNumber,
      membershipStatus: m.status,
      membershipType: m.membershipType,
      membershipExpiryDate: m.expiryDate,
      membershipProvider: m.issuerName,
      membershipUploadedAt: m.uploadedAt,
      owner: m.business.owner,
      businessId: m.businessId,
      membershipId: m.id,
    }));

    return NextResponse.json({ memberships });
  } catch (error) {
    console.error("Error fetching memberships:", error);
    return NextResponse.json(
      { error: "Failed to fetch memberships" },
      { status: 500 }
    );
  }
}

// PUT - Approve or reject membership (admin only)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, membershipId, status, notes } = await req.json();

    // Support both membershipId (new system) and businessId (old system)
    const id = membershipId || businessId;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Membership ID and status are required" },
        { status: 400 }
      );
    }

    if (!["ACTIVE", "REJECTED", "EXPIRED", "PENDING", "NONE"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Try to update BusinessMembership first (new system)
    if (membershipId) {
      const updatedMembership = await prisma.businessMembership.update({
        where: { id: membershipId },
        data: { status: status as any },
        include: {
          business: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return NextResponse.json({
        id: updatedMembership.id,
        name: updatedMembership.business.name,
        membershipStatus: updatedMembership.status,
      });
    }

    // Fall back to updating Business model (old system) if only businessId provided
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: {
        membershipStatus: status,
      },
      select: {
        id: true,
        name: true,
        membershipStatus: true,
        membershipCardImage: true,
        membershipNumber: true,
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
