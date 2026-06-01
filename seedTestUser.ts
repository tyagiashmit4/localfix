import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('TestPassword123!', 10);
  
  // Clean up any existing test user to avoid phone unique constraint issues
  await prisma.user.deleteMany({
    where: { email: 'test@localfix.io' }
  });

  await prisma.user.create({
    data: {
      name: 'Razorpay Reviewer',
      email: 'test@localfix.io',
      phone: '7776665554',
      password: hashedPassword,
      role: 'CUSTOMER'
    }
  });
  console.log('Test user created successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
