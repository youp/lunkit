"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <ThemeToggle />
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-5 backdrop-blur-[12px] transition-colors duration-300 max-md:px-5 ${
          scrolled
            ? "border-b border-border bg-bg-primary/80"
            : "bg-transparent"
        }`}
      >
        <a
          href="#"
          className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-text-primary no-underline"
        >
          <div className="flex h-8 w-8 -rotate-6 items-center justify-center rounded-lg bg-accent text-base text-white">
            🚀
          </div>
          Lunkit
        </a>
        <Link
          href="/projects"
          className="mr-14 rounded-xl px-4 py-2 text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-accent-subtle hover:text-accent"
        >
          프로젝트 둘러보기
        </Link>
      </nav>
    </>
  );
}
