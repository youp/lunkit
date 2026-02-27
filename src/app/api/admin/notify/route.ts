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
  const { projectTitle, projectId, projectTagline, projectStage, techStacks } =
    await req.json();

  if (!projectTitle || !projectId) {
    return NextResponse.json(
      { error: "프로젝트 정보가 필요합니다." },
      { status: 400 }
    );
  }

  // 대기자 이메일 목록 조회
  const { data: waitlist, error } = await supabase
    .from("waitlist")
    .select("email");

  if (error || !waitlist?.length) {
    return NextResponse.json(
      { error: "대기자 목록을 가져올 수 없습니다." },
      { status: 500 }
    );
  }

  const emails = waitlist.map((w) => w.email);
  const projectUrl = `https://lunkit.kr/projects/${projectId}`;

  let sentCount = 0;
  let failCount = 0;

  // 각 대기자에게 개별 이메일 발송
  for (const email of emails) {
    try {
      await transporter.sendMail({
        from: `"Lunkit" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `새 프로젝트가 등록됐어요: ${projectTitle}`,
        html: newProjectEmailHtml({
          title: projectTitle,
          tagline: projectTagline || "",
          stage: projectStage || "",
          techStacks: techStacks || [],
          url: projectUrl,
        }),
      });
      sentCount++;
    } catch (err) {
      console.error(`이메일 발송 실패 (${email}):`, err);
      failCount++;
    }
  }

  return NextResponse.json({ sentCount, failCount, total: emails.length });
}

interface ProjectEmailData {
  title: string;
  tagline: string;
  stage: string;
  techStacks: string[];
  url: string;
}

const STAGE_LABELS: Record<string, string> = {
  idea: "아이디어",
  mvp: "MVP",
  launched: "런칭",
  growing: "성장 중",
};

function newProjectEmailHtml({ title, tagline, stage, techStacks, url }: ProjectEmailData) {
  const stageLabel = STAGE_LABELS[stage] || stage;
  const techBadges = techStacks
    .slice(0, 5)
    .map(
      (t) =>
        `<span style="display:inline-block;padding:4px 10px;margin:3px;background-color:#1a1a2e;border-radius:6px;font-size:11px;color:#a0a0b0;">${t}</span>`
    )
    .join("");

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
              <div style="display:inline-block;width:48px;height:48px;background-color:#6c5ce7;border-radius:12px;line-height:48px;font-size:24px;">🎉</div>
              <h1 style="margin:16px 0 0;font-size:22px;font-weight:700;color:#ffffff;">새 프로젝트가 등록됐어요!</h1>
            </td>
          </tr>
          <!-- Project Card -->
          <tr>
            <td style="padding:0 40px 32px;">
              <div style="background-color:#1a1a2e;border:1px solid #2a2a3e;border-radius:14px;padding:28px;margin-bottom:24px;">
                <div style="margin-bottom:12px;">
                  <span style="display:inline-block;padding:4px 10px;background-color:#6c5ce7;border-radius:6px;font-size:11px;font-weight:600;color:#ffffff;letter-spacing:0.5px;">${stageLabel}</span>
                </div>
                <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#ffffff;">${title}</p>
                ${tagline ? `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#a0a0b0;">${tagline}</p>` : ""}
                ${techBadges ? `<div style="margin-top:12px;">${techBadges}</div>` : ""}
              </div>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#a0a0b0;">
                Lunkit에 새로운 사이드 프로젝트가 등록되었습니다.<br/>
                지금 확인하고 피드백을 남겨보세요!
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#6c5ce7;border-radius:12px;">
                    <a href="${url}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">프로젝트 보러 가기 →</a>
                  </td>
                </tr>
              </table>
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
