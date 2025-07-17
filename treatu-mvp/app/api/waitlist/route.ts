import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    await prisma.waitingList.create({ data: { email } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.code === "P2002") {
      // Unique constraint failed (already on waitlist)
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}