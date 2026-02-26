"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EmailForm } from "./email-form";

export function HeroSection() {
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  useEffect(() => {
    createClient()
      .rpc("get_waitlist_count")
      .then(({ data }) => setWaitlistCount(data ?? 0));
  }, []);

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-[120px] pb-20 text-center max-md:px-5 max-md:pt-[100px] max-md:pb-[60px]"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div
        className="mb-9 inline-flex items-center gap-2 rounded-full border border-border bg-accent-subtle px-[18px] py-2 text-sm font-medium text-text-secondary opacity-0"
        style={{ animation: "fadeUp 0.8s var(--ease-out-expo) 0.2s forwards" }}
      >
        <span className="animate-pulse-dot h-2 w-2 rounded-full bg-accent" />
        곧 런칭합니다
      </div>

      <h1
        className="mb-7 font-display text-[clamp(42px,7vw,80px)] font-extrabold leading-[1.1] tracking-[-2px] opacity-0 max-sm:tracking-[-1px]"
        style={{ animation: "fadeUp 0.8s var(--ease-out-expo) 0.35s forwards" }}
      >
        사이드 프로젝트를
        <br />
        <span className="bg-gradient-to-br from-accent to-[#a78bfa] bg-clip-text text-transparent">
          세상에 꺼내놓는 곳
        </span>
      </h1>

      <p
        className="mb-12 max-w-[520px] text-[clamp(17px,2.2vw,21px)] font-light leading-[1.7] text-text-secondary opacity-0"
        style={{ animation: "fadeUp 0.8s var(--ease-out-expo) 0.5s forwards" }}
      >
        혼자 만든 프로젝트, 더 이상 혼자 고민하지 마세요.
        <br />
        동료 개발자에게 진짜 피드백을 받아보세요.
      </p>

      <div
        className="opacity-0"
        style={{ animation: "fadeUp 0.8s var(--ease-out-expo) 0.65s forwards" }}
      >
        <EmailForm />
      </div>

      {waitlistCount !== null && waitlistCount > 0 && (
        <p
          className="mt-3 text-[13px] text-text-muted opacity-0"
          style={{ animation: "fadeUp 0.8s var(--ease-out-expo) 0.8s forwards" }}
        >
          🔥 현재 <strong>{waitlistCount}</strong>명이 기다리고 있어요
        </p>
      )}
    </section>
  );
}
