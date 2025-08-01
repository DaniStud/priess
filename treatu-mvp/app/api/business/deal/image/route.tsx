import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file") || formData.get("dealImage");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save file to /public/uploads/
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop();
    const fileName = `deal_${Date.now()}.${ext}`;
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    // Optionally resize (e.g. max 800x800)
    const resizedBuffer = await sharp(buffer)
      .resize(800, 800, { fit: "inside" })
      .toBuffer();
    await fs.writeFile(filePath, resizedBuffer);

    const imageUrl = `/uploads/${fileName}`;
    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
