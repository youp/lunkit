"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { fetchProjects, fetchTechStacks } from "@/lib/supabase/queries";
import { STAGE_MAP, FEEDBACK_POINT_MAP } from "@/types/database";
import type { ProjectStage, Project, TechStack } from "@/types/database";

const STAGES: { value: ProjectStage | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "idea", label: "💡 아이디어" },
  { value: "mvp", label: "🧪 MVP" },
  { value: "launched", label: "🚀 런칭" },
  { value: "growing", label: "📈 성장 중" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allTechStacks, setAllTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStage, setSelectedStage] = useState<ProjectStage | "all">("all");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([fetchProjects(), fetchTechStacks()])
      .then(([p, t]) => {
        setProjects(p);
        setAllTechStacks(t);
      })
      .catch((err) => console.error("fetchProjects error:", err?.message ?? err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          p.title.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.tech_stacks?.some((t) => t.name.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }
      if (selectedStage !== "all" && p.stage !== selectedStage) return false;
      if (selectedTechs.length > 0) {
        const projectSlugs = p.tech_stacks?.map((t) => t.slug) ?? [];
        if (!selectedTechs.some((slug) => projectSlugs.includes(slug))) return false;
      }
      return true;
    });
  }, [projects, search, selectedStage, selectedTechs]);

  const toggleTech = (slug: string) => {
    setSelectedTechs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  // Only show tech stacks that appear in projects
  const usedTechSlugs = new Set(
    projects.flatMap((p) => p.tech_stacks?.map((t) => t.slug) ?? [])
  );
  const availableTechs = allTechStacks.filter((t) => usedTechSlugs.has(t.slug));

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[900px] px-6 pt-24 pb-20">
        <div className="mb-10">
          <h1 className="font-display text-[clamp(28px,4vw,40px)] font-bold tracking-[-1px]">
            프로젝트 둘러보기
          </h1>
          <p className="mt-2 text-text-secondary">
            인디 메이커들의 사이드 프로젝트를 발견하고 피드백을 남겨보세요
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="프로젝트명, 설명, 기술 스택으로 검색..."
            className="w-full rounded-2xl border border-border bg-input-bg px-5 py-3.5 text-base text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-glow)]"
          />
        </div>

        {/* Stage filter */}
        <div className="mb-4 flex flex-wrap gap-2">
          {STAGES.map((stage) => (
            <button
              key={stage.value}
              onClick={() => setSelectedStage(stage.value)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                selectedStage === stage.value
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-bg-card text-text-secondary hover:border-border-hover"
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>

        {/* Tech stack filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {availableTechs.map((tech) => (
            <button
              key={tech.slug}
              onClick={() => toggleTech(tech.slug)}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                selectedTechs.includes(tech.slug)
                  ? "border-accent bg-accent/15 text-tag-text"
                  : "border-transparent bg-tag-bg text-tag-text hover:border-border"
              }`}
            >
              {tech.name}
            </button>
          ))}
          {selectedTechs.length > 0 && (
            <button
              onClick={() => setSelectedTechs([])}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text-secondary"
            >
              초기화
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-text-muted">
          {filteredProjects.length}개의 프로젝트
        </p>

        {/* Project list */}
        {loading ? (
          <div className="py-20 text-center text-text-muted">
            <p className="text-lg">불러오는 중...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredProjects.map((project) => {
              const stage = STAGE_MAP[project.stage];
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group flex flex-col gap-4 rounded-[20px] border border-border bg-bg-card p-7 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-border-hover hover:bg-bg-card-hover hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] max-md:p-5"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 max-md:flex-col max-md:gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <h2 className="font-display text-xl font-bold tracking-tight text-text-primary transition-colors group-hover:text-accent">
                          {project.title}
                        </h2>
                        <span
                          className={`inline-flex shrink-0 items-center gap-[5px] rounded-md px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.3px] ${stage.className}`}
                        >
                          {stage.emoji} {stage.label}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[15px] font-light leading-relaxed text-text-secondary">
                        {project.tagline}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {project.demo_url && (
                        <span className="inline-flex items-center gap-1.5 rounded-[10px] border border-border bg-transparent px-3 py-1.5 text-xs font-medium text-text-secondary transition-all group-hover:border-accent group-hover:text-accent">
                          <ExternalLinkIcon />
                          웹
                        </span>
                      )}
                      {project.app_store_url && (
                        <span className="inline-flex items-center rounded-[10px] border border-border bg-transparent px-3 py-1.5 text-xs font-medium text-text-secondary transition-all group-hover:border-accent group-hover:text-accent">
                          iOS
                        </span>
                      )}
                      {project.play_store_url && (
                        <span className="inline-flex items-center rounded-[10px] border border-border bg-transparent px-3 py-1.5 text-xs font-medium text-text-secondary transition-all group-hover:border-accent group-hover:text-accent">
                          Android
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tech tags */}
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

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-3 border-t border-border pt-3 max-md:flex-col max-md:items-start">
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
                    <div className="flex shrink-0 items-center gap-4 text-[13px] text-text-muted">
                      <span className="flex items-center gap-1">👍 {project.upvote_count}</span>
                      <span className="flex items-center gap-1">💬 {project.comment_count}</span>
                      {project.profiles && (
                        <span className="text-text-muted">
                          by {project.profiles.display_name}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}

            {filteredProjects.length === 0 && !loading && (
              <div className="py-20 text-center text-text-muted">
                <p className="text-lg">검색 결과가 없습니다</p>
                <p className="mt-2 text-sm">다른 검색어나 필터를 시도해보세요</p>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

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
