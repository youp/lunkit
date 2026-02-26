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

// ── Track Page View ──

export async function trackPageView(path: string, referrer: string | null) {
  await supabase().from("page_views").insert({
    path,
    referrer: referrer || null,
  });
}
