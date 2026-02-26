-- ============================================================
-- Lunkit MVP — Supabase DB Schema
-- ============================================================
-- 우선순위: 1) 프로젝트 등록  2) 피드백 댓글  3) 기술스택 태깅  4) 유저 인증
-- Supabase Auth를 사용하므로 auth.users 테이블은 자동 생성됨
-- ============================================================

-- ==================
-- 1. PROFILES (유저 프로필)
-- ==================
-- Supabase Auth의 auth.users와 1:1 연결
-- 회원가입 시 trigger로 자동 생성

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- username 검색용 인덱스
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- 회원가입 시 프로필 자동 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==================
-- 2. TECH STACKS (기술 스택 마스터)
-- ==================
-- 태그 선택 방식을 위한 정규화된 기술 스택 목록

CREATE TABLE public.tech_stacks (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,        -- 'React', 'Next.js', 'Supabase' 등
  slug TEXT UNIQUE NOT NULL,        -- 'react', 'nextjs', 'supabase' 등
  category TEXT,                    -- 'frontend', 'backend', 'database', 'infra', 'language' 등
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_tech_stacks_slug ON public.tech_stacks(slug);
CREATE INDEX idx_tech_stacks_category ON public.tech_stacks(category);


-- ==================
-- 3. PROJECTS (프로젝트)
-- ==================

-- 현재 단계 ENUM
CREATE TYPE project_stage AS ENUM ('idea', 'mvp', 'launched', 'growing');

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- 기본 정보
  title TEXT NOT NULL,                          -- 프로젝트명
  tagline TEXT NOT NULL,                        -- 한줄 소개
  description TEXT,                             -- 상세 설명 (마크다운)
  demo_url TEXT,                                -- 데모 링크
  github_url TEXT,                              -- GitHub 링크 (선택)
  thumbnail_url TEXT,                           -- 대표 이미지/스크린샷

  -- 분류
  stage project_stage NOT NULL DEFAULT 'idea',  -- 현재 단계

  -- 피드백 요청 포인트 (복수 선택, JSON 배열)
  -- 예: ["ux", "business_model", "tech_architecture", "feature_suggestion", "marketing"]
  feedback_points TEXT[] DEFAULT '{}',

  -- 통계 (비정규화 — 성능용)
  upvote_count INT DEFAULT 0 NOT NULL,
  comment_count INT DEFAULT 0 NOT NULL,

  -- 메타
  is_published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_stage ON public.projects(stage);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX idx_projects_upvote_count ON public.projects(upvote_count DESC);


-- ==================
-- 4. PROJECT_TECH_STACKS (프로젝트 ↔ 기술스택 다대다)
-- ==================

CREATE TABLE public.project_tech_stacks (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  tech_stack_id INT NOT NULL REFERENCES public.tech_stacks(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tech_stack_id)
);

CREATE INDEX idx_pts_tech_stack_id ON public.project_tech_stacks(tech_stack_id);


-- ==================
-- 5. COMMENTS (피드백 댓글)
-- ==================

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,  -- 대댓글

  body TEXT NOT NULL,

  -- 어떤 피드백 포인트에 대한 댓글인지 (선택)
  -- 예: 'ux', 'business_model', 'tech_architecture'
  feedback_point TEXT,

  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_comments_project_id ON public.comments(project_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);


-- ==================
-- 6. UPVOTES (좋아요)
-- ==================

CREATE TABLE public.upvotes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, project_id)
);

CREATE INDEX idx_upvotes_project_id ON public.upvotes(project_id);


-- ==================
-- 7. WAITLIST (이메일 수집 — 런칭 전 티저용)
-- ==================

CREATE TABLE public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);


-- ==================
-- 8. SEED DATA — 기술 스택 초기 데이터
-- ==================

INSERT INTO public.tech_stacks (name, slug, category) VALUES
  -- Frontend
  ('React', 'react', 'frontend'),
  ('Next.js', 'nextjs', 'frontend'),
  ('Vue', 'vue', 'frontend'),
  ('Svelte', 'svelte', 'frontend'),
  ('Angular', 'angular', 'frontend'),
  ('Tailwind CSS', 'tailwindcss', 'frontend'),
  ('Flutter', 'flutter', 'frontend'),
  ('React Native', 'react-native', 'frontend'),

  -- Backend
  ('Node.js', 'nodejs', 'backend'),
  ('Express', 'express', 'backend'),
  ('FastAPI', 'fastapi', 'backend'),
  ('Django', 'django', 'backend'),
  ('Spring Boot', 'spring-boot', 'backend'),
  ('NestJS', 'nestjs', 'backend'),

  -- Database
  ('PostgreSQL', 'postgresql', 'database'),
  ('MySQL', 'mysql', 'database'),
  ('MongoDB', 'mongodb', 'database'),
  ('Redis', 'redis', 'database'),
  ('Supabase', 'supabase', 'database'),
  ('Firebase', 'firebase', 'database'),

  -- Language
  ('TypeScript', 'typescript', 'language'),
  ('Python', 'python', 'language'),
  ('Go', 'go', 'language'),
  ('Rust', 'rust', 'language'),
  ('Dart', 'dart', 'language'),
  ('Java', 'java', 'language'),
  ('Kotlin', 'kotlin', 'language'),

  -- Infra / DevOps
  ('Docker', 'docker', 'infra'),
  ('AWS', 'aws', 'infra'),
  ('Vercel', 'vercel', 'infra'),
  ('GCP', 'gcp', 'infra'),
  ('Cloudflare', 'cloudflare', 'infra'),

  -- AI / ML
  ('OpenAI API', 'openai-api', 'ai'),
  ('LangChain', 'langchain', 'ai'),
  ('Hugging Face', 'huggingface', 'ai');


-- ==================
-- 9. RLS (Row Level Security) 정책
-- ==================

-- 모든 테이블 RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tech_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Profiles: 누구나 읽기, 본인만 수정
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: 공개된 것 누구나 읽기, 로그인 유저 생성, 본인만 수정/삭제
CREATE POLICY "projects_select" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "projects_insert" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_update" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "projects_delete" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Tech Stacks: 누구나 읽기
CREATE POLICY "tech_stacks_select" ON public.tech_stacks FOR SELECT USING (true);

-- Project Tech Stacks: 누구나 읽기, 프로젝트 소유자만 수정
CREATE POLICY "pts_select" ON public.project_tech_stacks FOR SELECT USING (true);
CREATE POLICY "pts_insert" ON public.project_tech_stacks FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "pts_delete" ON public.project_tech_stacks FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

-- Comments: 누구나 읽기, 로그인 유저 생성, 본인만 수정/삭제
CREATE POLICY "comments_select" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_delete" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Upvotes: 누구나 읽기, 로그인 유저 생성/삭제 (토글)
CREATE POLICY "upvotes_select" ON public.upvotes FOR SELECT USING (true);
CREATE POLICY "upvotes_insert" ON public.upvotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "upvotes_delete" ON public.upvotes FOR DELETE USING (auth.uid() = user_id);

-- Waitlist: 누구나 INSERT (비로그인도 가능), SELECT는 서비스 역할만
CREATE POLICY "waitlist_insert" ON public.waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "waitlist_select" ON public.waitlist FOR SELECT USING (false); -- 관리자만 Supabase 대시보드에서 확인


-- ==================
-- 10. FUNCTIONS — upvote 카운트 동기화
-- ==================

-- upvote 추가 시 카운트 증가
CREATE OR REPLACE FUNCTION public.increment_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.projects SET upvote_count = upvote_count + 1 WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_upvote_insert
  AFTER INSERT ON public.upvotes
  FOR EACH ROW EXECUTE FUNCTION public.increment_upvote_count();

-- upvote 삭제 시 카운트 감소
CREATE OR REPLACE FUNCTION public.decrement_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.projects SET upvote_count = upvote_count - 1 WHERE id = OLD.project_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_upvote_delete
  AFTER DELETE ON public.upvotes
  FOR EACH ROW EXECUTE FUNCTION public.decrement_upvote_count();

-- comment 추가/삭제 시 카운트 동기화
CREATE OR REPLACE FUNCTION public.increment_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.projects SET comment_count = comment_count + 1 WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_insert
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.increment_comment_count();

CREATE OR REPLACE FUNCTION public.decrement_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.projects SET comment_count = comment_count - 1 WHERE id = OLD.project_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_delete
  AFTER DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.decrement_comment_count();


-- ==================
-- 11. updated_at 자동 갱신
-- ==================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_comments
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
