
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
      select: { id: true, email: true, salons: { select: { id: true, name: true } } }
    });
    if (!business) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    // Return the first salonId and salonName if exists
    const salon = business.salons[0] || null;
    const salonId = salon?.id || null;
    const salonName = salon?.name || null;
    return NextResponse.json({ id: business.id, email: business.email, salonId, salonName });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
