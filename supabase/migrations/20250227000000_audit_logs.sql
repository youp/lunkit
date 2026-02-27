-- ── Admin Audit Logs ──
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action     text NOT NULL,          -- 'approve_project', 'reject_project', 'delete_project', 'send_email'
  target_id  text,                   -- 대상 리소스 ID (프로젝트 ID 등)
  details    jsonb DEFAULT '{}'::jsonb, -- 추가 정보 (프로젝트 제목, 이메일 발송 수 등)
  created_at timestamptz DEFAULT now()
);

-- RLS 활성화
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 관리자만 조회 가능
CREATE POLICY "audit_logs_select" ON public.admin_audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 인증된 사용자 INSERT (서버에서 admin 확인 후 삽입)
CREATE POLICY "audit_logs_insert" ON public.admin_audit_logs
  FOR INSERT WITH CHECK (auth.uid() = admin_id);

-- 인덱스
CREATE INDEX idx_audit_logs_created_at ON public.admin_audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_action ON public.admin_audit_logs (action);
