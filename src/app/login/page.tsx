"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const error = searchParams.get("error");

  const handleGitHubLogin = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-screen max-w-[400px] flex-col items-center justify-center px-6">
        <div className="w-full rounded-2xl border border-border bg-bg-card p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 -rotate-6 items-center justify-center rounded-xl bg-accent text-xl text-white">
              🚀
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Lunkit 로그인
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              GitHub 계정으로 시작하세요
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              로그인 중 오류가 발생했습니다. 다시 시도해주세요.
            </div>
          )}

          <button
            onClick={handleGitHubLogin}
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#24292f] px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#32383f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GitHubIcon />
            {loading ? "로그인 중..." : "GitHub로 로그인"}
          </button>

          <p className="mt-6 text-center text-xs text-text-muted">
            로그인하면{" "}
            <span className="text-text-secondary">이용약관</span>과{" "}
            <span className="text-text-secondary">개인정보처리방침</span>에
            동의하게 됩니다.
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 text-sm text-text-muted no-underline transition-colors hover:text-text-secondary"
        >
          홈으로 돌아가기
        </Link>
      </main>
    </>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
