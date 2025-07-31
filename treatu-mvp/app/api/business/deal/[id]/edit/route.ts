import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "Missing or invalid deal id" }, { status: 400 });
  }
  const body = await req.json();
  const {
    title,
    description,
    originalPrice,
    price,
    quantity,
    startDate,
    expiryDate,
    durationMinutes
  } = body;
  if (!title || !description || !originalPrice || !price || !quantity || !startDate || !expiryDate || !durationMinutes) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    const updated = await prisma.deal.update({
      where: { id },
      data: {
        title,
        description,
        originalPrice,
        price,
        quantity,
        startDate: new Date(startDate),
        expiryDate: new Date(expiryDate),
        durationMinutes
      }
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
