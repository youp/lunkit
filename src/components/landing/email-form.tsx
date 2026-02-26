"use client";

import { useState } from "react";

interface EmailFormProps {
  className?: string;
}

export function EmailForm({ className = "" }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // TODO: Supabase waitlist 연동
    setMessage({ text: "🎉 등록 완료! 런칭 소식을 가장 먼저 알려드릴게요.", type: "success" });
    setEmail("");

    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex w-full max-w-[460px] gap-3 max-md:flex-col">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력하세요"
          required
          aria-label="이메일 주소"
          className="flex-1 rounded-[14px] border border-border bg-input-bg px-5 py-4 font-body text-base text-text-primary outline-none transition-all duration-300 placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-glow)]"
        />
        <button
          type="submit"
          className="cursor-pointer whitespace-nowrap rounded-[14px] border-none bg-accent px-7 py-4 font-body text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_6px_24px_var(--accent-glow)] active:translate-y-0 max-md:w-full"
        >
          알림 받기
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-sm ${
            message.type === "success" ? "text-success" : "text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
