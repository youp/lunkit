import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  const { email, agreed_at } = await req.json();

  if (!email || !agreed_at) {
    return NextResponse.json(
      { error: "이메일과 동의 정보가 필요합니다." },
      { status: 400 }
    );
  }

  // 1. Supabase에 저장
  const { error } = await supabase
    .from("waitlist")
    .insert({ email, agreed_at });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "등록에 실패했습니다." },
      { status: 500 }
    );
  }

  // 2. 감사 이메일 발송
  let emailError: string | null = null;
  try {
    await transporter.sendMail({
      from: `"Lunkit" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Lunkit 런칭 알림 등록 완료 🚀",
      html: welcomeEmailHtml(),
    });
  } catch (err) {
    emailError =
      err instanceof Error ? err.message : "알 수 없는 이메일 오류";
    console.error("이메일 발송 실패:", err);
  }

  return NextResponse.json({ success: true, emailError });
}

function welcomeEmailHtml() {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background-color:#13131a;border:1px solid #1e1e2e;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 24px;text-align:center;">
              <div style="display:inline-block;width:48px;height:48px;background-color:#6c5ce7;border-radius:12px;line-height:48px;font-size:24px;transform:rotate(-6deg);">🚀</div>
              <h1 style="margin:16px 0 0;font-size:24px;font-weight:700;color:#ffffff;">등록해 주셔서 감사합니다!</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#a0a0b0;">
                Lunkit 런칭 알림에 등록해 주셔서 감사합니다.<br/>
                런칭 당일, 가장 먼저 소식을 전해드릴게요.
              </p>
              <div style="background-color:#1a1a2e;border-radius:12px;padding:20px;margin-bottom:20px;">
                <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#6c5ce7;">Lunkit이란?</p>
                <p style="margin:0;font-size:14px;line-height:1.6;color:#a0a0b0;">
                  사이드 프로젝트를 등록하고, 동료 개발자에게 진짜 피드백을 받을 수 있는 쇼케이스 플랫폼입니다.
                </p>
              </div>
              <p style="margin:0;font-size:13px;color:#666680;">
                스팸 없이, 런칭 당일 딱 한 번 알려드립니다.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1e1e2e;text-align:center;">
              <p style="margin:0;font-size:12px;color:#666680;">
                © 2026 Lunkit · 수신 거부를 원하시면 lunkit.contact@gmail.com으로 알려주세요.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
