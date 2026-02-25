import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        bio: true,
        location: true,
        website: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PROFILE_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, bio, location, website } = body;

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (name.length > 100) {
      return NextResponse.json({ error: "Name must be less than 100 characters" }, { status: 400 });
    }

    if (bio && bio.length > 500) {
      return NextResponse.json({ error: "Bio must be less than 500 characters" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
        bio: bio?.trim() || null,
        location: location?.trim() || null,
        website: website?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        bio: true,
        location: true,
        website: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PROFILE_PUT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
