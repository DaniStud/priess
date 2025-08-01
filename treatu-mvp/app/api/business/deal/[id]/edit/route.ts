import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function PUT(req: Request, context: any) {
  const id = Number(context.params.id);
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
    durationMinutes,
    imageUrl
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
        durationMinutes,
        imageUrl: imageUrl || null
      } as any
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
