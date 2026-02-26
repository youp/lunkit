# Lunkit — Claude Code 핸드오프 문서

## 프로젝트 개요
- **프로젝트명:** Lunkit (launch + kit)
- **한줄 정의:** 사이드 프로젝트 빌더들이 프로젝트를 등록하고 동료 개발자에게 피드백을 받는 쇼케이스 플랫폼
- **타겟:** 인디 메이커 / 사이드 프로젝트 개발자
- **방향:** 한국판 Product Hunt, MVP는 극도로 가볍게

## 기술 스택
- **프론트엔드:** Next.js
- **백엔드/DB:** Supabase (Auth + DB + Storage)
- **배포:** Vercel
- **목표:** 2주 내 런칭

## MVP 기능 우선순위
1. **프로젝트 등록** (폼 + 상세 페이지)
2. **피드백 댓글 시스템** (피드백 포인트별 구조화된 댓글)
3. **기술 스택 태깅 + 필터링**
4. **유저 인증** (Supabase Auth 로그인/회원가입)

## 완료된 산출물
1. **lunkit-landing.html** — 티저 랜딩 페이지 (Next.js로 포팅 필요)
   - 다크/라이트 토글
   - 이메일 수집 폼 (Supabase waitlist 테이블 연동 필요)
   - 시드 프로젝트 피드 섹션 (더미 6개)
   - Features, How it works, Stack tags, CTA 섹션
   - 모바일 반응형

2. **lunkit-schema.sql** — Supabase DB 스키마 (SQL Editor에 바로 실행 가능)
   - profiles, projects, tech_stacks, project_tech_stacks, comments, upvotes, waitlist
   - RLS 정책 전부 설정
   - Trigger: 프로필 자동생성, upvote/comment 카운트 동기화, updated_at 자동갱신
   - 기술 스택 시드 데이터 35개 포함

## 다음 작업 (Claude Code에서 진행)
1. Next.js 프로젝트 초기 세팅 (`create-next-app`)
2. Supabase 프로젝트 연동 (@supabase/supabase-js)
3. 랜딩 페이지 Next.js로 포팅
4. 프로젝트 등록 폼 + 상세 페이지 구현
5. 피드백 댓글 시스템
6. 기술 스택 태깅/필터링
7. Supabase Auth 연동

## 디자인 결정
- **테마:** 다크/라이트 토글 지원
- **폰트:** Outfit (display) + Noto Sans KR (body)
- **액센트 컬러:** #6c5ce7 (보라)
- **언어:** 한국어 only
- **분위기:** 개발자 감성, 클린하면서 세련된 느낌

## 시드 콘텐츠 전략
- 본인 사이드 프로젝트 2~3개 (Kidlio 등, 내부 아키텍처는 비공개)
- GitHub 트렌딩에서 한국 개발자 프로젝트 발굴
- 프로젝트 소개 + 기술 스택 + 피드백 요청 포인트만 등록

## 프로젝트 등록 시 입력 항목
| 항목 | 설명 |
|------|------|
| 한줄 소개 (tagline) | 어떤 문제를 풀려고 만들었는지 |
| 데모 링크 / 스크린샷 | 서비스를 바로 볼 수 있는 링크 또는 이미지 |
| 기술 스택 | 태그 선택 방식 |
| 현재 단계 | 아이디어 / MVP / 런칭 / 성장 중 |
| 피드백 요청 포인트 | UX, 비즈니스 모델, 기술 구조, 기능 제안, 마케팅 등 |

## 제외 항목 (MVP 이후)
- Kafka, Elasticsearch
- AI 자동화 (Gemini API)
- MCP 적용
- 리워드/뱃지 시스템
- 기술 큐레이션 통계
