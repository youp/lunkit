import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lunkit — 사이드 프로젝트 쇼케이스 플랫폼";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,92,231,0.25) 0%, transparent 70%)",
            top: -100,
            right: -50,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)",
            bottom: -80,
            left: -30,
            display: "flex",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #6c5ce7, #a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            L
          </div>
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -1,
            }}
          >
            Lunkit
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -2,
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            사이드 프로젝트를
          </span>
          <span
            style={{
              fontSize: 52,
              fontWeight: 800,
              background: "linear-gradient(135deg, #6c5ce7, #a78bfa)",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: -2,
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            세상에 꺼내놓는 곳
          </span>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 22,
            color: "#a0a0b0",
            marginTop: 28,
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          동료 개발자에게 진짜 피드백을 받아보세요
        </p>

        {/* Tech badges */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 40,
          }}
        >
          {["Next.js", "Supabase", "TypeScript", "Tailwind"].map((tech) => (
            <span
              key={tech}
              style={{
                padding: "8px 18px",
                borderRadius: 10,
                border: "1px solid rgba(108,92,231,0.3)",
                background: "rgba(108,92,231,0.1)",
                color: "#a78bfa",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
