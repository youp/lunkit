"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import {
  checkIsAdmin,
  fetchAdminStats,
  fetchWaitlist,
  fetchRecentPageViews,
} from "@/lib/supabase/admin-queries";

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

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "waitlist" | "views">(
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
      ])
        .then(([s, w, pv]) => {
          setStats(s);
          setWaitlist(w);
          setPageViews(pv);
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

  const tabs = [
    { key: "overview" as const, label: "개요" },
    { key: "waitlist" as const, label: `대기자 (${stats.waitlistCount})` },
    { key: "views" as const, label: "방문 기록" },
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
          <div className="rounded-2xl border border-border bg-bg-card">
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
