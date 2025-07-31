import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Configure transporter (use environment variables in production)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL_USER,
        pass: process.env.CONTACT_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.CONTACT_EMAIL_USER,
      to: "wirenfeldtd@gmail.com",
      subject: `Kontaktformular fra ${name}`,
      text: `Navn: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><b>Navn:</b> ${name}<br/><b>Email:</b> ${email}</p><p>${message.replace(/\n/g, '<br/>')}</p>`
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
