import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url!);
  const salonId = searchParams.get("salonId");
  if (!salonId) {
    return NextResponse.json({ error: "Missing salonId" }, { status: 400 });
  }
  try {
    const deals = await prisma.deal.findMany({
      where: { salonId: Number(salonId) },
      orderBy: { startDate: "desc" },
      select: {
        id: true,
        title: true,
        price: true,
        startDate: true,
        expiryDate: true,
      },
    });
    return NextResponse.json(deals);
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
