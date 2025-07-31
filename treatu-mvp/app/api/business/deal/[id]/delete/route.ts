import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, context: any) {
  const id = Number(context.params.id);
  if (!id) {
    return NextResponse.json({ error: "Missing or invalid deal id" }, { status: 400 });
  }
  try {
    await prisma.deal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
