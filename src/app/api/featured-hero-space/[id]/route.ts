import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

/**
 * PATCH /api/featured-hero-space/[id]
 * Deactivate featured hero space
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { isActive } = await req.json();

    // Get featured space
    const space = await prisma.featuredHeroSpace.findUnique({
      where: { id },
      include: {
        business: {
          include: {
            owner: {
              select: { email: true },
            },
          },
        },
      },
    });

    if (!space) {
      return NextResponse.json(
        { error: 'Featured space not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (space.business.owner.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update space
    const updated = await prisma.featuredHeroSpace.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating featured space:', error);
    return NextResponse.json(
      { error: 'Failed to update featured space' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/featured-hero-space/[id]
 * Delete featured hero space
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Get featured space
    const space = await prisma.featuredHeroSpace.findUnique({
      where: { id },
      include: {
        business: {
          include: {
            owner: {
              select: { email: true },
            },
          },
        },
      },
    });

    if (!space) {
      return NextResponse.json(
        { error: 'Featured space not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (space.business.owner.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete space
    await prisma.featuredHeroSpace.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Featured space deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting featured space:', error);
    return NextResponse.json(
      { error: 'Failed to delete featured space' },
      { status: 500 }
    );
  }
}
