"use client";

import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="테마 전환"
      className="fixed top-6 right-6 z-[100] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border bg-bg-card text-xl backdrop-blur-[8px] transition-all duration-300 hover:scale-108 hover:border-border-hover max-md:top-4 max-md:right-4 max-md:h-[42px] max-md:w-[42px] max-md:text-lg"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
