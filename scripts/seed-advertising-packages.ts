/**
 * Seed advertising packages
 * Run: npx ts-node scripts/seed-advertising-packages.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const advertisingPackages = [
  {
    packageId: 'advert1',
    name: 'Advert 1',
    description: 'Small landscape banner - Static display',
    monthlyPrice: 250,
    yearlyPrice: 2700, // 10% discount
    placement: 'homepage',
    maxUploadSize: 5242880, // 5MB
    adDuration: 30,
    features: [
      'Small landscape banner (300x100px)',
      'Static display',
      '30-day campaign duration',
      'Homepage placement',
      'Click tracking enabled',
    ],
    displayOrder: 1,
  },
  {
    packageId: 'advert2',
    name: 'Advert 2',
    description: 'Portrait banner - 4-second slideshow',
    monthlyPrice: 550,
    yearlyPrice: 5940, // 10% discount
    placement: 'homepage',
    maxUploadSize: 5242880,
    adDuration: 30,
    features: [
      'Portrait banner (250x400px)',
      '4-second slideshow rotation',
      '30-day campaign duration',
      'Homepage placement',
      'Click tracking enabled',
      'Up to 3 images included',
    ],
    displayOrder: 2,
  },
  {
    packageId: 'advert3',
    name: 'Advert 3',
    description: 'Large landscape banner - 7-second rotation',
    monthlyPrice: 1000,
    yearlyPrice: 10800, // 10% discount
    placement: 'homepage',
    maxUploadSize: 10485760, // 10MB
    adDuration: 30,
    features: [
      'Large landscape banner (728x300px)',
      '7-second slideshow rotation',
      '30-day campaign duration',
      'Homepage placement',
      'Click tracking enabled',
      'Up to 5 images included',
    ],
    displayOrder: 3,
  },
  {
    packageId: 'advert4',
    name: 'Advert 4',
    description: 'Premium featured placement - Top position',
    monthlyPrice: 1500,
    yearlyPrice: 16200, // 10% discount
    placement: 'featured',
    maxUploadSize: 10485760,
    adDuration: 30,
    features: [
      'Large landscape banner (728x300px)',
      'Top category placement',
      'Premium featured position',
      '15-second slideshow rotation',
      '30-day campaign duration',
      'Click tracking enabled',
      'Up to 8 images included',
      'Priority support',
    ],
    displayOrder: 4,
  },
  {
    packageId: 'advert5',
    name: 'Advert 5',
    description: 'Extra large landscape - Maximum visibility',
    monthlyPrice: 2000,
    yearlyPrice: 21600, // 10% discount
    placement: 'homepage',
    maxUploadSize: 15728640, // 15MB
    adDuration: 30,
    features: [
      'Extra large landscape banner (1024x400px)',
      '15-second slideshow rotation',
      '30-day campaign duration',
      'Homepage featured section',
      'Click tracking enabled',
      'Up to 10 images included',
      'Priority support',
      'Monthly performance report',
    ],
    displayOrder: 5,
  },
  {
    packageId: 'promotions',
    name: 'Promotions',
    description: 'Promotional campaigns - Maximum exposure',
    monthlyPrice: 2500,
    yearlyPrice: 27000, // 10% discount
    placement: 'featured',
    maxUploadSize: 20971520, // 20MB
    adDuration: 30,
    features: [
      'Multiple banner placements',
      'Premium featured section',
      'Video support (up to 30MB)',
      '20-second slideshow rotation',
      '30-day campaign duration',
      'Click tracking enabled',
      'Up to 15 images/videos',
      'Priority support',
      'Weekly performance reports',
      'Dedicated account manager',
    ],
    displayOrder: 6,
  },
];

async function main() {
  console.log('🌱 Seeding advertisement packages...');

  for (const pkg of advertisingPackages) {
    try {
      const existing = await prisma.advertisementPackage.findUnique({
        where: { packageId: pkg.packageId },
      });

      if (existing) {
        // Update if it already exists
        await prisma.advertisementPackage.update({
          where: { packageId: pkg.packageId },
          data: pkg,
        });
        console.log(`✅ Updated: ${pkg.name}`);
      } else {
        // Create if it doesn't exist
        await prisma.advertisementPackage.create({
          data: pkg,
        });
        console.log(`✅ Created: ${pkg.name}`);
      }
    } catch (error) {
      console.error(`❌ Error with ${pkg.name}:`, error);
    }
  }

  console.log('✨ Done seeding advertisement packages!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
