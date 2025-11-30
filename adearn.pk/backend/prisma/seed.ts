import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const PEPPER = process.env.PEPPER_SECRET || 'adearn-pk-pepper-2025';

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123' + PEPPER, 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@adearn.pk' },
    update: {},
    create: {
      email: 'admin@adearn.pk',
      phone: '923001234567',
      name: 'System Administrator',
      password: adminPassword,
      role: 'admin',
      status: 'active',
      isVerified: true,
    },
  });

  // Create sample ads
  const ads = await prisma.ad.createMany({
    data: [
      {
        title: 'Tech Gadgets Review',
        description: 'Latest smartphone review advertisement',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        duration: 45,
        earnings: 2.5,
      },
      {
        title: 'Fashion Brand Launch',
        description: 'New clothing line promotion',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        duration: 30,
        earnings: 2.0,
      },
      {
        title: 'Food Delivery Service',
        description: 'Food ordering app advertisement',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        duration: 60,
        earnings: 3.0,
      },
    ],
  });

  console.log('✅ Database seeded successfully');
  console.log(`👤 Admin user: admin@adearn.pk / admin123`);
  console.log(`📺 Created ${ads.count} sample ads`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });