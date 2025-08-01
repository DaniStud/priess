import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import path from "path";
import { promises as fs } from "fs";

export async function POST(req: Request) {
  try {
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

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save file to /public/profile-pictures/
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop();
    const fileName = `business_${businessId}_${Date.now()}.${ext}`;
    const filePath = path.join(process.cwd(), "public", "profile-pictures", fileName);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer);

    // Update business profilePic field
    const imageUrl = `/profile-pictures/${fileName}`;
    await prisma.business.update({
      where: { id: businessId },
      data: { profilePic: imageUrl },
    });

    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
