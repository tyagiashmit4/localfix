import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Verifying user emails...');

  await prisma.user.updateMany({
    where: {
      email: {
        in: ['customer@localfix.com', 'vendor@localfix.com', 'tyagiashmit4@gmail.com']
      }
    },
    data: {
      emailVerified: new Date(),
    }
  });
  
  console.log('Emails verified successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
