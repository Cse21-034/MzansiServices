import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get counts for each main category (including branches)
    const categoryCounts = await prisma.business.groupBy({
      by: ['categoryId'],
      where: {
        status: "PUBLISHED",
        verified: true,
      },
      _count: {
        id: true,
      },
    });

    console.log('📊 Category counts from DB:', categoryCounts);

    // Get category names
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryCounts.map(item => item.categoryId)
        }
      },
      select: {
        id: true,
        name: true,
      }
    });

    console.log('📂 Categories found:', categories);

    // Create mapping of category names to counts
    const countsMap: { [key: string]: number } = {};
    categoryCounts.forEach(item => {
      const category = categories.find(cat => cat.id === item.categoryId);
      if (category) {
        countsMap[category.name] = item._count.id;
      }
    });

    console.log('✅ Final counts map:', countsMap);

    return NextResponse.json({
      success: true,
      categoryCounts: countsMap,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });

  } catch (error) {
    console.error('Error fetching category counts:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to load category counts"
      },
      { status: 500 }
    );
  }
}
