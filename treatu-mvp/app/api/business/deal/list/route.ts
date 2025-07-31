
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url!);
  const salonId = searchParams.get("salonId");

  // Auth check: only allow access if the logged-in business owns this salonId
  const cookieStore = await cookies();
  const token = cookieStore.get("treatu_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    // @ts-ignore
    const businessId = payload.businessId;
    // Find all salons for this business
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { salons: { select: { id: true } } }
    });
    const allowedSalonIds = business?.salons.map((s) => s.id) || [];
    if (!allowedSalonIds.includes(Number(salonId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deals = await prisma.deal.findMany({
      where: { salonId: Number(salonId) },
      orderBy: { startDate: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        originalPrice: true,
        price: true,
        quantity: true,
        startDate: true,
        expiryDate: true,
        durationMinutes: true,
      },
    });
    return NextResponse.json(deals);
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
