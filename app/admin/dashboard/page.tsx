import { Activity, ArrowUpRight, Download, Eye, Link2, Wallet } from "lucide-react";

const kpis = [
  ["Total Users", "12,480", "+8.2%", Eye],
  ["Downloads", "8,921", "+12.4%", Download],
  ["Ad Impressions", "25,812", "+18.1%", Activity],
  ["Est. Revenue", "Rp 4,82 jt", "+6.7%", Wallet]
];

export default function Dashboard() {
  return (
    <section>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.22em] text-cyan-300/60">Control Center</p>
        <h1 className="mt-2 font-outfit text-4xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-sm text-white/35">Ringkasan performa Macrro Online.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([title, value, change, Icon]) => {
          const I = Icon as typeof Eye;
          return (
            <div key={title as string} className="glass glass-hover rounded-2xl p-5">
              <div className="flex items-center justify-between"><span className="text-xs text-white/35">{title as string}</span><I className="h-4 w-4 text-cyan-300/60" /></div>
              <div className="mt-5 font-outfit text-2xl font-semibold">{value as string}</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-cyan-300"><ArrowUpRight className="h-3 w-3" />{change as string} <span className="text-white/25">vs previous period</span></div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between"><div><h2 className="font-outfit text-lg font-semibold">Download Analytics</h2><p className="mt-1 text-xs text-white/30">Last 7 days</p></div><Link2 className="h-5 w-5 text-cyan-300/60" /></div>
          <div className="mt-8 flex h-64 items-end gap-3">
            {[42, 58, 49, 73, 64, 86, 71, 92, 77, 96, 84, 100].map((h, i) => (
              <div key={i} className="group flex h-full flex-1 items-end">
                <div className="w-full rounded-t-xl bg-gradient-to-t from-cyan-400/10 to-cyan-300/70 transition group-hover:to-white/80" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-white/20"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-outfit text-lg font-semibold">System Status</h2>
          <div className="mt-5 space-y-3">
            {["Download API", "Supabase", "Ads Engine", "Analytics"].map((name) => (
              <div key={name} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/10 p-4">
                <span className="text-sm text-white/60">{name}</span>
                <span className="flex items-center gap-2 text-xs text-cyan-300"><span className="h-2 w-2 rounded-full bg-cyan-300" />Operational</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}