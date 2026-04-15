/**
 * GET /api/advertising/packages
 * Get all available advertisement packages
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const packages = await prisma.advertisementPackage.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: packages,
    });
  } catch (error) {
    console.error('Error fetching advertisement packages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}
