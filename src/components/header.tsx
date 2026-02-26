"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayName =
    user?.user_metadata?.user_name ??
    user?.user_metadata?.display_name ??
    user?.email?.split("@")[0];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4 backdrop-blur-[12px] transition-colors duration-300 max-md:px-5 ${
        scrolled
          ? "border-b border-border bg-bg-primary/80"
          : "bg-transparent"
      }`}
    >
      <Link
        href="/"
        className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-text-primary no-underline"
      >
        <div className="flex h-8 w-8 -rotate-6 items-center justify-center rounded-lg bg-accent text-base text-white">
          🚀
        </div>
        Lunkit
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href="/projects"
          className="rounded-xl px-4 py-2 text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-accent-subtle hover:text-accent"
        >
          둘러보기
        </Link>

        {user ? (
          <>
            <Link
              href="/projects/new"
              className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_4px_16px_var(--accent-glow)]"
            >
              프로젝트 등록
            </Link>
            <div className="relative flex items-center gap-2">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName ?? ""}
                  className="h-8 w-8 rounded-full border border-border"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-subtle font-display text-sm font-bold text-accent">
                  {displayName?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-accent-subtle hover:text-text-secondary"
              >
                로그아웃
              </button>
            </div>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_4px_16px_var(--accent-glow)]"
          >
            로그인
          </Link>
        )}

        <button
          onClick={toggleTheme}
          aria-label="테마 전환"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-bg-card text-base transition-all duration-300 hover:scale-108 hover:border-border-hover"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
