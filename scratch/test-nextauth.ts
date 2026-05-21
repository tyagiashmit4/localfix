import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

async function main() {
  const prisma = new PrismaClient();
  const adapter = PrismaAdapter(prisma);

  console.log("Testing Prisma adapter methods...");
  try {
    const user = await prisma.user.findFirst();
    console.log("Database connection successful. First user:", user ? user.email : "No users found");

    if (adapter.createUser) {
      console.log("PrismaAdapter successfully initialized!");
    } else {
      console.log("PrismaAdapter failed to expose createUser method.");
    }
  } catch (e) {
    console.error("Prisma check failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
