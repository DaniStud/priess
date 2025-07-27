const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Delete all data for a clean slate
  await prisma.deal.deleteMany();
  await prisma.salonService.deleteMany();
  await prisma.salon.deleteMany();
  await prisma.business.deleteMany();
  await prisma.waitingList.deleteMany();
  await prisma.salonType.deleteMany();
  await prisma.service.deleteMany();
  // 1. Create or connect a SalonType
  const salonType = await prisma.salonType.upsert({
    where: { name: "hair salon" },
    update: {},
    create: { name: "hair salon" },
  });

  // 2. Upsert the Business with a nested Salon
  const business = await prisma.business.upsert({
    where: { email: "test@shop.com" },
    update: {},
    create: {
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
      durationMinutes: 90, // 1 hour 30 minutes
    },
  });

  // 4. Upsert a waiting list entry
  await prisma.waitingList.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: { email: "customer@example.com" },
  });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());