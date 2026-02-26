import { Header } from "@/components/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[700px] px-6 pt-24 pb-20">
        <h1 className="mb-8 font-display text-3xl font-bold tracking-tight">
          이용약관
        </h1>
        <div className="flex flex-col gap-8 text-[15px] leading-[1.8] text-text-secondary">
          <p className="text-sm text-text-muted">시행일: 2026년 2월 26일</p>

          <Section title="제1조 (목적)">
            본 약관은 Lunkit(이하 &quot;서비스&quot;)이 제공하는 사이드 프로젝트
            쇼케이스 플랫폼 서비스의 이용 조건 및 절차에 관한 사항을
            규정합니다.
          </Section>

          <Section title="제2조 (정의)">
            <ol className="list-decimal space-y-2 pl-5">
              <li>&quot;서비스&quot;란 Lunkit이 운영하는 웹사이트 및 관련 서비스를 의미합니다.</li>
              <li>&quot;회원&quot;이란 본 약관에 동의하고 GitHub 계정을 통해 로그인한 이용자를 의미합니다.</li>
              <li>&quot;콘텐츠&quot;란 회원이 서비스에 등록한 프로젝트 정보, 댓글, 피드백 등을 의미합니다.</li>
            </ol>
          </Section>

          <Section title="제3조 (약관의 효력)">
            본 약관은 서비스를 이용하고자 하는 모든 회원에게 적용됩니다.
            서비스에 로그인함으로써 본 약관에 동의한 것으로 간주합니다.
          </Section>

          <Section title="제4조 (서비스의 제공)">
            <ol className="list-decimal space-y-2 pl-5">
              <li>사이드 프로젝트 등록 및 소개</li>
              <li>프로젝트에 대한 피드백(댓글) 작성 및 조회</li>
              <li>프로젝트 좋아요(업보트) 기능</li>
              <li>기술 스택 기반 프로젝트 탐색</li>
            </ol>
          </Section>

          <Section title="제5조 (회원의 의무)">
            <ol className="list-decimal space-y-2 pl-5">
              <li>회원은 타인의 권리를 침해하는 콘텐츠를 등록해서는 안 됩니다.</li>
              <li>허위 정보, 스팸, 광고성 콘텐츠를 게시해서는 안 됩니다.</li>
              <li>다른 회원에 대한 비방, 욕설 등 불건전한 행위를 해서는 안 됩니다.</li>
              <li>서비스의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.</li>
            </ol>
          </Section>

          <Section title="제6조 (콘텐츠의 권리)">
            <ol className="list-decimal space-y-2 pl-5">
              <li>회원이 등록한 콘텐츠의 저작권은 해당 회원에게 있습니다.</li>
              <li>서비스는 콘텐츠를 서비스 내 표시, 홍보 목적으로 사용할 수 있습니다.</li>
              <li>회원은 언제든지 자신의 콘텐츠를 수정하거나 삭제할 수 있습니다.</li>
            </ol>
          </Section>

          <Section title="제7조 (서비스 변경 및 중단)">
            서비스는 운영상, 기술상의 필요에 따라 서비스의 전부 또는 일부를
            변경하거나 중단할 수 있으며, 이 경우 사전에 공지합니다.
          </Section>

          <Section title="제8조 (면책)">
            <ol className="list-decimal space-y-2 pl-5">
              <li>서비스는 무료로 제공되며, 서비스 이용으로 발생한 손해에 대해 법적 책임을 지지 않습니다.</li>
              <li>회원 간 또는 회원과 제3자 간의 분쟁에 대해 서비스는 개입하지 않습니다.</li>
            </ol>
          </Section>

          <Section title="제9조 (약관 변경)">
            본 약관이 변경될 경우 시행일 7일 전 서비스 내 공지를 통해
            알려드립니다.
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
