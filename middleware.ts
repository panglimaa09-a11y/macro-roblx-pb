import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Jangan ganggu admin, API, maintenance page, Next.js assets, dan file statis.
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

  try {
    const settingsUrl = new URL("/api/admin/settings", request.url);
    settingsUrl.searchParams.set("_maintenance", Date.now().toString());

    const response = await fetch(settingsUrl, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      return NextResponse.next();
    }

    const data = await response.json();

    if (data?.settings?.maintenance === true) {
      const maintenanceUrl = new URL("/maintenance", request.url);

      return NextResponse.redirect(maintenanceUrl);
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
