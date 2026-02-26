export function launchEmailHtml({ unsubscribeUrl }: { unsubscribeUrl?: string } = {}) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lunkit 런칭 알림</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans KR',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                🚀 Lunkit
              </span>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#12121a;border:1px solid #1e1e2e;border-radius:20px;padding:48px 40px;">
              <!-- Heading -->
              <h1 style="margin:0 0 12px;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;letter-spacing:-0.5px;">
                드디어 런칭했습니다! 🎉
              </h1>
              <p style="margin:0 0 28px;font-size:16px;color:#9ca3af;line-height:1.7;">
                안녕하세요! 대기자로 등록해주셔서 감사합니다.<br/>
                약속대로, 가장 먼저 소식을 전해드립니다.
              </p>

              <!-- Feature Highlights -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;background:#1a1a2e;border-radius:12px;margin-bottom:8px;">
                    <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#818cf8;">💡 프로젝트 등록</p>
                    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.5;">사이드 프로젝트를 소개하고 기술 스택을 태깅하세요</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:16px 20px;background:#1a1a2e;border-radius:12px;">
                    <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#818cf8;">💬 구조화된 피드백</p>
                    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.5;">UX, 비즈니스 모델, 기술 구조 등 포인트별 피드백을 받으세요</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:16px 20px;background:#1a1a2e;border-radius:12px;">
                    <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#818cf8;">🔍 프로젝트 탐색</p>
                    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.5;">인디 메이커들의 프로젝트를 둘러보고 영감을 얻으세요</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://lunkit.vercel.app"
                       style="display:inline-block;padding:16px 40px;background:#6366f1;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:14px;letter-spacing:-0.3px;">
                      Lunkit 시작하기 →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="margin:0 0 8px;font-size:12px;color:#4b5563;">
                본 메일은 Lunkit 런칭 알림에 동의하신 분께 발송되었습니다.
              </p>
              ${unsubscribeUrl ? `<p style="margin:0;font-size:12px;color:#4b5563;">
                <a href="${unsubscribeUrl}" style="color:#6366f1;text-decoration:underline;">수신 거부</a>
              </p>` : ""}
              <p style="margin:16px 0 0;font-size:11px;color:#374151;">
                © Lunkit. All rights reserved.
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

export const launchEmailSubject = "🚀 Lunkit이 드디어 런칭했습니다!";
