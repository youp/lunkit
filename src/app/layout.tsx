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

export const metadata: Metadata = {
  title: "Lunkit — 사이드 프로젝트 쇼케이스 플랫폼",
  description:
    "사이드 프로젝트를 등록하고 동료 개발자에게 피드백을 받는 쇼케이스 플랫폼",
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
