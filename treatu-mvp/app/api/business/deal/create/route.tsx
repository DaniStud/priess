import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      originalPrice,
      price,
      quantity,
      startDate,
      expiryDate,
      salonId,
      durationMinutes,
      imageUrl
    } = body;

    if (!title || !description || !originalPrice || !price || !quantity || !startDate || !expiryDate || !salonId || !durationMinutes) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        description,
        originalPrice,
        price,
        quantity,
        startDate: new Date(startDate),
        expiryDate: new Date(expiryDate),
        durationMinutes,
        imageUrl: imageUrl || null,
        salon: {
          connect: { id: Number(salonId) }
        }
      } as any
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
