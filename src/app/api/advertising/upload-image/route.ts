/**
 * POST /api/advertising/upload-image
 * Upload advertising image to Supabase Storage
 * 
 * Form data:
 * - file: File (image to upload)
 * - businessId: string
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const initSupabaseAdmin = async () => {
  const { createClient } = await import('@supabase/supabase-js');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(url, key);
};

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get session with error handling
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (sessionError) {
      console.error('[UploadImage] Session error:', sessionError);
      return NextResponse.json(
        { error: 'Session processing error' },
        { status: 401 }
      );
    }

    if (!session?.user?.email) {
      console.log('[UploadImage] No authenticated session');
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }

    console.log('[UploadImage] Authenticated:', session.user.email);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const businessId = formData.get('businessId') as string;

    if (!file || !businessId) {
      return NextResponse.json(
        { error: 'Missing file or businessId' },
        { status: 400 }
      );
    }

    // Verify business ownership
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        owner: { select: { email: true } },
      },
    });

    if (!business || business.owner.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized: Not the business owner' },
        { status: 403 }
      );
    }

    // Validate file size (15MB max for ads)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size must be under ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be a valid image' },
        { status: 400 }
      );
    }

    // Initialize Supabase admin client
    const supabaseAdmin = await initSupabaseAdmin();

    // Generate unique file name
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `advertising/${businessId}/${timestamp}-${randomString}.${fileExtension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase
    const { data, error } = await supabaseAdmin.storage
      .from('business-images')
      .upload(fileName, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('business-images')
      .getPublicUrl(fileName);

    if (!publicUrlData.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return NextResponse.json({
      success: true,
      imageUrl: publicUrlData.publicUrl,
      fileName,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: `Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
