"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/supabase/admin-queries";

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname, document.referrer || null);
  }, [pathname]);

  return null;
}
