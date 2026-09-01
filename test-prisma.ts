import prisma from "./src/config/prisma";

async function test() {
  try {
    const user = await prisma.user.create({
      data: {
        id: "test_" + Date.now(),
        name: "Test User",
        email: "test_" + Date.now() + "@example.com",
        emailVerified: false,
        role: "CANDIDATE",
      },
    });
    console.log("Created user directly in Prisma successfully:", user);
  } catch (err) {
    console.error("Prisma error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
