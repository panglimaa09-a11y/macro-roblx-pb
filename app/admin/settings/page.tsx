"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const [countdown, setCountdown] = useState("5");
  const [expiry, setExpiry] = useState("10");
  const [ads, setAds] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <section>
      <p className="text-xs uppercase tracking-[.22em] text-cyan-300/60">Configuration</p>
      <h1 className="mt-2 font-outfit text-4xl font-semibold">Settings</h1>
      <p className="mt-2 text-sm text-white/35">Pengaturan global platform.</p>
      <div className="glass mt-7 max-w-3xl rounded-2xl p-6">
        <label className="block text-xs text-white/35">Countdown duration (seconds)<input value={countdown} onChange={e=>setCountdown(e.target.value)} type="number" min="1" max="30" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm" /></label>
        <label className="mt-5 block text-xs text-white/35">Token expiration (minutes)<input value={expiry} onChange={e=>setExpiry(e.target.value)} type="number" min="1" max="60" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm" /></label>
        <div className="mt-5 flex items-center justify-between rounded-xl border border-white/5 bg-black/10 p-4"><div><div className="text-sm">Ads enabled</div><div className="text-xs text-white/25">Aktifkan modul monetisasi.</div></div><button onClick={()=>setAds(!ads)} className={`rounded-full px-3 py-1 text-xs ${ads ? "bg-cyan-300/10 text-cyan-300" : "bg-white/5 text-white/30"}`}>{ads ? "ENABLED" : "DISABLED"}</button></div>
        <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),1800)}} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950"><Save className="h-4 w-4"/>{saved ? "Saved" : "Save Settings"}</button>
      </div>
    </section>
  );
}