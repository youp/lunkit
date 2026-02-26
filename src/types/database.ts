export type ProjectStage = "idea" | "mvp" | "launched" | "growing";

export type FeedbackPoint =
  | "ux"
  | "business_model"
  | "tech_architecture"
  | "feature_suggestion"
  | "marketing";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  github_url: string | null;
  created_at: string;
}

export interface TechStack {
  id: number;
  name: string;
  slug: string;
  category: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  tagline: string;
  description: string | null;
  demo_url: string | null;
  app_store_url: string | null;
  play_store_url: string | null;
  github_url: string | null;
  thumbnail_url: string | null;
  stage: ProjectStage;
  feedback_points: string[];
  upvote_count: number;
  comment_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  profiles?: Profile;
  tech_stacks?: TechStack[];
}

export interface Comment {
  id: string;
  project_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  feedback_point: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  profiles?: Profile;
}

export const STAGE_MAP: Record<ProjectStage, { label: string; emoji: string; className: string }> = {
  idea: { label: "아이디어", emoji: "💡", className: "stage-idea" },
  mvp: { label: "MVP", emoji: "🧪", className: "stage-mvp" },
  launched: { label: "런칭", emoji: "🚀", className: "stage-launched" },
  growing: { label: "성장 중", emoji: "📈", className: "stage-growing" },
};

export const FEEDBACK_POINT_MAP: Record<string, string> = {
  ux: "UX 개선",
  business_model: "비즈니스 모델",
  tech_architecture: "기술 구조",
  feature_suggestion: "기능 제안",
  marketing: "마케팅 전략",
};
