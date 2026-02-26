import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로젝트 둘러보기",
  description:
    "인디 메이커들의 사이드 프로젝트를 발견하고 피드백을 남겨보세요. 기술 스택, 프로젝트 단계별로 필터링할 수 있습니다.",
  alternates: {
    canonical: "https://lunkit.vercel.app/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
