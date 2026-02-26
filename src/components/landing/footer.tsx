import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10 text-center text-sm text-text-muted">
      <p>
        © 2026{" "}
        <a
          href="#"
          className="text-text-secondary no-underline transition-colors duration-200 hover:text-accent"
        >
          Lunkit
        </a>
        . 사이드 프로젝트 빌더를 위한 쇼케이스 플랫폼.
      </p>
      <div className="mt-3 flex items-center justify-center gap-4">
        <Link
          href="/terms"
          className="text-text-muted no-underline transition-colors duration-200 hover:text-text-secondary"
        >
          이용약관
        </Link>
        <span className="text-border">·</span>
        <Link
          href="/privacy"
          className="text-text-muted no-underline transition-colors duration-200 hover:text-text-secondary"
        >
          개인정보처리방침
        </Link>
      </div>
    </footer>
  );
}
