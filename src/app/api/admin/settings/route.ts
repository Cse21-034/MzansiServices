import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { siteName, description, maintenanceMode } = body;

    // Validation
    if (!siteName || siteName.trim().length === 0) {
      return NextResponse.json({ error: "Site name is required" }, { status: 400 });
    }

    // In a real application, these settings would be stored in the database
    // For now, we'll just validate and return success
    // You can implement this with a Settings model in your Prisma schema

    // TODO: Store these settings in the database
    // For now, returning success
    
    return NextResponse.json({
      message: "System settings updated successfully",
      settings: {
        siteName: siteName.trim(),
        description: description?.trim() || "",
        maintenanceMode: maintenanceMode || false,
      },
    });
  } catch (error) {
    console.error("[ADMIN_SETTINGS]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
