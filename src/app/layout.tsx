import type { Metadata } from "next";
import { Outfit, Noto_Sans_KR } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { PageTracker } from "@/components/page-tracker";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://lunkit.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lunkit — 사이드 프로젝트 쇼케이스 플랫폼",
    template: "%s | Lunkit",
  },
  description:
    "사이드 프로젝트를 등록하고 동료 개발자에게 피드백을 받는 쇼케이스 플랫폼. 인디 메이커를 위한 한국판 Product Hunt.",
  keywords: [
    "사이드 프로젝트",
    "쇼케이스",
    "개발자 피드백",
    "인디 메이커",
    "프로젝트 공유",
    "Product Hunt 한국",
    "MVP",
    "스타트업",
    "포트폴리오",
  ],
  authors: [{ name: "Lunkit" }],
  creator: "Lunkit",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "Lunkit",
    title: "Lunkit — 사이드 프로젝트 쇼케이스 플랫폼",
    description:
      "사이드 프로젝트를 등록하고 동료 개발자에게 피드백을 받는 쇼케이스 플랫폼",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lunkit — 사이드 프로젝트 쇼케이스 플랫폼",
    description:
      "사이드 프로젝트를 등록하고 동료 개발자에게 피드백을 받는 쇼케이스 플랫폼",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${notoSansKR.variable} font-body antialiased`}
      >
        <ThemeProvider>
          <PageTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
