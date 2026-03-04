import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;
    const city = searchParams.get("city");
    const search = searchParams.get("search");

    // Build where clause
    interface WhereClause {
      status: string;
      city?: { contains: string; mode: string };
      OR?: Array<{
        title?: { contains: string; mode: string };
        description?: { contains: string; mode: string };
      }>;
    }

    const where: WhereClause = {
      status: "APPROVED", // Only approved listings
    };

    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          business: {
            select: {
              id: true,
              name: true,
              slug: true,
              email: true,
              phone: true,
              location: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
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
