"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { createProject, fetchTechStacks } from "@/lib/supabase/queries";
import {
  STAGE_MAP,
  FEEDBACK_POINT_MAP,
  type ProjectStage,
  type TechStack,
} from "@/types/database";

const TECH_CATEGORIES: Record<string, string> = {
  frontend: "프론트엔드",
  backend: "백엔드",
  database: "데이터베이스",
  language: "언어",
  infra: "인프라",
  ai: "AI",
};

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [appStoreUrl, setAppStoreUrl] = useState("");
  const [playStoreUrl, setPlayStoreUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [stage, setStage] = useState<ProjectStage>("idea");
  const [selectedTechs, setSelectedTechs] = useState<number[]>([]);
  const [feedbackPoints, setFeedbackPoints] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);

  useEffect(() => {
    fetchTechStacks()
      .then(setTechStacks)
      .catch((err) => console.error("fetchTechStacks error:", err?.message ?? err));
  }, []);

  const toggleTech = (id: number) => {
    setSelectedTechs((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleFeedback = (key: string) => {
    setFeedbackPoints((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createProject({
        title,
        tagline,
        description,
        demo_url: demoUrl,
        app_store_url: appStoreUrl,
        play_store_url: playStoreUrl,
        github_url: githubUrl,
        stage,
        feedback_points: feedbackPoints,
        tech_stack_ids: selectedTechs,
      });
      router.push("/projects");
    } catch (err) {
      alert(err instanceof Error ? err.message : "등록에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group tech stacks by category
  const groupedTechs = techStacks.reduce(
    (acc, tech) => {
      const cat = tech.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(tech);
      return acc;
    },
    {} as Record<string, TechStack[]>
  );

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[680px] px-6 pt-24 pb-20">
        <h1 className="mb-2 font-display text-3xl font-bold tracking-tight">
          프로젝트 등록
        </h1>
        <p className="mb-10 text-text-secondary">
          사이드 프로젝트를 소개하고 동료 개발자의 피드백을 받아보세요
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* 프로젝트명 */}
          <Field label="프로젝트명" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: Lunkit"
              required
              maxLength={50}
              className="input-field"
            />
          </Field>

          {/* 한줄 소개 */}
          <Field label="한줄 소개" required description="어떤 문제를 풀려고 만들었는지 한 문장으로">
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="예: 사이드 프로젝트를 등록하고 피드백을 받는 쇼케이스 플랫폼"
              required
              maxLength={100}
              className="input-field"
            />
            <p className="mt-1.5 text-right text-xs text-text-muted">
              {tagline.length}/100
            </p>
          </Field>

          {/* 상세 설명 */}
          <Field label="상세 설명" description="프로젝트의 배경, 주요 기능, 기술적 도전 등을 자유롭게 작성하세요">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="마크다운으로 작성할 수 있습니다..."
              rows={8}
              className="input-field resize-y"
            />
          </Field>

          {/* 링크 */}
          <Field label="링크" description="해당하는 링크만 입력하면 됩니다">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs font-medium text-text-muted">웹 데모</span>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://"
                  className="input-field"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs font-medium text-text-muted">App Store</span>
                <input
                  type="url"
                  value={appStoreUrl}
                  onChange={(e) => setAppStoreUrl(e.target.value)}
                  placeholder="https://apps.apple.com/..."
                  className="input-field"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs font-medium text-text-muted">Play Store</span>
                <input
                  type="url"
                  value={playStoreUrl}
                  onChange={(e) => setPlayStoreUrl(e.target.value)}
                  placeholder="https://play.google.com/..."
                  className="input-field"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs font-medium text-text-muted">GitHub</span>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="input-field"
                />
              </div>
            </div>
          </Field>

          {/* 현재 단계 */}
          <Field label="현재 단계" required>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(STAGE_MAP) as [ProjectStage, (typeof STAGE_MAP)[ProjectStage]][]).map(
                ([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStage(key)}
                    className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      stage === key
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-bg-card text-text-secondary hover:border-border-hover"
                    }`}
                  >
                    {val.emoji} {val.label}
                  </button>
                )
              )}
            </div>
          </Field>

          {/* 기술 스택 */}
          <Field label="기술 스택" required description="프로젝트에 사용한 기술을 선택하세요">
            <div className="flex flex-col gap-4">
              {Object.entries(groupedTechs).map(([category, techs]) => (
                <div key={category}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[1px] text-text-muted">
                    {TECH_CATEGORIES[category] ?? category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tech) => (
                      <button
                        key={tech.id}
                        type="button"
                        onClick={() => toggleTech(tech.id)}
                        className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                          selectedTechs.includes(tech.id)
                            ? "border-accent bg-accent/15 text-tag-text"
                            : "border-transparent bg-tag-bg text-tag-text hover:border-border"
                        }`}
                      >
                        {tech.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {selectedTechs.length > 0 && (
              <p className="mt-2 text-xs text-text-muted">
                {selectedTechs.length}개 선택됨
              </p>
            )}
          </Field>

          {/* 피드백 요청 포인트 */}
          <Field
            label="피드백 요청 포인트"
            required
            description="어떤 부분에 대해 피드백을 받고 싶나요? (복수 선택)"
          >
            <div className="flex flex-wrap gap-2">
              {Object.entries(FEEDBACK_POINT_MAP).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleFeedback(key)}
                  className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                    feedbackPoints.includes(key)
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border bg-bg-card text-text-secondary hover:border-border-hover"
                  }`}
                >
                  💬 {label}
                </button>
              ))}
            </div>
          </Field>

          {/* Submit */}
          <div className="flex items-center gap-4 border-t border-border pt-8">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !title.trim() ||
                !tagline.trim() ||
                selectedTechs.length === 0 ||
                feedbackPoints.length === 0
              }
              className="cursor-pointer rounded-xl bg-accent px-8 py-3 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_6px_24px_var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isSubmitting ? "등록 중..." : "프로젝트 등록"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="cursor-pointer rounded-xl border border-border bg-transparent px-6 py-3 text-base font-medium text-text-secondary transition-all hover:border-border-hover hover:text-text-primary"
            >
              취소
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

function Field({
  label,
  required,
  description,
  children,
}: {
  label: string;
  required?: boolean;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-text-primary">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      {description && (
        <p className="mb-3 text-xs text-text-muted">{description}</p>
      )}
      {children}
    </div>
  );
}
