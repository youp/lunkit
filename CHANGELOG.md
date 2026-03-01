# Lunkit 개발 기록

## 프로젝트 개요

- **Lunkit** (launch + kit) — 사이드 프로젝트 쇼케이스 플랫폼
- 한국 개발자들이 사이드 프로젝트를 등록하고 동료에게 피드백을 받는 공간
- https://lunkit.kr

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | Next.js 16 (App Router), TypeScript, Tailwind CSS v4 |
| 백엔드/DB | Supabase (Auth + PostgreSQL + Storage + RLS) |
| 배포 | Vercel (자동 배포) |
| 이메일 | Nodemailer + Gmail SMTP |
| 차트 | Recharts |
| 폰트 | Outfit (display) + Noto Sans KR (body) |

---

## 개발 히스토리

### Phase 1: 프로젝트 초기 세팅

- Next.js 16 프로젝트 생성 (App Router, TypeScript, Tailwind CSS v4)
- Supabase 클라이언트/서버 설정 (`client.ts`, `server.ts`)
- 미들웨어 세션 관리 (`middleware.ts`)
- 다크/라이트 테마 토글 (`ThemeProvider`)
- 폰트 설정 (Outfit + Noto Sans KR)
- CSS 변수 및 디자인 시스템 (`globals.css`)

### Phase 2: 랜딩 페이지

- 기존 HTML 랜딩 페이지를 Next.js 컴포넌트로 포팅
- Hero 섹션 (타이틀 + 이메일 수집 폼)
- 프로젝트 피드 섹션 (더미 데이터 6개)
- Features / How it Works / Stack Tags / CTA 섹션
- 모바일 반응형
- 스크롤 애니메이션

### Phase 3: DB 스키마 및 CRUD

- Supabase 스키마 설계 및 적용
  - `profiles`, `projects`, `tech_stacks`, `project_tech_stacks`
  - `comments`, `upvotes`, `waitlist`, `page_views`
- RLS(Row Level Security) 정책 전체 설정
- Trigger: 프로필 자동생성, upvote/comment 카운트 동기화
- 프로젝트 등록 폼 + 상세 페이지 구현
- 피드백 댓글 시스템
- 기술 스택 태깅 + 필터링
- Supabase Auth 연동 (로그인/회원가입)

### Phase 4: Admin 대시보드

- Admin 페이지 (`/admin`) 구현
- 탭 구성: 개요 / 프로젝트 / 대기자 / 방문 기록 / 이메일 템플릿 / 활동 로그
- 대시보드 통계 카드 (프로젝트 수, 유저 수, 대기자 수, 오늘 방문)
- 인기 페이지 목록 (최근 50건 기준)

### Phase 5: SEO 최적화

- 메타데이터 설정 (title, description, og:image)
- `sitemap.xml` 동적 생성
- `robots.txt` 설정
- JSON-LD 구조화 데이터

### Phase 6: 이메일 시스템

- **Waitlist 가입 시 감사 메일** — Gmail SMTP + Nodemailer
- **런칭 알림 이메일 템플릿** — 다크 테마 HTML 이메일
- **프로젝트 승인 알림 이메일** — 프로젝트 카드 디자인 (제목, 태그라인, 기술 스택 뱃지)
- 이메일 발송 선택: 승인만 / 테스트(관리자만) / 전체 발송
- Gmail App Password 연동

### Phase 7: 프로젝트 관리 기능

- **프로젝트 승인 시스템** — `is_published` 플래그 기반
- 승인 대기 프로젝트 목록 (노란색 뱃지)
- 승인/거절 버튼 + 상세보기 링크
- **전체 프로젝트 테이블** — 작성자, 상태(공개/대기), 등록일 표시
- **프로젝트 삭제 기능** — 확인 다이얼로그 포함

### Phase 8: 방문 통계

- 페이지뷰 트래킹 (`page_views` 테이블)
- **일일 방문 추이 그래프** — Recharts AreaChart (최근 30일)
  - accent 컬러 그라데이션, 다크 테마 호환
- 최근 방문 기록 테이블 (경로, 리퍼러, 시간)
- Waitlist 대기자 수 실시간 표시 (Supabase RPC)

### Phase 9: 보안 강화

- **Admin API 인증 체크** — `/api/admin/notify` 서버사이드 인증/인가 추가 (401/403)
- **Middleware 라우트 보호** — `/admin` 경로 서버사이드 보호
  - 비로그인 → `/login` 리다이렉트
  - 비관리자 → `/` 리다이렉트
- **XSS 방지** — 이메일 템플릿 `escapeHtml()` 적용
- **이메일 형식 검증** — Waitlist API에 regex + 길이 제한 추가
- **보안 헤더** — `next.config.ts`에 설정
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Strict-Transport-Security` (HSTS)

### Phase 10: Audit Logging

- `admin_audit_logs` 테이블 생성 (RLS: 관리자만 조회)
- 기록 대상 액션:
  - `approve_project` — 프로젝트 승인
  - `reject_project` — 프로젝트 거절
  - `delete_project` — 프로젝트 삭제
  - `send_email` — 이메일 발송 (테스트/전체 구분, 발송 수 기록)
- Admin "활동 로그" 탭 — 액션별 색상 뱃지 + 상세 설명 + 시간

### 기타

- 이용약관 / 개인정보처리방침 페이지
- Footer 링크 연결
- Tailwind v4 색상 호환성 이슈 수정 (`bg-green-500/15` → inline rgba)
- 이메일 발송 에러 디버깅 및 수정 (Gmail App Password 재발급)
- Navbar에 GitHub 링크 추가

---

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (폰트, 메타데이터, ThemeProvider)
│   ├── page.tsx            # 랜딩 페이지
│   ├── globals.css         # CSS 변수, 테마
│   ├── admin/page.tsx      # Admin 대시보드
│   ├── login/page.tsx      # 로그인
│   ├── projects/
│   │   ├── page.tsx        # 프로젝트 목록
│   │   ├── new/page.tsx    # 프로젝트 등록
│   │   └── [id]/page.tsx   # 프로젝트 상세
│   ├── privacy/page.tsx    # 개인정보처리방침
│   ├── terms/page.tsx      # 이용약관
│   └── api/
│       ├── waitlist/route.ts      # Waitlist API
│       └── admin/notify/route.ts  # 이메일 발송 API
├── components/
│   ├── header.tsx
│   ├── theme-provider.tsx
│   └── landing/            # 랜딩 페이지 컴포넌트
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # 브라우저 클라이언트
│   │   ├── server.ts       # 서버 클라이언트
│   │   ├── queries.ts      # 공개 쿼리
│   │   └── admin-queries.ts # Admin 쿼리 + Audit logging
│   └── email/
│       └── launch-template.ts # 런칭 이메일 템플릿
├── middleware.ts            # 세션 관리 + Admin 라우트 보호
└── types/
    └── database.ts          # Supabase 타입
```

---

## DB 테이블

| 테이블 | 설명 |
|--------|------|
| `profiles` | 유저 프로필 (role: user/admin) |
| `projects` | 프로젝트 (is_published로 승인 관리) |
| `tech_stacks` | 기술 스택 마스터 데이터 (35개) |
| `project_tech_stacks` | 프로젝트-기술스택 연결 |
| `comments` | 피드백 댓글 |
| `upvotes` | 추천 |
| `waitlist` | 런칭 알림 대기자 |
| `page_views` | 페이지 방문 기록 |
| `admin_audit_logs` | Admin 활동 로그 |

---

## 환경 변수

| 변수 | 용도 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 키 |
| `GMAIL_USER` | Gmail 발송 계정 |
| `GMAIL_APP_PASSWORD` | Gmail 앱 비밀번호 |
