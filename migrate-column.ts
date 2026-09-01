import prisma from "./src/config/prisma";

async function addColumns() {
  try {
    console.log("Adding issuer column to Account table if missing...");
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "issuer" TEXT;`
    );
    console.log("Account table synced successfully!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

addColumns();
