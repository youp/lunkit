"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { DUMMY_PROJECTS, DUMMY_COMMENTS } from "@/lib/dummy-data";
import { STAGE_MAP, FEEDBACK_POINT_MAP } from "@/types/database";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const project = DUMMY_PROJECTS.find((p) => p.id === id);

  if (!project) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-[800px] px-6 pt-32 pb-20 text-center">
          <h1 className="font-display text-3xl font-bold">프로젝트를 찾을 수 없습니다</h1>
          <Link
            href="/projects"
            className="mt-6 inline-block text-accent no-underline hover:underline"
          >
            프로젝트 목록으로 돌아가기
          </Link>
        </main>
      </>
    );
  }

  const stage = STAGE_MAP[project.stage];
  const comments = DUMMY_COMMENTS.filter((c) => c.project_id === project.id);
  const topLevelComments = comments.filter((c) => !c.parent_id);
  const replies = (parentId: string) => comments.filter((c) => c.parent_id === parentId);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[800px] px-6 pt-24 pb-20">
        {/* Back link */}
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-1 text-sm text-text-muted no-underline transition-colors hover:text-text-secondary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          프로젝트 목록
        </Link>

        {/* Project header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[clamp(28px,4vw,40px)] font-bold tracking-[-1px]">
              {project.title}
            </h1>
            <span
              className={`inline-flex items-center gap-[5px] rounded-md px-3 py-1 text-xs font-semibold ${stage.className}`}
            >
              {stage.emoji} {stage.label}
            </span>
          </div>
          <p className="mt-3 text-lg font-light leading-relaxed text-text-secondary">
            {project.tagline}
          </p>

          {/* Author & date */}
          <div className="mt-4 flex items-center gap-4 text-sm text-text-muted">
            {project.profiles && (
              <span>
                by <strong className="text-text-secondary">{project.profiles.display_name}</strong>
              </span>
            )}
            <span>{new Date(project.created_at).toLocaleDateString("ko-KR")}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mb-8 flex flex-wrap gap-3">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_6px_24px_var(--accent-glow)]"
            >
              <ExternalLinkIcon />
              데모 보기
            </a>
          )}
          {project.app_store_url && (
            <a
              href={project.app_store_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary no-underline transition-all hover:border-border-hover hover:text-text-primary"
            >
              App Store
            </a>
          )}
          {project.play_store_url && (
            <a
              href={project.play_store_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary no-underline transition-all hover:border-border-hover hover:text-text-primary"
            >
              Play Store
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary no-underline transition-all hover:border-border-hover hover:text-text-primary"
            >
              GitHub
            </a>
          )}
          <button className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-transparent px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-border-hover hover:text-text-primary">
            👍 좋아요 {project.upvote_count}
          </button>
        </div>

        {/* Tech stacks */}
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[1.5px] text-text-muted">
            기술 스택
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.tech_stacks?.map((tech) => (
              <span
                key={tech.slug}
                className="rounded-full border border-border bg-tag-bg px-4 py-2 text-sm font-medium text-tag-text"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* Feedback points */}
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[1.5px] text-text-muted">
            피드백 요청 포인트
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.feedback_points.map((point) => (
              <span
                key={point}
                className="rounded-lg border border-dashed border-accent/30 bg-accent-subtle px-4 py-2 text-sm font-medium text-accent"
              >
                💬 {FEEDBACK_POINT_MAP[point] ?? point}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <div className="mb-12 rounded-2xl border border-border bg-bg-card p-8">
            <h3 className="mb-4 font-display text-lg font-semibold">프로젝트 소개</h3>
            <div className="whitespace-pre-wrap text-[15px] leading-[1.8] text-text-secondary">
              {project.description}
            </div>
          </div>
        )}

        {/* Comments section */}
        <section>
          <h3 className="mb-6 font-display text-xl font-bold">
            피드백 <span className="text-text-muted">({comments.length})</span>
          </h3>

          {/* Comment input */}
          <CommentInput />

          {/* Comment list */}
          <div className="mt-8 flex flex-col gap-4">
            {topLevelComments.length === 0 ? (
              <p className="py-12 text-center text-text-muted">
                아직 피드백이 없습니다. 첫 번째 피드백을 남겨보세요!
              </p>
            ) : (
              topLevelComments.map((comment) => (
                <div key={comment.id}>
                  <div className="rounded-2xl border border-border bg-bg-card p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-subtle font-display text-sm font-bold text-accent">
                          {comment.profiles?.display_name?.charAt(0) ?? "?"}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-text-primary">
                            {comment.profiles?.display_name}
                          </span>
                          <span className="ml-2 text-xs text-text-muted">
                            {new Date(comment.created_at).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                      </div>
                      {comment.feedback_point && (
                        <span className="rounded-md bg-accent-subtle px-2.5 py-1 text-xs font-medium text-accent">
                          {FEEDBACK_POINT_MAP[comment.feedback_point] ?? comment.feedback_point}
                        </span>
                      )}
                    </div>
                    <p className="text-[15px] leading-[1.7] text-text-secondary">
                      {comment.body}
                    </p>
                  </div>

                  {/* Replies */}
                  {replies(comment.id).map((reply) => (
                    <div
                      key={reply.id}
                      className="ml-8 mt-2 rounded-2xl border border-border bg-bg-card/50 p-5"
                    >
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-subtle font-display text-xs font-bold text-accent">
                          {reply.profiles?.display_name?.charAt(0) ?? "?"}
                        </div>
                        <span className="text-sm font-semibold text-text-primary">
                          {reply.profiles?.display_name}
                        </span>
                        <span className="text-xs text-text-muted">
                          {new Date(reply.created_at).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <p className="text-sm leading-[1.7] text-text-secondary">
                        {reply.body}
                      </p>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}

function CommentInput() {
  const [body, setBody] = useState("");
  const [feedbackPoint, setFeedbackPoint] = useState("");

  return (
    <div className="rounded-2xl border border-border bg-bg-card p-6">
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="text-sm text-text-muted">피드백 포인트:</span>
        {Object.entries(FEEDBACK_POINT_MAP).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFeedbackPoint(feedbackPoint === key ? "" : key)}
            className={`cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
              feedbackPoint === key
                ? "border-accent bg-accent/15 text-accent"
                : "border-border bg-transparent text-text-muted hover:text-text-secondary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="피드백을 남겨주세요..."
        rows={3}
        className="w-full resize-none rounded-xl border border-border bg-input-bg px-4 py-3 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-glow)]"
      />
      <div className="mt-3 flex justify-end">
        <button className="cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_6px_24px_var(--accent-glow)]">
          피드백 남기기
        </button>
      </div>
    </div>
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
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5-6h6m0 0v6m0-6L9.75 14.25"
      />
    </svg>
  );
}
