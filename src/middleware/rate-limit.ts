import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiLimiter } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
  // Get the client's IP address
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
  
  // Check if this is an API route
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const isLimited = await apiLimiter.isRateLimited(`${ip}:${request.nextUrl.pathname}`);
    
    if (isLimited) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  // Allow public access to admin creation page
  if (request.nextUrl.pathname === "/solidacare/data/add/admin") {
    // Uncomment below to block in production:
    // return new NextResponse("Not allowed", { status: 403 });
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
