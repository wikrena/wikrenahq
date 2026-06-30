import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = "prof.chrisawoke@gmail.com";
const FROM = "Wikrena Website <hello@wikrena.com>";

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, email, company, interest, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "development") {
      console.log("[contact] Would send from:", name, email, interest, message);
    }
    return NextResponse.json({ ok: true });
  }

  const interestLabel: Record<string, string> = {
    academy: "Academy Enrollment",
    consulting: "Consulting Engagement",
    corporate: "Corporate Training",
    partnership: "Partnership",
    other: "Other",
  };

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a192f;border-radius:16px;overflow:hidden">
      <div style="background:#0a192f;padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08)">
        <div style="font-size:20px;font-weight:900;color:#fff;letter-spacing:-0.5px">Wikrena<span style="color:#2ec4b6">.</span></div>
        <div style="font-size:11px;color:rgba(255,255,255,0.3);margin-top:4px;text-transform:uppercase;letter-spacing:2px">New Website Enquiry</div>
      </div>
      <div style="padding:28px 32px">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:12px;width:130px;vertical-align:top">Name</td><td style="padding:8px 0;color:#fff;font-size:14px;font-weight:600">${name}</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:12px;vertical-align:top">Email</td><td style="padding:8px 0;color:#2ec4b6;font-size:14px"><a href="mailto:${email}" style="color:#2ec4b6">${email}</a></td></tr>
          ${company ? `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:12px;vertical-align:top">Company</td><td style="padding:8px 0;color:#fff;font-size:14px">${company}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:12px;vertical-align:top">Interested in</td><td style="padding:8px 0"><span style="background:rgba(46,196,182,0.15);border:1px solid rgba(46,196,182,0.3);color:#2ec4b6;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:1px">${interestLabel[interest] ?? interest}</span></td></tr>
        </table>
        <div style="margin-top:20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:18px">
          <div style="font-size:11px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Message</div>
          <div style="color:rgba(255,255,255,0.75);font-size:14px;line-height:1.7;white-space:pre-wrap">${message}</div>
        </div>
        <div style="margin-top:20px;text-align:center">
          <a href="mailto:${email}" style="display:inline-block;background:#2ec4b6;color:#0a192f;font-weight:700;font-size:13px;padding:12px 28px;border-radius:10px;text-decoration:none">Reply to ${name.split(" ")[0]}</a>
        </div>
      </div>
      <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.07);text-align:center">
        <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0">Submitted via wikrena.com contact form</p>
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [ADMIN_EMAIL],
        reply_to: email,
        subject: `New enquiry from ${name} — ${interestLabel[interest] ?? interest}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("[contact] Resend error:", err);
      return NextResponse.json({ error: "Failed to send. Please email us directly at hello@wikrena.com" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[contact] Network error:", err.message);
    return NextResponse.json({ error: "Failed to send. Please email us directly at hello@wikrena.com" }, { status: 500 });
  }
}
