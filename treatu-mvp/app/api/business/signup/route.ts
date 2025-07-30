import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password, businessType, services, salonAddress, salonName } = await req.json();

  if (!name || !email || !password || !businessType || !Array.isArray(services) || !salonAddress || !salonName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check for existing business
  const existing = await prisma.business.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email exists" }, { status: 409 });
  }

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  try {
    // Find or create SalonType
    const salonType = await prisma.salonType.upsert({
      where: { name: businessType },
      update: {},
      create: { name: businessType }
    });

    // Find or create all needed services
    const serviceRecords = await Promise.all(
      services.map(async (serviceName: string) =>
        prisma.service.upsert({
          where: { name: serviceName },
          update: {},
          create: { name: serviceName }
        })
      )
    );

    // Create business, nested salon, and salonServices
    await prisma.business.create({
      data: {
        name,
        email,
        password: hashed,
        salons: {
          create: {
            name: salonName, // <--- Use the provided salonName
            salonTypeId: salonType.id,
            address: salonAddress.address,
            city: salonAddress.city,
            zipCode: salonAddress.zipCode,
            country: salonAddress.country,
            services: {
              create: serviceRecords.map((srv) => ({
                serviceId: srv.id,
              })),
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}