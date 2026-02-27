import { createClient } from "./client";

const supabase = () => createClient();

// ── Admin Check ──

export async function checkIsAdmin(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase().auth.getUser();
  if (!user) return false;

  const { data } = await supabase()
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return data?.role === "admin";
}

// ── Dashboard Stats ──

export async function fetchAdminStats() {
  const [projects, profiles, waitlist, pageViews, todayViews] =
    await Promise.all([
      supabase().from("projects").select("id", { count: "exact", head: true }),
      supabase().from("profiles").select("id", { count: "exact", head: true }),
      supabase().from("waitlist").select("id", { count: "exact", head: true }),
      supabase()
        .from("page_views")
        .select("id", { count: "exact", head: true }),
      supabase()
        .from("page_views")
        .select("id", { count: "exact", head: true })
        .gte("created_at", new Date().toISOString().split("T")[0]),
    ]);

  return {
    projectCount: projects.count ?? 0,
    userCount: profiles.count ?? 0,
    waitlistCount: waitlist.count ?? 0,
    totalPageViews: pageViews.count ?? 0,
    todayPageViews: todayViews.count ?? 0,
  };
}

// ── Waitlist ──

export async function fetchWaitlist() {
  const { data, error } = await supabase()
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// ── Page Views (recent paths) ──

export async function fetchRecentPageViews() {
  const { data, error } = await supabase()
    .from("page_views")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data ?? [];
}

// ── Project Management ──

export async function fetchAllProjects() {
  const { data, error } = await supabase()
    .from("projects")
    .select(
      "id, title, tagline, stage, is_published, created_at, profiles!projects_user_id_fkey(username, display_name, avatar_url), tech_stacks(name)"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function deleteProject(id: string) {
  const { error } = await supabase().from("projects").delete().eq("id", id);
  if (error) throw error;
}

// ── Project Approval ──

export async function fetchPendingProjects() {
  const { data, error } = await supabase()
    .from("projects")
    .select(
      "id, title, tagline, stage, created_at, profiles!projects_user_id_fkey(username, display_name, avatar_url), tech_stacks(name)"
    )
    .eq("is_published", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function approveProject(id: string) {
  const { error } = await supabase()
    .from("projects")
    .update({ is_published: true })
    .eq("id", id);

  if (error) throw error;
}

export async function rejectProject(id: string) {
  const { error } = await supabase().from("projects").delete().eq("id", id);

  if (error) throw error;
}

// ── Daily Page Views (aggregated) ──

export async function fetchDailyPageViews(days: number = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase()
    .from("page_views")
    .select("created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  if (error) throw error;

  // 날짜별 집계
  const counts: Record<string, number> = {};

  // 빈 날짜도 0으로 채우기
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const key = d.toISOString().split("T")[0];
    counts[key] = 0;
  }

  (data ?? []).forEach((row) => {
    const key = new Date(row.created_at).toISOString().split("T")[0];
    counts[key] = (counts[key] ?? 0) + 1;
  });

  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

// ── Track Page View ──

export async function trackPageView(path: string, referrer: string | null) {
  await supabase().from("page_views").insert({
    path,
    referrer: referrer || null,
  });
}
