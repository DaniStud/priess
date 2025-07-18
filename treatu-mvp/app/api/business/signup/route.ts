import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check for existing business
  const existing = await prisma.business.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email exists" }, { status: 409 });
  }

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  // Create business
  try {
    await prisma.business.create({
      data: { name, email, password: hashed },
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}