"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

function getSessionId() {
  const key = "macrro_visitor_session";

  let sessionId = sessionStorage.getItem(key);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }

  return sessionId;
}

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Jangan tracking halaman admin/API.
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    const sessionId = getSessionId();

    console.log("VisitorTracker:", pathname);

    async function trackVisitor() {
      const { error } = await supabase
        .from("visitor_events")
        .insert({
          session_id: sessionId,
          event_type: "page_view",
          page_path: pathname,
          user_agent: navigator.userAgent,
          referer: document.referrer || null,
        });

      if (error) {
        console.error("Visitor tracking error:", error);
      } else {
        console.log("Visitor tracked successfully:", pathname);
      }
    }

    void trackVisitor();
  }, [pathname]);

  return null;
}
