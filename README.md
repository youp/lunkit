# Lunkit 🚀

사이드 프로젝트를 등록하고 동료 개발자의 피드백을 받는 쇼케이스 플랫폼

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (Auth, Database, Storage)
- **Auth**: GitHub OAuth
- **Deploy**: Vercel

## Features

- 사이드 프로젝트 등록 및 검색
- 프로젝트 단계별 분류 (아이디어 → MVP → 런칭 → 성장)
- 구조화된 피드백 시스템 (UX, 비즈니스 모델, 기술 구조, 기능 제안, 마케팅)
- 기술 스택 태깅 및 필터링
- 다크/라이트 테마

## Getting Started

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 입력

# 개발 서버 실행
npm run dev
```

## Database Setup

Supabase SQL Editor에서 `lunkit-schema.sql`을 실행하면 테이블, RLS 정책, 트리거, 시드 데이터가 생성됩니다.

## License

MIT
