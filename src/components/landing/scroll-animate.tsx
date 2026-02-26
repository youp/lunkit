"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollAnimateProps {
  children: ReactNode;
  animation?: "fade-up" | "fade-left" | "scale-in";
  delay?: number;
  className?: string;
}

export function ScrollAnimate({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
}: ScrollAnimateProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              animation === "fade-up"
                ? "animate-fade-up"
                : animation === "fade-left"
                  ? "animate-fade-left"
                  : "animate-scale-in"
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animation]);

  return (
    <div
      ref={ref}
      className={`opacity-0 ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
