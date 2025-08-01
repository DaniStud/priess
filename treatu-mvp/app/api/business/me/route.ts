import bcrypt from "bcryptjs";
export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("treatu_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  // @ts-ignore
  const businessId = payload.businessId;

  const { salonId, businessId: bodyBusinessId, salonName, email, password } = await req.json();

  if (!salonId || !businessId || !salonName || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check for email conflict
  const existing = await prisma.business.findUnique({ where: { email } });
  if (existing && existing.id !== businessId) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  try {
    // Update business
    const updateBusiness: any = { email };
    if (password) {
      updateBusiness.password = await bcrypt.hash(password, 10);
    }
    await prisma.business.update({
      where: { id: businessId },
      data: updateBusiness,
    });
    // Update salon name
    await prisma.salon.update({
      where: { id: salonId },
      data: { name: salonName },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("treatu_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    // @ts-ignore
    const businessId = payload.businessId;
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, email: true, profilePic: true, salons: { select: { id: true, name: true } } }
    });
    if (!business) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    // Return the first salonId and salonName if exists
    const salon = business.salons[0] || null;
    const salonId = salon?.id || null;
    const salonName = salon?.name || null;
    return NextResponse.json({ id: business.id, email: business.email, profilePic: business.profilePic, salonId, salonName });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
