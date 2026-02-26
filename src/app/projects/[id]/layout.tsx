import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = "https://lunkit.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("title, tagline")
    .eq("id", id)
    .single();

  if (!project) {
    return { title: "프로젝트를 찾을 수 없습니다" };
  }

  return {
    title: project.title,
    description: project.tagline,
    openGraph: {
      title: `${project.title} | Lunkit`,
      description: project.tagline,
      url: `${SITE_URL}/projects/${id}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${project.title} | Lunkit`,
      description: project.tagline,
    },
    alternates: {
      canonical: `${SITE_URL}/projects/${id}`,
    },
  };
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
