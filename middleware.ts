import { NextRequest, NextResponse } from "next/server";

function noStore(response: NextResponse) {
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

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
    return noStore(NextResponse.next());
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
      return noStore(NextResponse.next());
    }

    const data = await response.json();

    if (data?.settings?.maintenance === true) {
      const maintenanceUrl = new URL("/maintenance", request.url);

      return noStore(NextResponse.redirect(maintenanceUrl, 307));
    }
  } catch {
    // Jika pengecekan gagal, jangan mematikan website.
    return noStore(NextResponse.next());
  }

  return noStore(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
