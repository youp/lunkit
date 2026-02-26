"use client";

import { ScrollAnimate } from "./scroll-animate";

const FEATURES = [
  {
    icon: "📦",
    title: "프로젝트 등록",
    desc: "한줄 소개, 데모 링크, 스크린샷으로 프로젝트를 빠르게 소개하세요.",
  },
  {
    icon: "💬",
    title: "구조화된 피드백",
    desc: "UX, 비즈니스 모델, 기술 구조 — 원하는 포인트에 맞는 피드백을 받으세요.",
  },
  {
    icon: "🏷️",
    title: "기술 스택 태깅",
    desc: "어떤 기술로 만들었는지 태그로 표시하고, 같은 스택의 프로젝트를 발견하세요.",
  },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-[1000px] px-6 pt-[100px] pb-[120px]">
      <ScrollAnimate>
        <p className="text-center text-[13px] font-semibold uppercase tracking-[2px] text-accent">
          Features
        </p>
      </ScrollAnimate>
      <ScrollAnimate delay={0.08}>
        <h2 className="mt-4 mb-16 text-center font-display text-[clamp(28px,4vw,40px)] font-bold tracking-[-1px]">
          빌더를 위한 쇼케이스 플랫폼
        </h2>
      </ScrollAnimate>

      <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1 max-md:gap-4">
        {FEATURES.map((feature, i) => (
          <ScrollAnimate key={feature.title} delay={0.1 * i}>
            <div className="rounded-[20px] border border-border bg-bg-card p-[36px_28px] transition-all duration-400 hover:-translate-y-1 hover:border-border-hover hover:bg-bg-card-hover hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] max-md:p-[28px_24px]">
              <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] border border-border bg-accent-subtle text-2xl">
                {feature.icon}
              </div>
              <h3 className="mb-2.5 font-display text-[19px] font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="text-[15px] font-light leading-[1.6] text-text-secondary">
                {feature.desc}
              </p>
            </div>
          </ScrollAnimate>
        ))}
      </div>
    </section>
  );
}
