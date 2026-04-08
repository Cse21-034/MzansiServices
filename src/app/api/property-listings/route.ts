import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;
    const city = searchParams.get("city");
    const search = searchParams.get("search");

    // Build where clause - using any to avoid Prisma type conflicts
    const where: any = {
      status: "APPROVED", // Only approved
    };

    if (city) {
      where.city = { contains: city, mode: "insensitive" as any };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" as any } },
        { description: { contains: search, mode: "insensitive" as any } },
      ];
    }

    const [listings, total] = await Promise.all([
      prisma.propertyListing.findMany({
        where,
        include: {
          business: {
            select: {
              id: true,
              name: true,
              slug: true,
              email: true,
              phone: true,
              city: true,
              address: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.propertyListing.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: listings,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching property listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch property listings" },
      { status: 500 }
    );
  }
}
