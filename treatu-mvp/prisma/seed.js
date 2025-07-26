const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Create or connect a SalonType
  const salonType = await prisma.salonType.upsert({
    where: { name: "hair salon" },
    update: {},
    create: { name: "hair salon" },
  });

  // 2. Create the Business with a nested Salon
  const business = await prisma.business.create({
    data: {
      name: "Test Shop",
      email: "test@shop.com",
      password: "hashed-password",
      salons: {
        create: [
          {
            name: "Test Shop Salon",
            salonTypeId: salonType.id,
            address: "Gammel Kongevej 1",
            city: "København",
            zipCode: "1610",
            country: "Danmark",
          },
        ],
      },
    },
    include: { salons: true },
  });

  // 3. Create a Deal for the Salon
  const salon = business.salons[0];
  await prisma.deal.create({
    data: {
      title: "50% Off",
      description: "Half price on everything!",
      price: 10.00,
      quantity: 20,
      expiryDate: new Date(Date.now() + 86400000),
      salonId: salon.id,
    },
  });

  // 4. Add a waiting list entry
  await prisma.waitingList.create({
    data: { email: "customer@example.com" },
  });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());