// /api/auth/business-signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "@/lib/bcrypt";

export async function POST(req: Request) {
  try {
    console.log('\n========== BUSINESS SIGNUP REQUEST ==========');
    const body = await req.json();
    console.log('Request body received:', { ...body, password: '[REDACTED]' });
    const {
      businessName,
      name,
      email,
      phone,
      password,
      isBranch = false,
      parentBusinessId = null,
      branchName = null,
    } = body;

    // Validate required fields
    if (!businessName || !name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // If this is a branch, validate branch-specific fields
    if (isBranch && (!parentBusinessId || !branchName)) {
      return NextResponse.json(
        { error: "Branch name and parent business are required for branch registration" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: "Password does not meet security requirements" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { businesses: true }
    });

    // If user exists and this is NOT a branch registration, reject
    if (existingUser && !isBranch) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // If this is a branch registration, verify the user owns the parent business
    if (isBranch && existingUser) {
      const ownsParentBusiness = existingUser.businesses.some(
        (biz) => biz.id === parentBusinessId
      );

      if (!ownsParentBusiness) {
        return NextResponse.json(
          { error: "You don't have permission to add branches to this business" },
          { status: 403 }
        );
      }

      // Check if branch name is unique for this parent business
      const existingBranch = await prisma.business.findFirst({
        where: {
          parentBusinessId,
          branchName: {
            equals: branchName,
            mode: 'insensitive'
          }
        }
      });

      if (existingBranch) {
        return NextResponse.json(
          { error: "A branch with this name already exists for this business" },
          { status: 409 }
        );
      }
    }

    // Check if business name is taken (only for parent businesses)
    if (!isBranch) {
      const existingBusiness = await prisma.business.findFirst({
        where: {
          name: {
            equals: businessName,
            mode: 'insensitive'
          },
          isBranch: false
        }
      });

      if (existingBusiness) {
        return NextResponse.json(
          { error: "Business name is already registered" },
          { status: 409 }
        );
      }
    }

    // Get or create default category
    let defaultCategory = await prisma.category.findFirst({
      where: { slug: 'general' }
    });

    if (!defaultCategory) {
      defaultCategory = await prisma.category.create({
        data: {
          name: 'General',
          slug: 'general',
          description: 'General businesses'
        }
      });
    }

    // Generate slug from business name
    const slug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // If this is a branch and user exists, just create the branch
    if (isBranch && existingUser) {
      const branch = await prisma.business.create({
        data: {
          name: businessName,
          slug: `${slug}-${branchName?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
          email,
          phone,
          ownerId: existingUser.id,
          categoryId: defaultCategory.id,
          city: "Windhoek",
          country: "Namibia",
          status: 'PENDING',
          verified: false,
          services: [],
          isBranch: true,
          branchName,
          parentBusinessId,
        },
      });

      return NextResponse.json({
        message: "Branch added successfully. Please wait for admin approval.",
        business: branch
      }, { status: 201 });
    }

    // Hash password for new user
    console.log('Hashing password for new user...');
    const hashedPassword = await hash(password, 12);

    // Create user and business in a transaction
    console.log('Starting database transaction to create user and business...');
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name: name,
          email,
          phone,
          password: hashedPassword,
          role: 'BUSINESS',
          emailVerified: null,
        },
      });

      // Create business
      const business = await tx.business.create({
        data: {
          name: businessName,
          slug: `${slug}-${Date.now()}`,
          email,
          phone,
          ownerId: user.id,
          categoryId: defaultCategory.id,
          city: "Windhoek",
          country: "Namibia",
          status: 'PENDING',
          verified: false,
          services: [],
          isBranch: false,
          branchName: null,
          parentBusinessId: null,
        },
      });

      return { user, business };
    });
    console.log('✅ User and business created successfully:', { userId: result.user.id, businessId: result.business.id });

    // Send welcome email to business owner
    console.log('\n--- Attempting to send welcome email ---');
    console.log('Email will be sent to:', email);
    console.log('Using API endpoint:', `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/emails/send`);
    try {
      const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/emails/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "welcome",
          businessName: businessName,
          businessOwnerEmail: email,
          businessCategory: "General", // Default category for new signups
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.log('❌ Welcome email API returned error status:', emailResponse.status);
        console.error("Welcome email API error:", errorData);
      } else {
        const successData = await emailResponse.json();
        console.log('✅ Welcome email sent successfully!');
        console.log('Response:', successData);
      }
    } catch (emailError) {
      console.error('❌ Failed to send welcome email - Exception caught:');
      console.error(emailError);
      // Don't fail the signup if email fails
    }

    // Send notification email to marketing team
    console.log('\n--- Attempting to send marketing notification ---');
    console.log('Email will be sent to: marketing@namibiaservices.com');
    try {
      const marketingResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/emails/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "marketing",
          businessName: businessName,
          businessOwnerEmail: email,
          businessCategory: "General",
          businessPhone: phone,
          businessAddress: "Windhoek, Namibia", // Default address
        }),
      });

      if (!marketingResponse.ok) {
        const errorData = await marketingResponse.json();
        console.log('❌ Marketing email API returned error status:', marketingResponse.status);
        console.error("Marketing email API error:", errorData);
      } else {
        const successData = await marketingResponse.json();
        console.log('✅ Marketing notification sent successfully!');
        console.log('Response:', successData);
      }
    } catch (emailError) {
      console.error('❌ Failed to send marketing notification - Exception caught:');
      console.error(emailError);
      // Don't fail the signup if email fails
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = result.user;

    console.log('\n✅ SIGNUP COMPLETED SUCCESSFULLY');
    console.log('========================================\n');

    return NextResponse.json({
      message: "Business account created successfully. Please wait for admin approval.",
      user: userWithoutPassword,
      business: result.business
    }, { status: 201 });

  } catch (err) {
    console.error('\n❌ ========== BUSINESS SIGNUP ERROR ==========');
    console.error('Error details:', err);
    console.error('Error stack:', err instanceof Error ? err.stack : 'No stack trace');
    console.error('============================================\n');
    return NextResponse.json(
      { error: "Unable to create business account" },
      { status: 500 }
    );
  }
}