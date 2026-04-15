import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding advertising packages...');

  const packages = [
    {
      packageId: 'advert1',
      name: 'Advert 1',
      description: 'Small landscape ads with static placement',
      monthlyPrice: 250,
      yearlyPrice: 2400,
      placement: 'Home page, Under advertisements',
      features: [
        'Small landscape ads',
        'Static placement',
        'Perfect for service-based businesses',
        'Affordable entry point for advertising',
      ],
      displayOrder: 1,
    },
    {
      packageId: 'advert2',
      name: 'Advert 2',
      description: 'Portrait ads with 4-second slideshow',
      monthlyPrice: 550,
      yearlyPrice: 5280,
      placement: 'Home page',
      features: [
        'Portrait format ads',
        '4 seconds slideshow rotation',
        'Higher visibility on home page',
        'Ideal for retail and eCommerce',
      ],
      displayOrder: 2,
    },
    {
      packageId: 'advert3',
      name: 'Advert 3',
      description: 'Landscape ads with 7-second rotation',
      monthlyPrice: 1000,
      yearlyPrice: 9600,
      placement: 'Below category page, above & below "Claim your listing"',
      features: [
        'Landscape format ads',
        '7 seconds slideshow rotation',
        'High engagement placement',
        'Great for property and seasonal businesses',
      ],
      displayOrder: 3,
    },
    {
      packageId: 'advert4',
      name: 'Advert 4',
      description: 'Premium top category placement',
      monthlyPrice: 1500,
      yearlyPrice: 14400,
      placement: 'Top category page',
      features: [
        'Landscape format ads',
        '10 seconds slideshow rotation',
        'Prime real estate placement',
        'Maximum visibility for premium brands',
      ],
      displayOrder: 4,
    },
    {
      packageId: 'advert5',
      name: 'Advert 5',
      description: 'Big landscape ads with extended rotation',
      monthlyPrice: 2000,
      yearlyPrice: 19200,
      placement: 'Below packages section',
      features: [
        'Big landscape ads',
        '15 seconds slideshow rotation',
        'Extended visibility window',
        'Ideal for major announcements and promotions',
      ],
      displayOrder: 5,
    },
    {
      packageId: 'promotions',
      name: 'Promotions',
      description: 'Premium promotional campaigns with big landscape ads',
      monthlyPrice: 2500,
      yearlyPrice: 24000,
      placement: 'Promotions section',
      features: [
        'Big landscape ads',
        '15 seconds slideshow rotation',
        'Featured promotional placement',
        'Best for special offers and limited-time campaigns',
      ],
      displayOrder: 6,
    },
  ];

  for (const pkg of packages) {
    const existing = await prisma.advertisementPackage.findUnique({
      where: { packageId: pkg.packageId },
    });

    if (existing) {
      console.log(`✓ Package "${pkg.name}" already exists`);
    } else {
      await prisma.advertisementPackage.create({
        data: {
          ...pkg,
          isActive: true,
        },
      });
      console.log(`✓ Created package "${pkg.name}"`);
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
