import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('🔍 Fetching businesses with params:', { category, search, location, limit, offset });

    // Build where clause for filtering
    const where: any = {
      status: "PUBLISHED",
      verified: true,
    };

    // Handle search parameter
    if (search && search.trim() !== "") {
      const searchTerm = search.trim();
      where.OR = [
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          // For services array, check if any service contains the search term
          services: {
            hasSome: [searchTerm]
          }
        },
        {
          category: {
            name: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        }
      ];
    }

    // Handle location parameter - ADD this section
    if (location && location.trim() !== "" && location !== "Current Location") {
      const locationTerm = location.trim();
      
      // If we already have conditions, we need to combine them properly
      if (where.OR) {
        // We have search conditions, so we need to combine with AND
        where.AND = [
          { OR: where.OR },
          {
            OR: [
              {
                city: {
                  contains: locationTerm,
                  mode: 'insensitive'
                }
              },
              {
                address: {
                  contains: locationTerm,
                  mode: 'insensitive'
                }
              }
            ]
          }
        ];
        delete where.OR;
      } else {
        // No search, just location filter
        where.OR = [
          {
            city: {
              contains: locationTerm,
              mode: 'insensitive'
            }
          },
          {
            address: {
              contains: locationTerm,
              mode: 'insensitive'
            }
          }
        ];
      }
    }

    // Handle category parameter
    if (category && category !== "All") {
      const categoryCondition = {
        OR: [
          {
            category: {
              name: {
                contains: category,
                mode: 'insensitive'
              }
            }
          },
          {
            services: {
              has: category
            }
          }
        ]
      };

      if (where.AND) {
        where.AND.push(categoryCondition);
      } else if (where.OR) {
        where.AND = [{ OR: where.OR }, categoryCondition];
        delete where.OR;
      } else {
        where.OR = categoryCondition.OR;
      }
    }

    console.log('📊 Final WHERE clause:', JSON.stringify(where, null, 2));

    // Fetch businesses with related data
    const businesses = await prisma.business.findMany({
      where,
      include: {
        category: true,
        photos: {
          take: 5,
          orderBy: { isPrimary: 'desc' }
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        businessHours: true,
      },
      orderBy: [
        { featured: 'desc' },
        { viewCount: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: offset,
      take: limit,
    });

    console.log(`✅ Found ${businesses.length} businesses`);

    // Get total count for pagination
    const totalCount = await prisma.business.count({ where });

    return NextResponse.json({
      success: true,
      businesses,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      },
    });

  } catch (error) {
    console.error('❌ Error fetching businesses:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Unable to load businesses at the moment"
      }, 
      { status: 500 }
    );
  }
}