import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import type { NextRequest } from 'next/server';
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const id = params.id;
  const body = await req.json();
  // Allow updating status, verified, featured, etc.
  const allowed = ['status', 'verified', 'featured', 'name', 'description', 'categoryId', 'location', 'phone', 'email'];
  const data = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
  const business = await prisma.business.update({
    where: { id },
    data
  });
  
  // Invalidate cache for updated business
  revalidatePath('/');
  revalidatePath('/listings');
  revalidatePath('/namibiaservices');
  
  return NextResponse.json({ business });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const id = params.id;
  
  // Get business before deleting to get the slug
  const business = await prisma.business.findUnique({
    where: { id },
    select: { slug: true }
  });
  
  await prisma.business.delete({ where: { id } });
  
  // Invalidate cache for deleted business on multiple paths
  revalidatePath('/');
  revalidatePath('/listings');
  revalidatePath('/namibiaservices');
  if (business?.slug) {
    revalidatePath(`/listing-stay-detail/${business.slug}`);
  }
  
  return NextResponse.json({ success: true });
}
