import { Header } from "@/components/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[700px] px-6 pt-24 pb-20">
        <h1 className="mb-8 font-display text-3xl font-bold tracking-tight">
          개인정보처리방침
        </h1>
        <div className="flex flex-col gap-8 text-[15px] leading-[1.8] text-text-secondary">
          <p className="text-sm text-text-muted">시행일: 2026년 2월 26일</p>

          <Section title="1. 개인정보의 수집 및 이용 목적">
            <p>Lunkit(이하 &quot;서비스&quot;)은 다음 목적을 위해 개인정보를 수집합니다.</p>
            <Table
              rows={[
                ["회원 인증 및 관리", "GitHub 사용자명, 이메일, 프로필 이미지", "회원 탈퇴 시"],
                ["서비스 제공", "프로젝트 정보, 댓글, 좋아요 기록", "회원 탈퇴 시 또는 콘텐츠 삭제 시"],
                ["런칭 알림 발송", "이메일 주소", "수신 거부 요청 시"],
                ["서비스 개선", "방문 페이지 경로, 접속 시간", "수집 후 1년"],
              ]}
              headers={["수집 목적", "수집 항목", "보유 기간"]}
            />
          </Section>

          <Section title="2. 개인정보의 수집 방법">
            <ol className="list-decimal space-y-2 pl-5">
              <li>GitHub OAuth 로그인 시 자동 수집 (사용자명, 이메일, 프로필 이미지)</li>
              <li>서비스 이용 과정에서 직접 입력 (프로젝트 정보, 댓글)</li>
              <li>런칭 알림 이메일 등록 시 직접 입력</li>
              <li>서비스 접속 시 자동 수집 (방문 경로)</li>
            </ol>
          </Section>

          <Section title="3. 개인정보의 제3자 제공">
            <p>
              서비스는 원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다.
              다만, 다음 경우에는 예외로 합니다.
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>회원이 사전에 동의한 경우</li>
              <li>법령의 규정에 의하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 요청이 있는 경우</li>
            </ol>
          </Section>

          <Section title="4. 개인정보의 파기">
            <ol className="list-decimal space-y-2 pl-5">
              <li>회원 탈퇴 시 개인정보를 지체 없이 파기합니다.</li>
              <li>런칭 알림 이메일은 수신 거부 요청 시 즉시 삭제합니다.</li>
              <li>방문 기록은 수집 후 1년 경과 시 자동 삭제합니다.</li>
            </ol>
          </Section>

          <Section title="5. 이용자의 권리">
            <p>회원은 언제든지 다음 권리를 행사할 수 있습니다.</p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>개인정보 열람, 수정, 삭제 요청</li>
              <li>개인정보 처리 정지 요청</li>
              <li>회원 탈퇴 (GitHub 연동 해제)</li>
              <li>런칭 알림 수신 거부</li>
            </ol>
          </Section>

          <Section title="6. 쿠키 사용">
            <p>
              서비스는 로그인 세션 유지를 위해 쿠키를 사용합니다.
              브라우저 설정에서 쿠키를 거부할 수 있으나, 이 경우 로그인 기능
              이용이 제한될 수 있습니다.
            </p>
          </Section>

          <Section title="7. 개인정보 보호책임자">
            <p>
              개인정보 관련 문의는 아래로 연락해 주세요.
            </p>
            <ul className="mt-2 space-y-1 pl-5 list-disc">
              <li>서비스명: Lunkit</li>
              <li>이메일: lunkit.contact@gmail.com</li>
            </ul>
          </Section>

          <Section title="8. 개인정보처리방침 변경">
            <p>
              본 방침이 변경될 경우 시행일 7일 전 서비스 내 공지를 통해
              알려드립니다.
            </p>
          </Section>
        </div>
      </main>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 font-display text-lg font-semibold text-text-primary">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="border border-border bg-bg-card px-4 py-2.5 text-left text-xs font-semibold text-text-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border border-border px-4 py-2.5 text-text-secondary"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
