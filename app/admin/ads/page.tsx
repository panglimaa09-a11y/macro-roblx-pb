"use client";

import { useState } from "react";
import { Code2, Eye, EyeOff, Plus, Save } from "lucide-react";

export default function AdsPage() {
  const [network, setNetwork] = useState("Google AdSense");
  const [placement, setPlacement] = useState("Banner");
  const [script, setScript] = useState("<!-- Paste your approved ad-network script here -->");
  const [active, setActive] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <section>
      <div><p className="text-xs uppercase tracking-[.22em] text-cyan-300/60">Monetization</p><h1 className="mt-2 font-outfit text-4xl font-semibold">Ads Manager</h1><p className="mt-2 text-sm text-white/35">Kelola konfigurasi placement iklan secara dinamis.</p></div>

      <div className="mt-7 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className="glass rounded-2xl p-6">
          <div className="mb-6 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10"><Code2 className="h-5 w-5 text-cyan-300" /></div><div><h2 className="font-outfit font-semibold">Ad Configuration</h2><p className="text-xs text-white/30">Approved network script only.</p></div></div>
          <label className="block text-xs text-white/35">Ad Network<select value={network} onChange={e => setNetwork(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm"><option>Google AdSense</option><option>Adsterra</option><option>Custom Network</option></select></label>
          <label className="mt-4 block text-xs text-white/35">Placement<select value={placement} onChange={e => setPlacement(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm"><option>Banner</option><option>Native</option><option>Interstitial</option><option>Pop-under</option></select></label>
          <label className="mt-4 block text-xs text-white/35">Script<textarea value={script} onChange={e => setScript(e.target.value)} rows={9} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-xs text-white/65" /></label>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-white/5 bg-black/10 p-4"><div><div className="text-sm">Status</div><div className="text-xs text-white/25">{active ? "Placement aktif" : "Placement nonaktif"}</div></div><button onClick={() => setActive(!active)} className={`rounded-full px-3 py-1 text-xs ${active ? "bg-cyan-300/10 text-cyan-300" : "bg-white/5 text-white/30"}`}>{active ? "ACTIVE" : "DISABLED"}</button></div>
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1800); }} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950"><Save className="h-4 w-4" /> {saved ? "Saved" : "Save Configuration"}</button>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-outfit font-semibold">Preview</h2>
          <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-5">
            <div className="text-[10px] uppercase tracking-[.2em] text-white/20">Advertisement</div>
            <div className="mt-4 flex h-52 items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-white/20">{placement} • {network}</div>
          </div>
          <div className="mt-5 space-y-3 text-xs text-white/30">
            <p>• Script disimpan server-side pada produksi.</p>
            <p>• Jangan menaruh secret/service-role key di browser.</p>
            <p>• Ikuti kebijakan jaringan iklan terkait klik, redirect, dan interstitial.</p>
          </div>
        </div>
      </div>
    </section>
  );
}