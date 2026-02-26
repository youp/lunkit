"use client";

import { ScrollAnimate } from "./scroll-animate";

const STEPS = [
  {
    num: 1,
    title: "프로젝트 등록",
    desc: "한줄 소개와 데모 링크, 기술 스택을 입력하면 끝. 5분이면 충분해요.",
  },
  {
    num: 2,
    title: "피드백 포인트 지정",
    desc: "어떤 부분에 대해 피드백을 받고 싶은지 선택하세요. UX? 비즈니스 모델? 기술 구조?",
  },
  {
    num: 3,
    title: "동료 개발자의 피드백",
    desc: "다른 빌더들이 당신의 프로젝트를 보고 구체적인 피드백을 남겨줍니다.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-[700px] px-6 pt-20 pb-[120px]">
      <ScrollAnimate>
        <p className="text-center text-[13px] font-semibold uppercase tracking-[2px] text-accent">
          How it works
        </p>
      </ScrollAnimate>
      <ScrollAnimate delay={0.08}>
        <h2 className="mt-4 mb-16 text-center font-display text-[clamp(28px,4vw,40px)] font-bold tracking-[-1px]">
          3단계로 시작하세요
        </h2>
      </ScrollAnimate>

      <div className="relative flex flex-col">
        {/* Timeline line */}
        <div className="absolute top-14 bottom-14 left-7 w-0.5 rounded-full bg-gradient-to-b from-accent to-border max-md:left-[22px]" />

        {STEPS.map((step, i) => (
          <ScrollAnimate
            key={step.num}
            animation="fade-left"
            delay={0.12 * i}
            className="flex items-start gap-7 py-6 max-md:gap-5"
          >
            <div className="relative z-[2] flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-bg-card font-display text-xl font-bold text-accent max-md:h-11 max-md:w-11 max-md:text-base">
              {step.num}
            </div>
            <div>
              <h3 className="mb-1.5 font-display text-[19px] font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="text-[15px] font-light leading-[1.6] text-text-secondary">
                {step.desc}
              </p>
            </div>
          </ScrollAnimate>
        ))}
      </div>
    </section>
  );
}
