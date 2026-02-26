"use client";

import { ScrollAnimate } from "./scroll-animate";
import { EmailForm } from "./email-form";

export function CtaSection() {
  return (
    <section className="px-6 pt-[100px] pb-[120px] text-center">
      <ScrollAnimate>
        <div className="relative mx-auto max-w-[580px] overflow-hidden rounded-[28px] border border-border bg-bg-card p-[60px_40px] max-md:p-[48px_24px]">
          {/* Glow effect */}
          <div
            className="pointer-events-none absolute -top-1/2 -left-1/2 h-[200%] w-[200%]"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, var(--accent-glow), transparent 50%)",
            }}
          />
          <h2 className="relative mb-3 font-display text-[clamp(24px,3.5vw,34px)] font-bold tracking-[-1px]">
            런칭 소식을 가장 먼저 받아보세요
          </h2>
          <p className="relative mb-9 text-base font-light text-text-secondary">
            스팸 없이, 런칭 당일 딱 한 번 알려드립니다.
          </p>
          <EmailForm className="relative flex justify-center" />
        </div>
      </ScrollAnimate>
    </section>
  );
}
