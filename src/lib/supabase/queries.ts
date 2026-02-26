import { createClient } from "./client";
import type { Project, Comment, TechStack } from "@/types/database";

const supabase = () => createClient();

// ── Projects ──

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase()
    .from("projects")
    .select(
      "*, profiles!projects_user_id_fkey(id, username, display_name, avatar_url), project_tech_stacks(tech_stacks(id, name, slug, category))"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(mapProject);
}

export async function fetchProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase()
    .from("projects")
    .select(
      "*, profiles!projects_user_id_fkey(id, username, display_name, avatar_url), project_tech_stacks(tech_stacks(id, name, slug, category))"
    )
    .eq("id", id)
    .single();

  if (error) return null;
  return mapProject(data);
}

export async function createProject(params: {
  title: string;
  tagline: string;
  description: string;
  demo_url: string;
  app_store_url: string;
  play_store_url: string;
  github_url: string;
  stage: string;
  feedback_points: string[];
  tech_stack_ids: number[];
}) {
  const { data: { user } } = await supabase().auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다");

  const { data: project, error } = await supabase()
    .from("projects")
    .insert({
      user_id: user.id,
      title: params.title,
      tagline: params.tagline,
      description: params.description || null,
      demo_url: params.demo_url || null,
      app_store_url: params.app_store_url || null,
      play_store_url: params.play_store_url || null,
      github_url: params.github_url || null,
      stage: params.stage,
      feedback_points: params.feedback_points,
    })
    .select()
    .single();

  if (error) throw error;

  // Insert tech stacks
  if (params.tech_stack_ids.length > 0) {
    const { error: techError } = await supabase()
      .from("project_tech_stacks")
      .insert(
        params.tech_stack_ids.map((tech_stack_id) => ({
          project_id: project.id,
          tech_stack_id,
        }))
      );
    if (techError) throw techError;
  }

  return project;
}

// ── Tech Stacks ──

export async function fetchTechStacks(): Promise<TechStack[]> {
  const { data, error } = await supabase()
    .from("tech_stacks")
    .select("*")
    .order("category")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

// ── Comments ──

export async function fetchComments(projectId: string): Promise<Comment[]> {
  const { data, error } = await supabase()
    .from("comments")
    .select("*, profiles!comments_user_id_fkey(id, username, display_name, avatar_url)")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createComment(params: {
  project_id: string;
  body: string;
  feedback_point: string | null;
  parent_id?: string | null;
}) {
  const { data: { user } } = await supabase().auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다");

  const { data, error } = await supabase()
    .from("comments")
    .insert({
      project_id: params.project_id,
      user_id: user.id,
      body: params.body,
      feedback_point: params.feedback_point || null,
      parent_id: params.parent_id || null,
    })
    .select("*, profiles!comments_user_id_fkey(id, username, display_name, avatar_url)")
    .single();

  if (error) throw error;
  return data;
}

// ── Upvotes ──

export async function toggleUpvote(projectId: string): Promise<boolean> {
  const { data: { user } } = await supabase().auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다");

  // Check if already upvoted
  const { data: existing } = await supabase()
    .from("upvotes")
    .select()
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .single();

  if (existing) {
    await supabase()
      .from("upvotes")
      .delete()
      .eq("user_id", user.id)
      .eq("project_id", projectId);
    return false; // removed
  } else {
    await supabase()
      .from("upvotes")
      .insert({ user_id: user.id, project_id: projectId });
    return true; // added
  }
}

export async function checkUpvoted(projectId: string): Promise<boolean> {
  const { data: { user } } = await supabase().auth.getUser();
  if (!user) return false;

  const { data } = await supabase()
    .from("upvotes")
    .select()
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .single();

  return !!data;
}

// ── Helpers ──

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProject(row: any): Project {
  const techStacks =
    row.project_tech_stacks?.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (pts: any) => pts.tech_stacks
    ) ?? [];

  return {
    ...row,
    tech_stacks: techStacks,
    project_tech_stacks: undefined,
  };
}
