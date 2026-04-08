import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { geocodeWithFallback } from "@/utils/geocoding";

export const dynamic = 'force-dynamic';

/**
 * Admin endpoint to geocode all businesses that don't have coordinates
 * GET /api/admin/geocode-businesses
 */
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Only admins can run this
        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find all businesses without coordinates
        const businesses = await prisma.business.findMany({
            where: {
                OR: [
                    { latitude: null },
                    { longitude: null },
                    { latitude: 0 },
                    { longitude: 0 }
                ]
            },
            select: {
                id: true,
                name: true,
                address: true,
                city: true,
                branchName: true,
                isBranch: true
            }
        });

        console.log(`📍 Found ${businesses.length} businesses to geocode`);

        const results = {
            total: businesses.length,
            geocoded: 0,
            failed: [] as string[],
            updated: [] as any[]
        };

        // Geocode each business
        for (const business of businesses) {
            try {
                if (!business.city || !business.address) {
                    results.failed.push(`${business.name}: Missing city or address`);
                    continue;
                }

                // Get coordinates
                const coords = await geocodeWithFallback(business.address, business.city);

                // Update business
                await prisma.business.update({
                    where: { id: business.id },
                    data: {
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    }
                });

                results.geocoded++;
                results.updated.push({
                    name: business.name,
                    branchName: business.branchName,
                    city: business.city,
                    ...coords
                });

                console.log(`✅ Geocoded: ${business.name}${business.branchName ? ` - ${business.branchName}` : ''}`);

                // Add delay to avoid rate limiting (1 request per second)
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`❌ Failed to geocode ${business.name}:`, error);
                results.failed.push(`${business.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Geocoded ${results.geocoded} out of ${results.total} businesses`,
            results
        });

    } catch (error) {
        console.error('Geocoding error:', error);
        return NextResponse.json(
            { error: "Failed to geocode businesses" },
            { status: 500 }
        );
    }
}
