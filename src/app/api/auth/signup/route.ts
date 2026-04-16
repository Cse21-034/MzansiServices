// /api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "@/lib/bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, phone } = body;
    
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashed = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone: phone || null,
        password: hashed,
        role: 'USER', // Explicitly set role
      },
      select: { 
        id: true, 
        email: true, 
        name: true, 
        role: true,
        phone: true 
      },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to create user" }, { status: 500 });
  }
}
