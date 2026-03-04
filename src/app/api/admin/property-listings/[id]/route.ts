import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import type { NextRequest } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Whitelist allowed fields
    const allowedFields = ["status", "rejectionReason"];
    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    // If status is APPROVED, set approvedBy and approvedAt
    if (updates.status === "APPROVED") {
      updates.approvedBy = session.user.id;
      updates.approvedAt = new Date();
    }

    // Update the property listing
    const updatedListing = await prisma.propertyListing.update({
      where: { id },
      data: updates,
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Revalidate cache
    // Note: If using Next.js data cache, uncomment the line below
    // revalidatePath(`/admin/property-listings`);

    return NextResponse.json({
      success: true,
      data: updatedListing,
    });
  } catch (error) {
    console.error("Error updating property listing:", error);
    return NextResponse.json(
      { error: "Failed to update property listing" },
      { status: 500 }
    );
  }
}
