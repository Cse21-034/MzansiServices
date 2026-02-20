import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { geocodeAddress, getDefaultCoordinates } from "@/utils/geocoding";

/**
 * Sanitize address to remove [object Object] and other invalid values
 */
function sanitizeAddress(address: any): string {
  if (!address) return '';
  
  // If it's an object, try to extract value or label
  if (typeof address === 'object') {
    if ('value' in address && typeof address.value === 'string') {
      return address.value.trim();
    }
    if ('label' in address && typeof address.label === 'string') {
      return address.label.trim();
    }
    return '';
  }
  
  // If it's a string, clean it
  const str = String(address).trim();
  
  // Remove [object Object] strings
  return str
    .replace(/\[object Object\]/g, '')
    .replace(/,\s*,/g, ',') // Remove double commas
    .replace(/,\s*$/g, '') // Remove trailing comma
    .split(',')
    .map(part => part.trim())
    .filter(part => part.length > 0)
    .join(', ');
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "BUSINESS") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      include: {
        photos: {
          orderBy: { createdAt: "desc" }
        },
        category: true,
        subcategory: true,
        businessHours: true
      }
    });

    if (!business) {
      return NextResponse.json({ error: "Business profile not found" }, { status: 404 });
    }

    return NextResponse.json(business);
  } catch (error) {
    console.error('Fetch business error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "BUSINESS") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log('PUT request body:', JSON.stringify(body, null, 2));

    const {
      name,
      category,
      subcategory,
      description,
      phone,
      email,
      website,
      address,
      city,
      country,
      establishedYear,
      employees,
      businessHours,
      services,
      latitude,
      longitude
    } = body;

    console.log('Extracted businessHours:', businessHours);
    console.log('Extracted services:', services);

    // Validate required fields
    if (!name || !category?.name || !description || !phone || !email || !address) {
      return NextResponse.json(
        { error: "Missing required fields: name, category, description, phone, email, and address are required" },
        { status: 400 }
      );
    }

    // Sanitize the address to remove any [object Object] or invalid values
    const sanitizedAddress = sanitizeAddress(address);
    
    if (!sanitizedAddress || sanitizedAddress.trim().length === 0) {
      return NextResponse.json(
        { error: "Address must be a valid string" },
        { status: 400 }
      );
    }

    // Geocode address to get coordinates if not provided
    let finalLatitude: number | null = null;
    let finalLongitude: number | null = null;

    if (latitude && longitude) {
      // Use provided coordinates
      finalLatitude = parseFloat(String(latitude));
      finalLongitude = parseFloat(String(longitude));
    } else {
      // Geocode the address to get coordinates
      const finalCity = city || "Windhoek";
      const geocoded = await geocodeAddress(sanitizedAddress, finalCity);
      
      if (geocoded) {
        finalLatitude = geocoded.latitude;
        finalLongitude = geocoded.longitude;
        console.log(`✅ Geocoded successfully: ${sanitizedAddress} -> ${finalLatitude}, ${finalLongitude}`);
      } else {
        // Fallback to city-level coordinates
        const defaultCoords = getDefaultCoordinates(finalCity);
        finalLatitude = defaultCoords.latitude;
        finalLongitude = defaultCoords.longitude;
        console.log(`⚠️ Using city fallback for ${finalCity}: ${finalLatitude}, ${finalLongitude}`);
      }
    }

    // Find or create category
    let categoryRecord = await prisma.category.findFirst({
      where: {
        name: category.name,
        parentId: null // Ensure it's a main category
      }
    });

    if (!categoryRecord) {
      const categorySlug = category.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      categoryRecord = await prisma.category.create({
        data: {
          name: category.name,
          slug: categorySlug || 'category',
        }
      });
    }

    let subCategoryRecord = null;
    if (subcategory?.name) {
      subCategoryRecord = await prisma.category.findFirst({
        where: {
          name: subcategory.name,
          parentId: categoryRecord.id
        }
      });

      if (!subCategoryRecord) {
        const subSlug = subcategory.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        subCategoryRecord = await prisma.category.create({
          data: {
            name: subcategory.name,
            slug: subSlug || 'subcategory',
            parentId: categoryRecord.id
          }
        });
      }
    }

    // Check if business exists, create if not
    let business = await prisma.business.findFirst({
      where: { ownerId: session.user.id }
    });

    const businessData: any = {
      name,
      categoryId: categoryRecord.id,
      description,
      phone,
      email,
      website,
      address: sanitizedAddress, // Use sanitized address
      city: city || "Windhoek", // Update city field
      country: country || "Namibia", // Update country field
      latitude: finalLatitude, // Save geocoded latitude
      longitude: finalLongitude, // Save geocoded longitude
      establishedYear: establishedYear ? parseInt(establishedYear) : null,
      employees,
      services: body.services || [],
    };

    // Handle subcategoryId - set to value if exists, otherwise set to null to clear it
    if (subCategoryRecord?.id) {
      businessData.subCategoryId = subCategoryRecord.id;
    } else {
      businessData.subCategoryId = null;
    }

    if (business) {
      // Update existing business
      business = await prisma.business.update({
        where: { id: business.id },
        data: {
          ...businessData,
          updatedAt: new Date()
        },
        include: {
          photos: {
            orderBy: { createdAt: "desc" }
          },
          category: true,
          subcategory: true,
          businessHours: true
        }
      });

      // Update business hours separately (delete old ones and create new ones)
      try {
        if (businessHours && Array.isArray(businessHours)) {
          // Delete existing hours
          await prisma.businessHours.deleteMany({
            where: { businessId: business.id }
          });

          // Create new hours
          for (const hours of businessHours) {
            if (typeof hours.dayOfWeek === 'number') {
              await prisma.businessHours.create({
                data: {
                  businessId: business.id,
                  dayOfWeek: hours.dayOfWeek,
                  openTime: (hours.openTime && hours.openTime.trim()) ? hours.openTime : null,
                  closeTime: (hours.closeTime && hours.closeTime.trim()) ? hours.closeTime : null,
                  isClosed: Boolean(hours.isClosed)
                }
              });
            }
          }
        }
      } catch (hoursError) {
        console.error('Error updating business hours:', hoursError);
        // Continue anyway - the main business update succeeded
      }
    } else {
      // Create new business
      business = await prisma.business.create({
        data: {
          ...businessData,
          ownerId: session.user.id,
          status: "DRAFT",
          slug: name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7),
          city: city || "Windhoek", // Default city
          country: country || "Namibia",
          latitude: finalLatitude, // Add latitude for new business
          longitude: finalLongitude // Add longitude for new business
        },
        include: {
          photos: {
            orderBy: { createdAt: "desc" }
          },
          category: true,
          subcategory: true,
          businessHours: true
        }
      });

      // Send welcome email to business owner
      try {
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/emails/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "welcome",
            businessName: name,
            businessOwnerEmail: email,
            businessCategory: category?.name,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail the request if email fails
      }

      // Send notification email to marketing team
      try {
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/emails/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "marketing",
            businessName: name,
            businessOwnerEmail: email,
            businessCategory: category?.name,
            businessPhone: phone,
            businessAddress: address,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send marketing notification:", emailError);
        // Don't fail the request if email fails
      }

      // Create business hours for new business
      try {
        if (businessHours && Array.isArray(businessHours)) {
          for (const hours of businessHours) {
            if (typeof hours.dayOfWeek === 'number') {
              await prisma.businessHours.create({
                data: {
                  businessId: business.id,
                  dayOfWeek: hours.dayOfWeek,
                  openTime: (hours.openTime && hours.openTime.trim()) ? hours.openTime : null,
                  closeTime: (hours.closeTime && hours.closeTime.trim()) ? hours.closeTime : null,
                  isClosed: Boolean(hours.isClosed)
                }
              });
            }
          }
        }
      } catch (hoursError) {
        console.error('Error creating business hours:', hoursError);
        // Continue anyway - the main business creation succeeded
      }
    }

    // Fetch updated business with all relations to return complete data
    const updatedBusiness = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      include: {
        photos: {
          orderBy: { createdAt: "desc" }
        },
        category: true,
        subcategory: true,
        businessHours: true
      }
    });

    if (!updatedBusiness) {
      throw new Error('Failed to fetch updated business data');
    }

    return NextResponse.json(updatedBusiness);
  } catch (error) {
    console.error('Update business error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Internal server error" },
      { status: 500 }
    );
  }
}
