import { NextRequest, NextResponse } from "next/server";
import { getMonthlyPromotionStats } from "@/lib/subscription-access";

export const dynamic = 'force-dynamic';

/**
 * GET /api/promotions/monthly-stats?businessId=xxx
 * Get monthly promotion usage stats for a business
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "Missing businessId parameter" },
        { status: 400 }
      );
    }

    const stats = await getMonthlyPromotionStats(businessId);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly promotion stats" },
      { status: 500 }
    );
  }
}
