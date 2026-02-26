"use client";

import { ScrollAnimate } from "./scroll-animate";

const STACK_TAGS = [
  "React", "Next.js", "Vue", "Svelte", "TypeScript",
  "Supabase", "Firebase", "Node.js", "Python", "Tailwind CSS",
  "Flutter", "PostgreSQL", "Docker", "Vercel", "AWS",
];

export function StackSection() {
  return (
    <section className="px-6 pt-20 pb-[120px] text-center">
      <ScrollAnimate>
        <p className="text-[13px] font-semibold uppercase tracking-[2px] text-accent">
          Tech Stack Tags
        </p>
      </ScrollAnimate>
      <ScrollAnimate delay={0.08}>
        <h2 className="mt-4 mb-12 font-display text-[clamp(28px,4vw,40px)] font-bold tracking-[-1px]">
          다양한 기술 스택을 태그로
        </h2>
      </ScrollAnimate>

      <div className="mx-auto flex max-w-[600px] flex-wrap justify-center gap-3 max-sm:gap-2">
        {STACK_TAGS.map((tag, i) => (
          <ScrollAnimate key={tag} animation="scale-in" delay={0.05 * i}>
            <span className="rounded-full border border-border bg-tag-bg px-5 py-2.5 text-sm font-medium text-tag-text transition-all duration-300 hover:scale-105 hover:border-accent max-sm:px-4 max-sm:py-2 max-sm:text-[13px]">
              {tag}
            </span>
          </ScrollAnimate>
        ))}
      </div>
    </section>
  );
}
