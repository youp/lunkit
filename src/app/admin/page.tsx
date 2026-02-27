"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import {
  checkIsAdmin,
  fetchAdminStats,
  fetchWaitlist,
  fetchRecentPageViews,
  fetchDailyPageViews,
  fetchAllProjects,
  deleteProject,
  fetchPendingProjects,
  approveProject,
  rejectProject,
} from "@/lib/supabase/admin-queries";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { launchEmailHtml, launchEmailSubject } from "@/lib/email/launch-template";

interface Stats {
  projectCount: number;
  userCount: number;
  waitlistCount: number;
  totalPageViews: number;
  todayPageViews: number;
}

interface WaitlistEntry {
  id: string;
  email: string;
  created_at: string;
}

interface PageView {
  id: number;
  path: string;
  referrer: string | null;
  created_at: string;
}

interface DailyView {
  date: string;
  count: number;
}

interface PendingProject {
  id: string;
  title: string;
  tagline: string;
  stage: string;
  created_at: string;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  }[];
  tech_stacks: { name: string }[];
}

interface AdminProject {
  id: string;
  title: string;
  tagline: string;
  stage: string;
  is_published: boolean;
  created_at: string;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  }[];
  tech_stacks: { name: string }[];
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);
  const [allProjects, setAllProjects] = useState<AdminProject[]>([]);
  const [dailyViews, setDailyViews] = useState<DailyView[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "waitlist" | "views" | "email">(
    "overview"
  );

  useEffect(() => {
    checkIsAdmin().then((isAdmin) => {
      if (!isAdmin) {
        router.replace("/");
        return;
      }

      Promise.all([
        fetchAdminStats(),
        fetchWaitlist(),
        fetchRecentPageViews(),
        fetchPendingProjects(),
        fetchDailyPageViews(30),
        fetchAllProjects(),
      ])
        .then(([s, w, pv, pp, dv, ap]) => {
          setStats(s);
          setWaitlist(w);
          setPageViews(pv);
          setPendingProjects(pp as PendingProject[]);
          setDailyViews(dv);
          setAllProjects(ap as AdminProject[]);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  }, [router]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-[900px] px-6 pt-32 pb-20 text-center">
          <p className="text-text-muted">로딩 중...</p>
        </main>
      </>
    );
  }

  if (!stats) return null;

  // Group page views by path
  const pathCounts: Record<string, number> = {};
  pageViews.forEach((pv) => {
    pathCounts[pv.path] = (pathCounts[pv.path] || 0) + 1;
  });
  const topPaths = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const handleApprove = async (id: string) => {
    const project = pendingProjects.find((p) => p.id === id);
    if (!project) return;

    const choice = prompt(
      "이 프로젝트를 승인하시겠습니까?\n\n1 = 승인만 (이메일 없음)\n2 = 승인 + 테스트 이메일 (나에게만)\n3 = 승인 + 전체 발송\n\n번호를 입력하세요:"
    );
    if (!choice || !["1", "2", "3"].includes(choice)) return;

    try {
      await approveProject(id);
      setPendingProjects((prev) => prev.filter((p) => p.id !== id));

      if (choice === "1") {
        alert("승인 완료! (이메일 미발송)");
        return;
      }

      const res = await fetch("/api/admin/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle: project.title,
          projectId: id,
          projectTagline: project.tagline,
          projectStage: project.stage,
          techStacks: project.tech_stacks?.map((t) => t.name) ?? [],
          testOnly: choice === "2",
        }),
      });
      const result = await res.json();
      if (res.ok) {
        alert(
          choice === "2"
            ? `승인 완료! 테스트 이메일 발송 (${result.sentCount}명)`
            : `승인 완료! 이메일 ${result.sentCount}/${result.total}명 발송 성공`
        );
      } else {
        alert(`승인 완료! (이메일 발송 실패: ${result.error})`);
      }
    } catch {
      alert("승인 실패");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("이 프로젝트를 거절(삭제)하시겠습니까?")) return;
    try {
      await rejectProject(id);
      setPendingProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("거절 실패");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 프로젝트를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) return;
    try {
      await deleteProject(id);
      setAllProjects((prev) => prev.filter((p) => p.id !== id));
      alert("삭제 완료");
    } catch {
      alert("삭제 실패");
    }
  };

  const tabs = [
    { key: "overview" as const, label: "개요" },
    { key: "projects" as const, label: `프로젝트 (${allProjects.length})` },
    { key: "waitlist" as const, label: `대기자 (${stats.waitlistCount})` },
    { key: "views" as const, label: "방문 기록" },
    { key: "email" as const, label: "이메일 템플릿" },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[900px] px-6 pt-24 pb-20">
        <h1 className="mb-2 font-display text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mb-8 text-text-secondary">Lunkit 운영 현황</p>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`cursor-pointer border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-accent text-accent"
                  : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stats cards */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatCard label="총 프로젝트" value={stats.projectCount} />
              <StatCard label="가입 유저" value={stats.userCount} />
              <StatCard label="대기자 목록" value={stats.waitlistCount} />
              <StatCard label="오늘 방문" value={stats.todayPageViews} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Total views */}
              <div className="rounded-2xl border border-border bg-bg-card p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[1.5px] text-text-muted">
                  총 페이지뷰
                </h3>
                <p className="font-display text-4xl font-bold text-accent">
                  {stats.totalPageViews.toLocaleString()}
                </p>
              </div>

              {/* Top pages */}
              <div className="rounded-2xl border border-border bg-bg-card p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[1.5px] text-text-muted">
                  인기 페이지 (최근 50건)
                </h3>
                <div className="flex flex-col gap-2">
                  {topPaths.map(([path, count]) => (
                    <div
                      key={path}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate text-text-secondary">
                        {path}
                      </span>
                      <span className="shrink-0 font-medium text-text-primary">
                        {count}
                      </span>
                    </div>
                  ))}
                  {topPaths.length === 0 && (
                    <p className="text-sm text-text-muted">아직 데이터 없음</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "projects" && (
          <div className="flex flex-col gap-8">
            {/* 승인 대기 */}
            {pendingProjects.length > 0 && (
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[1.5px] text-yellow-400">
                  승인 대기 ({pendingProjects.length})
                </h3>
                <div className="flex flex-col gap-4">
                  {pendingProjects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-2xl border bg-bg-card p-6" style={{ borderColor: "rgba(234,179,8,0.2)" }}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h3 className="font-display text-lg font-bold">
                            {project.title}
                          </h3>
                          <p className="mt-1 text-sm text-text-secondary">
                            {project.tagline}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-lg px-3 py-1 text-xs font-medium text-yellow-400" style={{ backgroundColor: "rgba(234,179,8,0.15)" }}>
                          승인 대기
                        </span>
                      </div>
                      <div className="mb-4 flex items-center gap-3 text-xs text-text-muted">
                        <span>
                          {project.profiles?.[0]?.display_name || project.profiles?.[0]?.username}
                        </span>
                        <span>·</span>
                        <span>{project.stage}</span>
                        <span>·</span>
                        <span>
                          {new Date(project.created_at).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(project.id)}
                          className="cursor-pointer rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-hover"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => handleReject(project.id)}
                          className="cursor-pointer rounded-xl border px-5 py-2 text-sm font-medium text-red-400 transition-all" style={{ borderColor: "rgba(239,68,68,0.3)" }}
                        >
                          거절
                        </button>
                        <a
                          href={`/projects/${project.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl border border-border px-5 py-2 text-sm font-medium text-text-secondary no-underline transition-all hover:border-border-hover hover:text-text-primary"
                        >
                          상세보기
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 전체 프로젝트 */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[1.5px] text-text-muted">
                전체 프로젝트 ({allProjects.length})
              </h3>
              {allProjects.length === 0 ? (
                <div className="rounded-2xl border border-border bg-bg-card p-8 text-center text-text-muted">
                  등록된 프로젝트가 없습니다
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-bg-card">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-[1px] text-text-muted">
                        <th className="px-6 py-4">프로젝트</th>
                        <th className="px-6 py-4">작성자</th>
                        <th className="px-6 py-4">상태</th>
                        <th className="px-6 py-4">등록일</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProjects.map((project) => (
                        <tr
                          key={project.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-6 py-4">
                            <a
                              href={`/projects/${project.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-text-primary no-underline hover:text-accent"
                            >
                              {project.title}
                            </a>
                            <p className="mt-0.5 text-xs text-text-muted">
                              {project.tagline}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-sm text-text-muted">
                            {project.profiles?.[0]?.display_name || project.profiles?.[0]?.username}
                          </td>
                          <td className="px-6 py-4">
                            {project.is_published ? (
                              <span className="rounded-lg px-2.5 py-1 text-xs font-medium text-green-400" style={{ backgroundColor: "rgba(34,197,94,0.15)" }}>
                                공개
                              </span>
                            ) : (
                              <span className="rounded-lg px-2.5 py-1 text-xs font-medium text-yellow-400" style={{ backgroundColor: "rgba(234,179,8,0.15)" }}>
                                대기
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-text-muted">
                            {new Date(project.created_at).toLocaleDateString("ko-KR")}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDelete(project.id, project.title)}
                              className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:opacity-80"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "waitlist" && (
          <div className="rounded-2xl border border-border bg-bg-card">
            {waitlist.length === 0 ? (
              <p className="p-8 text-center text-text-muted">
                아직 대기자가 없습니다
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-[1px] text-text-muted">
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">이메일</th>
                    <th className="px-6 py-4">가입일</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((entry, i) => (
                    <tr
                      key={entry.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-6 py-4 text-sm text-text-muted">
                        {i + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-text-primary">
                        {entry.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">
                        {new Date(entry.created_at).toLocaleDateString("ko-KR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "views" && (
          <div className="flex flex-col gap-6">
            {/* Daily Chart */}
            <div className="rounded-2xl border border-border bg-bg-card p-6">
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-[1.5px] text-text-muted">
                일일 방문 추이 (최근 30일)
              </h3>
              {dailyViews.length === 0 ? (
                <p className="py-8 text-center text-text-muted">아직 데이터 없음</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={dailyViews}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#666680", fontSize: 11 }}
                      tickFormatter={(v: string) => {
                        const d = new Date(v);
                        return `${d.getMonth() + 1}/${d.getDate()}`;
                      }}
                      axisLine={{ stroke: "#1e1e2e" }}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fill: "#666680", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#13131a",
                        border: "1px solid #1e1e2e",
                        borderRadius: "12px",
                        fontSize: "13px",
                      }}
                      labelStyle={{ color: "#a0a0b0" }}
                      itemStyle={{ color: "#6c5ce7" }}
                      labelFormatter={(v) => {
                        const d = new Date(String(v));
                        return d.toLocaleDateString("ko-KR", {
                          month: "long",
                          day: "numeric",
                          weekday: "short",
                        });
                      }}
                      formatter={(value) => [`${value}회`, "방문"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#6c5ce7"
                      strokeWidth={2}
                      fill="url(#colorViews)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Recent Views Table */}
            <div className="rounded-2xl border border-border bg-bg-card">
              <div className="border-b border-border px-6 py-4">
                <h3 className="text-sm font-semibold uppercase tracking-[1.5px] text-text-muted">
                  최근 방문 기록
                </h3>
              </div>
              {pageViews.length === 0 ? (
                <p className="p-8 text-center text-text-muted">
                  아직 방문 기록이 없습니다
                </p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-[1px] text-text-muted">
                      <th className="px-6 py-4">경로</th>
                      <th className="px-6 py-4">리퍼러</th>
                      <th className="px-6 py-4">시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageViews.map((pv) => (
                      <tr
                        key={pv.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-text-primary">
                          {pv.path}
                        </td>
                        <td className="max-w-[200px] truncate px-6 py-4 text-sm text-text-muted">
                          {pv.referrer || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted">
                          {new Date(pv.created_at).toLocaleString("ko-KR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        {activeTab === "email" && (
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-bg-card p-6">
              <h3 className="mb-2 font-display text-lg font-semibold">런칭 알림 이메일</h3>
              <p className="mb-4 text-sm text-text-muted">
                제목: <strong className="text-text-secondary">{launchEmailSubject}</strong>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const w = window.open("", "_blank");
                    if (w) {
                      w.document.write(launchEmailHtml());
                      w.document.close();
                    }
                  }}
                  className="cursor-pointer rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-border-hover hover:text-text-primary"
                >
                  미리보기
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(launchEmailHtml());
                    alert("HTML이 클립보드에 복사되었습니다");
                  }}
                  className="cursor-pointer rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-border-hover hover:text-text-primary"
                >
                  HTML 복사
                </button>
                <button
                  onClick={() => {
                    const emails = waitlist.map((w) => w.email).join(", ");
                    navigator.clipboard.writeText(emails);
                    alert(`${waitlist.length}개 이메일이 클립보드에 복사되었습니다`);
                  }}
                  className="cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-hover"
                >
                  대기자 이메일 복사 ({waitlist.length}명)
                </button>
              </div>
            </div>

            {/* Email Preview */}
            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="border-b border-border bg-bg-card px-6 py-3">
                <p className="text-xs font-medium text-text-muted">이메일 미리보기</p>
              </div>
              <iframe
                srcDoc={launchEmailHtml()}
                title="이메일 미리보기"
                className="h-[600px] w-full bg-white"
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-[1px] text-text-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}
