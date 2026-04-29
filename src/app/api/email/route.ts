import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, text } = body;

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, and html/text" },
        { status: 400 }
      );
    }

    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
      to,
      subject,
      html,
      text,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
