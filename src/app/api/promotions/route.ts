import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canCreatePromotion } from "@/lib/subscription-access";

export async function GET(req: NextRequest) {
  try {
    const promotions = await prisma.promotion.findMany({
      include: {
        business: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(promotions);
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, discount, expiryDate, image, userEmail, businessId } = body;

    if (!title || !description || !discount || !expiryDate || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        businesses: true,
      },
    });

    if (!user || !user.businesses || user.businesses.length === 0) {
      return NextResponse.json(
        { error: "User or business not found" },
        { status: 404 }
      );
    }

    // Use provided businessId or first business
    const finalBusinessId = businessId || user.businesses[0].id;

    // Verify ownership
    const businessOwnership = user.businesses.find(b => b.id === finalBusinessId);
    if (!businessOwnership) {
      return NextResponse.json(
        { error: "Unauthorized: Business not owned by user" },
        { status: 403 }
      );
    }

    // ✅ CHECK SUBSCRIPTION LIMITS BEFORE CREATING PROMOTION
    const promotionCheck = await canCreatePromotion(finalBusinessId);
    
    if (!promotionCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: promotionCheck.reason,
          limit: promotionCheck.limit,
          current: promotionCheck.current,
          period: promotionCheck.period,
        },
        { status: 403 }
      );
    }

    // ✅ CREATE PROMOTION (limit checked)
    const newPromotion = await prisma.promotion.create({
      data: {
        title,
        description,
        discount,
        image: image || null,
        expiryDate: new Date(expiryDate),
        businessId: finalBusinessId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newPromotion,
        remainingThisMonth: promotionCheck.limit! - (promotionCheck.current! + 1),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating promotion:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
