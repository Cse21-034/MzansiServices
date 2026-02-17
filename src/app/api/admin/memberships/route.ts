import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET - Fetch all pending memberships (admin only)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "PENDING";

    const memberships = await prisma.business.findMany({
      where: {
        membershipStatus: status as any,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        membershipCardImage: true,
        membershipNumber: true,
        membershipStatus: true,
        membershipType: true,
        membershipExpiryDate: true,
        membershipProvider: true,
        membershipUploadedAt: true,
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        membershipUploadedAt: "desc",
      },
    });

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

    const { businessId, status, notes } = await req.json();

    if (!businessId || !status) {
      return NextResponse.json(
        { error: "Business ID and status are required" },
        { status: 400 }
      );
    }

    if (!["ACTIVE", "REJECTED", "EXPIRED", "PENDING", "NONE"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

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
