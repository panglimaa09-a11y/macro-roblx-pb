import { BarChart3, MousePointerClick, TrendingUp, Users } from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    ["Visitors", "18,492", Users],
    ["Downloads", "8,921", TrendingUp],
    ["Ad Impressions", "25,812", BarChart3],
    ["Ad Clicks", "1,284", MousePointerClick]
  ];
  return (
    <section>
      <p className="text-xs uppercase tracking-[.22em] text-cyan-300/60">Insights</p>
      <h1 className="mt-2 font-outfit text-4xl font-semibold">Analytics</h1>
      <p className="mt-2 text-sm text-white/35">Monitoring traffic, sessions, ads and estimated performance.</p>
      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([name, value, Icon]) => { const I = Icon as typeof Users; return <div key={name as string} className="glass rounded-2xl p-5"><I className="h-5 w-5 text-cyan-300/70" /><div className="mt-5 text-xs text-white/35">{name as string}</div><div className="mt-1 font-outfit text-2xl font-semibold">{value as string}</div></div>; })}
      </div>
      <div className="glass mt-5 rounded-2xl p-6">
        <div className="flex items-center justify-between"><div><h2 className="font-outfit text-lg font-semibold">Traffic Overview</h2><p className="mt-1 text-xs text-white/30">Illustrative data until Supabase analytics is connected.</p></div><select className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs"><option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option></select></div>
        <div className="mt-8 grid h-72 grid-cols-7 items-end gap-3">{[48,62,53,76,68,90,80].map((h,i)=><div key={i} className="h-full rounded-xl bg-white/[.03] p-1"><div className="h-full rounded-lg bg-gradient-to-t from-violet-400/10 to-cyan-300/65" style={{height:`${h}%`, marginTop:`${100-h}%`}} /></div>)}</div>
      </div>
    </section>
  );
}