const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Example business
  await prisma.business.create({
    data: {
      name: "Test Shop",
      email: "test@shop.com",
      password: "hashed-password",
      deals: {
        create: [
          {
            title: "50% Off",
            description: "Half price on everything!",
            price: 10.00,
            quantity: 20,
            expiryDate: new Date(Date.now() + 86400000),
          },
        ],
      },
    },
  });

  await prisma.waitingList.create({
    data: { email: "customer@example.com" },
  });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());