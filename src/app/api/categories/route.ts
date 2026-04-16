import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log('📋 Fetching categories with business counts...');
    
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            businesses: {
              where: {
                status: "PUBLISHED",
                verified: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log('📊 Raw categories data:', categories);

    // Filter categories that have at least one published business
    const activeCategories = categories.map(cat => cat.name);

    console.log('✅ Active categories with businesses:', activeCategories);

    return NextResponse.json({
      success: true,
      categories: activeCategories,
      totalCategories: categories.length,
      activeCategoriesCount: activeCategories.length
    });

  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    
    // Don't expose database errors to clients
    return NextResponse.json(
      { 
        success: false,
        error: "Unable to load categories at the moment"
      }, 
      { status: 500 }
    );
  }
}
