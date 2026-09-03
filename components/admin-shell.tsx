"use client";

import Link from "next/link";
import { BarChart3, ExternalLink, FileKey2, LayoutDashboard, LogOut, Megaphone, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const items = [
  ["/admin/dashboard", "Dashboard", LayoutDashboard],
  ["/admin/links", "Links", FileKey2],
  ["/admin/ads", "Ads Manager", Megaphone],
  ["/admin/analytics", "Analytics", BarChart3],
  ["/admin/settings", "Settings", Settings]
] as const;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("macrro_admin_demo");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#08090e] text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-black/20 p-5 backdrop-blur-xl lg:block">
        <Link href="/" className="font-outfit text-lg font-semibold tracking-[.2em]">MACRRO<span className="text-cyan-300">.</span></Link>
        <div className="mt-10 space-y-1">
          {items.map(([href, label, Icon]) => (
            <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${pathname === href ? "bg-cyan-300/10 text-cyan-200" : "text-white/40 hover:bg-white/5 hover:text-white"}`}>
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </div>
        <div className="absolute bottom-5 left-5 right-5 space-y-2">
          <Link href="/download" className="flex items-center gap-3 rounded-xl px-3 py-3 text-xs text-white/35 hover:bg-white/5 hover:text-white"><ExternalLink className="h-4 w-4" /> User Download</Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs text-white/35 hover:bg-white/5 hover:text-white"><LogOut className="h-4 w-4" /> Logout</button>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-64">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link href="/" className="font-outfit font-semibold tracking-[.2em]">MACRRO<span className="text-cyan-300">.</span></Link>
            <button onClick={logout} className="text-xs text-white/40">Logout</button>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}