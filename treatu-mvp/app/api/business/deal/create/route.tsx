

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      price,
      quantity,
      expiryDate,
      salonId,
      durationMinutes
    } = body;


    if (!title || !description || !price || !quantity || !expiryDate || !salonId || !durationMinutes) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        description,
        price,
        quantity,
        expiryDate: new Date(expiryDate),
        durationMinutes,
        salon: {
          connect: { id: salonId }
        }
      }
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
