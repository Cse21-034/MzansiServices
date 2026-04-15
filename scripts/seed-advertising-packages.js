/**
 * Seed advertising packages (JavaScript version for deployment)
 * This runs automatically during: pnpm install / npm install
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const advertisingPackages = [
  {
    packageId: 'advert1',
    name: 'Advert 1',
    description: 'Small landscape banner - Static display',
    monthlyPrice: 250,
    yearlyPrice: 2700,
    placement: 'homepage',
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
    yearlyPrice: 5940,
    placement: 'homepage',
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
    description: 'Landscape banner - 7-second rotation',
    monthlyPrice: 1000,
    yearlyPrice: 10800,
    placement: 'category_pages',
    features: [
      'Landscape banner (728x90px)',
      '7-second rotation',
      '30-day campaign duration',
      'Category page placement',
      'Click tracking enabled',
      'High engagement zone',
    ],
    displayOrder: 3,
  },
  {
    packageId: 'advert4',
    name: 'Advert 4',
    description: 'Premium top category placement',
    monthlyPrice: 1500,
    yearlyPrice: 16200,
    placement: 'category_top',
    features: [
      'Landscape banner (728x90px)',
      '10-second rotation',
      '30-day campaign duration',
      'Top category placement',
      'Premium positioning',
      'Click tracking enabled',
    ],
    displayOrder: 4,
  },
  {
    packageId: 'advert5',
    name: 'Advert 5',
    description: 'Big landscape ads with extended rotation',
    monthlyPrice: 2000,
    yearlyPrice: 21600,
    placement: 'below_packages',
    features: [
      'Big landscape banner (980x180px)',
      '15-second rotation',
      '30-day campaign duration',
      'Below packages section',
      'Extended visibility',
      'Click tracking enabled',
    ],
    displayOrder: 5,
  },
  {
    packageId: 'promotions',
    name: 'Promotions',
    description: 'Premium promotional campaigns with big landscape ads',
    monthlyPrice: 2500,
    yearlyPrice: 27000,
    placement: 'promotions_section',
    features: [
      'Big landscape banner (980x180px)',
      '15-second rotation',
      '30-day campaign duration',
      'Promotions section placement',
      'Featured promotional placement',
      'Click tracking enabled',
    ],
    displayOrder: 6,
  },
];

async function main() {
  console.log('🌱 Starting advertising packages seed...');

  try {
    for (const pkg of advertisingPackages) {
      const existing = await prisma.advertisementPackage.findUnique({
        where: { packageId: pkg.packageId },
      });

      if (existing) {
        console.log(`✓ Package ${pkg.packageId} already exists, updating...`);
        await prisma.advertisementPackage.update({
          where: { packageId: pkg.packageId },
          data: pkg,
        });
      } else {
        console.log(`✓ Creating package ${pkg.packageId}...`);
        await prisma.advertisementPackage.create({
          data: pkg,
        });
      }
    }

    console.log('✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
