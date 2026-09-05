import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Jangan ganggu admin, API, Next.js assets, dan file statis.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/ads.txt"
  ) {
    return NextResponse.next();
  }

  try {
    const settingsUrl = new URL("/api/admin/settings", request.url);
    settingsUrl.searchParams.set("_maintenance", Date.now().toString());

    const response = await fetch(settingsUrl, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, max-age=0",
      },
    });

    if (!response.ok) {
      return NextResponse.next();
    }

    const data = await response.json();
    const maintenance = data?.settings?.maintenance === true;

    // Saat maintenance OFF tetapi browser masih berada di /maintenance,
    // langsung kembalikan pengguna ke dashboard/home.
    if (pathname === "/maintenance") {
      if (!maintenance) {
        const dashboardUrl = new URL("/", request.url);
        const redirectResponse = NextResponse.redirect(dashboardUrl, 307);
        redirectResponse.headers.set("Cache-Control", "no-store, no-cache, max-age=0, must-revalidate");
        return redirectResponse;
      }

      return NextResponse.next();
    }

    // Saat maintenance ON, semua halaman publik diarahkan ke maintenance.
    if (maintenance) {
      const maintenanceUrl = new URL("/maintenance", request.url);
      const redirectResponse = NextResponse.redirect(maintenanceUrl, 307);
      redirectResponse.headers.set("Cache-Control", "no-store, no-cache, max-age=0, must-revalidate");
      return redirectResponse;
    }
  } catch {
    // Jika pengecekan gagal, jangan mematikan website.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
