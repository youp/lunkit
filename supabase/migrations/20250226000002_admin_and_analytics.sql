-- 1. profiles에 role 컬럼 추가
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' NOT NULL;

-- 2. youp 계정을 admin으로 설정
UPDATE public.profiles SET role = 'admin' WHERE username = 'youp';

-- 3. page_views 테이블 (방문자 추적)
CREATE TABLE IF NOT EXISTS public.page_views (
  id BIGSERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(path);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_views_insert" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "page_views_select" ON public.page_views FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. waitlist SELECT 정책 변경 (admin 읽기 허용)
DROP POLICY IF EXISTS "waitlist_select" ON public.waitlist;
CREATE POLICY "waitlist_select" ON public.waitlist FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
