
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Simple in-memory rate limiter (per IP)
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 attempts per window
const loginAttempts: Record<string, { count: number; last: number }> = {};

export async function POST(req: Request) {
  try {
    // Rate limiting by IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const now = Date.now();
    if (!loginAttempts[ip] || now - loginAttempts[ip].last > RATE_LIMIT_WINDOW) {
      loginAttempts[ip] = { count: 1, last: now };
    } else {
      loginAttempts[ip].count++;
      loginAttempts[ip].last = now;
    }
    if (loginAttempts[ip].count > RATE_LIMIT_MAX) {
      return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 });
    }

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const business = await prisma.business.findUnique({ where: { email } });
    if (!business) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, business.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = jwt.sign(
      { businessId: business.id, email: business.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ success: true });
    response.cookies.set("treatu_token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}