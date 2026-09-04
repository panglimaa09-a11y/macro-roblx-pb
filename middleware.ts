import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Jangan ganggu admin, API, halaman maintenance, Next.js assets, dan file statis.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname === "/maintenance" ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/ads.txt"
  ) {
    return NextResponse.next();
  }

  // Jika environment Supabase belum tersedia, fail-open agar website tidak terkunci.
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.next();
  }

  try {
    // Baca status maintenance langsung dari Supabase.
    // Sengaja tidak melalui /api/admin/settings agar middleware tidak bergantung
    // pada cache/API internal dan perubahan ON/OFF dapat terbaca pada request berikutnya.
    const settingsUrl = new URL(
      "/rest/v1/site_settings?setting_key=eq.site&select=setting_value",
      SUPABASE_URL
    );
    settingsUrl.searchParams.set("_maintenance", Date.now().toString());

    const response = await fetch(settingsUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Cache-Control": "no-cache, no-store, max-age=0",
      },
    });

    if (!response.ok) {
      return NextResponse.next();
    }

    const rows = await response.json();
    const settingValue = Array.isArray(rows) ? rows[0]?.setting_value : null;
    const maintenance = settingValue?.maintenance === true;

    if (maintenance) {
      const maintenanceUrl = new URL("/maintenance", request.url);
      const redirectResponse = NextResponse.redirect(maintenanceUrl, 307);

      // Jangan biarkan browser/CDN menyimpan redirect maintenance.
      redirectResponse.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      redirectResponse.headers.set("Pragma", "no-cache");
      redirectResponse.headers.set("Expires", "0");

      return redirectResponse;
    }
  } catch {
    // Jika pengecekan gagal, fail-open agar website tetap bisa diakses.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
