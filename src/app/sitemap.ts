import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = "https://lunkit.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, updated_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const projectUrls: MetadataRoute.Sitemap = (projects ?? []).map((p) => ({
    url: `${SITE_URL}/projects/${p.id}`,
    lastModified: p.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...projectUrls,
  ];
}
