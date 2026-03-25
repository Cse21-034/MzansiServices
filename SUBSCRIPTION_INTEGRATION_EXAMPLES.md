/**
 * Example Integration: Using Subscription Access in API Routes
 * This file shows how to integrate subscription checks into your existing endpoints
 */

// ============================================================
// EXAMPLE 1: Photo Upload Route with Subscription Check
// ============================================================

/*
Location: src/app/api/business/[businessId]/photos/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { enforceLimit } from '@/middleware/subscription-access';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Extract businessId from URL
    const url = new URL(request.url);
    const businessId = url.pathname.split('/')[3];

    // Verify ownership
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { owner: { select: { email: true } } },
    });

    if (!business || business.owner.email !== session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // CHECK SUBSCRIPTION LIMIT
    const limitCheck = await enforceLimit(businessId, 'photos', request);
    if (limitCheck) return limitCheck;
    // If we reach here, subscription allows the upload

    // ... rest of photo upload logic ...
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Upload file to storage
    const url = await uploadToSupabase(file);

    // Save to database
    const photo = await prisma.businessPhoto.create({
      data: {
        businessId,
        url,
        isPrimary: false,
      },
    });

    return NextResponse.json({ success: true, photo });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Upload failed' },
      { status: 500 }
    );
  }
}
*/

// ============================================================
// EXAMPLE 2: Create Promotion with Subscription Check
// ============================================================

/*
Location: src/app/api/business/[businessId]/promotions/create/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { enforceLimit } from '@/middleware/subscription-access';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { businessId, title, description, discount, expiryDate } = 
      await request.json();

    // Verify ownership
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { owner: { select: { email: true } } },
    });

    if (!business || business.owner.email !== session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // CHECK SUBSCRIPTION LIMIT FOR PROMOTIONS
    const limitCheck = await enforceLimit(businessId, 'promotions', request);
    if (limitCheck) return limitCheck;
    // If we reach here, business can create more promotions

    // ... validate input ...
    if (!title || !discount) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create promotion
    const promotion = await prisma.promotion.create({
      data: {
        businessId,
        title,
        description,
        discount: parseInt(discount),
        expiryDate: new Date(expiryDate),
      },
    });

    return NextResponse.json({ success: true, promotion });
  } catch (error) {
    console.error('Promotion creation error:', error);
    return NextResponse.json(
      { message: 'Creation failed' },
      { status: 500 }
    );
  }
}
*/

// ============================================================
// EXAMPLE 3: Add Branch with Subscription Check
// ============================================================

/*
Location: src/app/api/business/[businessId]/branches/create/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { enforceLimit } from '@/middleware/subscription-access';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { parentBusinessId, branchName, email, phone, city } = 
      await request.json();

    // Verify ownership
    const parentBusiness = await prisma.business.findUnique({
      where: { id: parentBusinessId },
      include: { owner: { select: { id: true, email: true } } },
    });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!parentBusiness || parentBusiness.owner.id !== user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // CHECK SUBSCRIPTION LIMIT FOR BRANCHES
    const limitCheck = await enforceLimit(parentBusinessId, 'branches', request);
    if (limitCheck) return limitCheck;
    // If we reach here, business can add more branches

    // ... validate input ...
    // Create branch
    const branch = await prisma.business.create({
      data: {
        parentBusinessId,
        isBranch: true,
        branchName,
        name: parentBusiness.name + ' - ' + branchName,
        slug: `${parentBusiness.slug}-${branchName.toLowerCase().replace(/\s+/g, '-')}`,
        email,
        phone,
        city,
        categoryId: parentBusiness.categoryId,
        ownerId: parentBusiness.ownerId,
      },
    });

    return NextResponse.json({ success: true, branch });
  } catch (error) {
    console.error('Branch creation error:', error);
    return NextResponse.json(
      { message: 'Creation failed' },
      { status: 500 }
    );
  }
}
*/

// ============================================================
// EXAMPLE 4: Feature Availability Check in Frontend
// ============================================================

/*
Component: src/app/business/[businessId]/features-showcase.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { hasFeature, getSubscriptionStatus, getTierInfo } from '@/lib/subscription-access';

export function FeaturesShowcase({ businessId }: { businessId: string }) {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, [businessId]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch(`/api/subscriptions/status?businessId=${businessId}`);
      const data = await response.json();
      if (data.success) {
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const tier = subscription?.tier;
  const tierInfo = getTierInfo(tier);

  return (
    <div className="grid gap-4">
      {/* Video Introduction Feature */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Video Introduction</h3>
        {hasFeature(tier, 'videoIntro') ? (
          <div>
            <p className="text-green-600 mb-2">✓ Available in your plan</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Add Video
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Available in {getTierInfo(tier).name === 'WILD HORSES' ? 'DESERT LIONS' : 'higher'} plan
            </p>
            <button className="bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed">
              Upgrade Required
            </button>
          </div>
        )}
      </div>

      {/* WhatsApp Chatbot Feature */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">WhatsApp Chatbot</h3>
        {hasFeature(tier, 'whatsappChatbot') ? (
          <div>
            <p className="text-green-600 mb-2">✓ Available in your plan</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Configure Bot
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Included in DESERT LIONS Premium plan (P200/month)
            </p>
          </div>
        )}
      </div>

      {/* Photo Gallery Feature */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">
          Photo Gallery ({tierInfo.limits.photos} max)
        </h3>
        {hasFeature(tier, 'expandedGallery') ? (
          <p className="text-green-600">
            ✓ Expanded gallery with unlimited photos
          </p>
        ) : (
          <p className="text-gray-600">
            Your current plan allows {tierInfo.limits.photos} photos
          </p>
        )}
      </div>
    </div>
  );
}
*/

// ============================================================
// EXAMPLE 5: Upgrade Prompt Component
// ============================================================

/*
Component: src/components/UpgradePrompt.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { getTierInfo } from '@/lib/subscription-access';

interface UpgradePromptProps {
  businessId: string;
  currentTier: string | null;
  requiredTier: string;
  feature: string;
}

export function UpgradePrompt({
  businessId,
  currentTier,
  requiredTier,
  feature,
}: UpgradePromptProps) {
  const requiredTierInfo = getTierInfo(requiredTier as any);

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-blue-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.312-.257.644-.059.966.198.323.595.944 1.553 1.901.928.93 1.577 1.356 1.9 1.554.322.198.654.155.966-.059.32-.208.65-.477.88-.822.196-.29.3-.593.385-1.45A6.965 6.965 0 0012.395 2.553zM12.697 6.72c-.684-.264-1.228-.889-2.04-1.701-.81-.81-1.437-1.356-1.701-2.04 6.842 1.053 10.462 7.223 12.828 11.128.359.632.564 1.149.885 1.562.321.413.779.58 1.2.58.42 0 .879-.167 1.2-.58.32-.413.526-.93.884-1.562C19.098 9.887 15.477 3.773 12.697 6.72zM12.773 8.275a.75.75 0 10-1.06-1.06L8.55 10.439a.75.75 0 001.06 1.06L12.773 8.275z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            <strong>{feature}</strong> is available in the{' '}
            <strong>{requiredTierInfo.name}</strong> plan.
          </p>
          <Link
            href={`/business/${businessId}/subscription/plans`}
            className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  );
}
*/

// ============================================================
// INTEGRATION CHECKLIST
// ============================================================

/*
Before using subscription features in your app:

1. DATABASE
   - [ ] Run: npx prisma migrate dev --name add_subscription_system
   - [ ] Run: npx prisma db push
   - [ ] Seed plans: npx ts-node scripts/seed-subscriptions.ts

2. ENVIRONMENT
   - [ ] Add PAYGATE_MERCHANT_ID to .env.local
   - [ ] Add PAYGATE_MERCHANT_KEY to .env.local
   - [ ] Add PAYGATE_API_KEY to .env.local
   - [ ] Set PAYGATE_ENV=test (for testing)

3. EXISTING ROUTES
   - [ ] Add enforceLimit() check to photo upload endpoint
   - [ ] Add enforceLimit() check to promotion creation endpoint
   - [ ] Add enforceLimit() check to branch creation endpoint

4. FRONTEND
   - [ ] Import hasFeature() in business feature pages
   - [ ] Add UpgradePrompt component where needed
   - [ ] Update dashboard to show current subscription

5. TESTING
   - [ ] Test free plan signup (WILD_HORSES)
   - [ ] Test paid plan checkout (DESERT_ELEPHANTS or DESERT_LIONS)
   - [ ] Test PayGate callback processing
   - [ ] Test feature limits enforcement
   - [ ] Test subscription cancellation

6. PRODUCTION
   - [ ] Switch PAYGATE_ENV to production
   - [ ] Get production API keys from PayGate
   - [ ] Update PayGate webhook URLs to production domain
   - [ ] Test with real payment on staging first
   - [ ] Monitor payment callbacks in production
*/
