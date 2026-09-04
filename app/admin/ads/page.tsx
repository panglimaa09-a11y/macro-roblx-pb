"use client";

import { useEffect, useState } from "react";
import { Code2, Save } from "lucide-react";

type AdsConfig = {
  network: string;
  placement: string;
  script: string;
  active: boolean;
};

const defaults: AdsConfig = {
  network: "Google AdSense",
  placement: "Banner",
  script: "",
  active: true,
};

export default function AdsPage() {
  const [network, setNetwork] = useState(defaults.network);
  const [placement, setPlacement] = useState(defaults.placement);
  const [script, setScript] = useState(defaults.script);
  const [active, setActive] = useState(defaults.active);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadAds();
  }, []);

  async function loadAds() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/ads?t=" + Date.now(),
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Gagal membaca konfigurasi iklan."
        );
      }

      const ads = data?.ads;

      setNetwork(ads?.network || defaults.network);
      setPlacement(ads?.placement || defaults.placement);
      setScript(ads?.script || "");
      setActive(ads?.active !== false);
    } catch (err) {
      console.error("Ads Manager GET error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Gagal membaca konfigurasi iklan."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveConfiguration() {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const response = await fetch("/api/admin/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          network,
          placement,
          script,
          active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Gagal menyimpan konfigurasi iklan."
        );
      }

      const ads = data?.ads;

      setNetwork(ads?.network || network);
      setPlacement(ads?.placement || placement);
      setScript(ads?.script || script);
      setActive(ads?.active !== false);

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 1800);
    } catch (err) {
      console.error("Ads Manager POST error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan konfigurasi iklan."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <div>
        <p className="text-xs uppercase tracking-[.22em] text-cyan-300/60">
          Monetization
        </p>

        <h1 className="mt-2 font-outfit text-4xl font-semibold">
          Ads Manager
        </h1>

        <p className="mt-2 text-sm text-white/35">
          Kelola konfigurasi placement iklan secara dinamis.
        </p>
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className="glass rounded-2xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10">
              <Code2 className="h-5 w-5 text-cyan-300" />
            </div>

            <div>
              <h2 className="font-outfit font-semibold">
                Ad Configuration
              </h2>

              <p className="text-xs text-white/30">
                Approved network script only.
              </p>
            </div>
          </div>

          <label className="block text-xs text-white/35">
            Ad Network

            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              disabled={loading || saving}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm"
            >
              <option>Google AdSense</option>
              <option>Adsterra</option>
              <option>Custom Network</option>
            </select>
          </label>

          <label className="mt-4 block text-xs text-white/35">
            Placement

            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value)}
              disabled={loading || saving}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm"
            >
              <option>Banner</option>
              <option>Native</option>
              <option>Interstitial</option>
              <option>Pop-under</option>
            </select>
          </label>

          <label className="mt-4 block text-xs text-white/35">
            Script

            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              disabled={loading || saving}
              rows={9}
              placeholder="Paste your approved ad-network script here"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-xs text-white/65"
            />
          </label>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-white/5 bg-black/10 p-4">
            <div>
              <div className="text-sm">
                Status
              </div>

              <div className="text-xs text-white/25">
                {active
                  ? "Placement aktif"
                  : "Placement nonaktif"}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActive(!active)}
              disabled={loading || saving}
              className={`rounded-full px-3 py-1 text-xs ${
                active
                  ? "bg-cyan-300/10 text-cyan-300"
                  : "bg-white/5 text-white/30"
              }`}
            >
              {active ? "ACTIVE" : "DISABLED"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-xs text-red-300">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={saveConfiguration}
            disabled={loading || saving}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />

            {saving
              ? "Saving..."
              : saved
                ? "Saved"
                : "Save Configuration"}
          </button>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-outfit font-semibold">
            Preview
          </h2>

          <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-5">
            <div className="text-[10px] uppercase tracking-[.2em] text-white/20">
              Advertisement
            </div>

            <div className="mt-4 flex h-52 items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-white/20">
              {placement} • {network}
            </div>
          </div>

          <div className="mt-5 space-y-3 text-xs text-white/30">
            <p>
              • Script disimpan server-side pada produksi.
            </p>

            <p>
              • Jangan menaruh secret/service-role key di browser.
            </p>

            <p>
              • Ikuti kebijakan jaringan iklan terkait klik, redirect, dan interstitial.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
