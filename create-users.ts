import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating user accounts...');

  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // Create Customer
  const customer = await prisma.user.upsert({
    where: { email: 'customer@localfix.com' },
    update: {},
    create: {
      email: 'customer@localfix.com',
      name: 'Test Customer',
      password: passwordHash,
      role: 'CUSTOMER',
      phone: '9988776655',
    },
  });
  console.log('Created customer:', customer.email);

  // Create Vendor
  const vendor = await prisma.user.upsert({
    where: { email: 'vendor@localfix.com' },
    update: {},
    create: {
      email: 'vendor@localfix.com',
      name: 'Test Vendor',
      password: passwordHash,
      role: 'PROVIDER',
      phone: '8877665544',
    },
  });
  console.log('Created vendor:', vendor.email);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'tyagiashmit4@gmail.com' },
    update: {
      role: 'ADMIN',
    },
    create: {
      email: 'tyagiashmit4@gmail.com',
      name: 'Abhishek Admin',
      password: adminPasswordHash,
      role: 'ADMIN',
      phone: '9876543210',
    },
  });
  console.log('Created/Updated admin:', admin.email);

  console.log('Finished creating accounts.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
