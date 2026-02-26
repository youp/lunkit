"use client";

import Link from "next/link";
import { ScrollAnimate } from "./scroll-animate";
import { DUMMY_PROJECTS } from "@/lib/dummy-data";
import { STAGE_MAP, FEEDBACK_POINT_MAP } from "@/types/database";

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3.5 w-3.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5-6h6m0 0v6m0-6L9.75 14.25"
      />
    </svg>
  );
}

export function ProjectFeed() {
  return (
    <section className="mx-auto max-w-[820px] px-6 pt-20 pb-[100px]">
      <ScrollAnimate>
        <p className="text-center text-[13px] font-semibold uppercase tracking-[2px] text-accent">
          Showcase
        </p>
      </ScrollAnimate>
      <ScrollAnimate delay={0.08}>
        <h2 className="mt-4 text-center font-display text-[clamp(28px,4vw,40px)] font-bold tracking-[-1px]">
          지금 등록된 프로젝트
        </h2>
      </ScrollAnimate>
      <ScrollAnimate delay={0.16}>
        <p className="mt-3 mb-12 text-center text-base font-light text-text-secondary">
          인디 메이커들이 만들고 있는 프로젝트를 둘러보세요
        </p>
      </ScrollAnimate>

      <div className="flex flex-col gap-4">
        {DUMMY_PROJECTS.map((project, i) => {
          const stage = STAGE_MAP[project.stage];
          return (
            <ScrollAnimate key={project.id} delay={0.08 * i}>
              <Link
                href={`/projects/${project.id}`}
                className="group flex flex-col gap-4 rounded-[20px] border border-border bg-bg-card p-7 no-underline transition-all duration-400 hover:-translate-y-0.5 hover:border-border-hover hover:bg-bg-card-hover hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] max-md:p-[22px_20px]"
              >
                <div className="flex items-start justify-between gap-4 max-md:flex-col max-md:gap-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight">
                      <span className="text-text-primary transition-colors duration-200 group-hover:text-accent">
                        {project.title}
                      </span>
                      <span
                        className={`inline-flex shrink-0 items-center gap-[5px] rounded-md px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.3px] ${stage.className}`}
                      >
                        {stage.emoji} {stage.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[15px] font-light leading-[1.6] text-text-secondary">
                      {project.tagline}
                    </p>
                  </div>
                  {project.demo_url && (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-border bg-transparent px-4 py-2 text-[13px] font-medium text-text-secondary transition-all duration-250 group-hover:border-accent group-hover:text-accent">
                      <ExternalLinkIcon />
                      데모
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {project.tech_stacks?.map((tech) => (
                    <span
                      key={tech.slug}
                      className="rounded-lg bg-tag-bg px-3 py-[5px] text-xs font-medium text-tag-text"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border pt-3 max-md:flex-col max-md:items-start max-md:gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {project.feedback_points.map((point) => (
                      <span
                        key={point}
                        className="rounded-md border border-dashed border-border bg-accent-subtle px-2.5 py-1 text-xs font-medium text-text-secondary"
                      >
                        💬 {FEEDBACK_POINT_MAP[point] ?? point}
                      </span>
                    ))}
                  </div>
                  <div className="flex shrink-0 items-center gap-4 text-[13px] text-text-muted max-md:w-full max-md:justify-start">
                    <span className="flex items-center gap-1">
                      👍 {project.upvote_count}
                    </span>
                    <span className="flex items-center gap-1">
                      💬 {project.comment_count}
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollAnimate>
          );
        })}
      </div>
    </section>
  );
}
