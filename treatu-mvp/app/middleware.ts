import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("treatu_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/business/login", req.url));
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/business/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};