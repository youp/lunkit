"use client";

import { useState } from "react";

interface EmailFormProps {
  className?: string;
}

export function EmailForm({ className = "" }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !agreed || submitting) return;

    setSubmitting(true);
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, agreed_at: new Date().toISOString() }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      setMessage({ text: error || "등록에 실패했습니다.", type: "error" });
      setSubmitting(false);
      return;
    }

    const data = await res.json();
    if (data.emailError) {
      setMessage({
        text: `등록 완료! (이메일 발송 실패: ${data.emailError})`,
        type: "error",
      });
    } else {
      setMessage({ text: "등록 완료! 확인 메일을 보내드렸어요 📬", type: "success" });
    }
    setEmail("");
    setAgreed(false);
    setSubmitting(false);

    setTimeout(() => setMessage(null), 8000);
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex w-full max-w-[460px] flex-col gap-3">
        <div className="flex gap-3 max-md:flex-col">
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
            disabled={!agreed || submitting}
            className="cursor-pointer whitespace-nowrap rounded-[14px] border-none bg-accent px-7 py-4 font-body text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_6px_24px_var(--accent-glow)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none max-md:w-full"
          >
            {submitting ? "등록 중..." : "알림 받기"}
          </button>
        </div>
        <label className="flex cursor-pointer items-start gap-2 text-left text-xs text-text-muted">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 accent-accent"
          />
          <span>
            런칭 알림 발송을 위해{" "}
            <strong className="text-text-secondary">이메일 주소 수집 및 이용</strong>에
            동의합니다. 수집된 이메일은 서비스 알림 외 다른 용도로 사용되지 않으며,
            수신 거부(파기 요청) 시 즉시 삭제됩니다.
          </span>
        </label>
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
