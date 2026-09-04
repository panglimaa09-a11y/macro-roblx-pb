"use client";

import { useEffect, useState } from "react";
import { Save, Settings2, ShieldCheck, Timer, Megaphone, Wrench } from "lucide-react";

type Settings = {
  countdown: string;
  expiry: string;
  ads: boolean;
  maintenance: boolean;
  maintenanceMessage: string;
};

const defaults: Settings = {
  countdown: "5",
  expiry: "10",
  ads: true,
  maintenance: false,
  maintenanceMessage: "Website sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi.",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.settings) setSettings({ ...defaults, ...data.settings });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  async function saveSettings() {
    setSaved(false);

    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      alert("Gagal menyimpan pengaturan.");
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <section>
      <p className="text-xs uppercase tracking-[.22em] text-cyan-300/60">
        Configuration
      </p>

      <h1 className="mt-2 font-outfit text-4xl font-semibold">
        Settings
      </h1>

      <p className="mt-2 text-sm text-white/35">
        Pengaturan global platform Macro Online.
      </p>

      {loading ? (
        <div className="glass mt-7 max-w-3xl rounded-2xl p-6 text-sm text-white/40">
          Memuat konfigurasi...
        </div>
      ) : (
        <div className="mt-7 max-w-3xl space-y-5">

          {/* DOWNLOAD */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Timer className="h-5 w-5 text-cyan-300" />
              <div>
                <h2 className="text-lg font-semibold">Download & Ads</h2>
                <p className="text-xs text-white/30">
                  Mengatur proses sebelum file dapat diunduh.
                </p>
              </div>
            </div>

            <label className="mt-5 block text-xs text-white/40">
              Countdown duration (seconds)
              <input
                value={settings.countdown}
                onChange={(e) => update("countdown", e.target.value)}
                type="number"
                min="1"
                max="30"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm"
              />
            </label>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-white/5 bg-black/10 p-4">
              <div>
                <div className="text-sm">Ads enabled</div>
                <div className="text-xs text-white/25">
                  Aktifkan atau nonaktifkan modul monetisasi.
                </div>
              </div>

              <button
                onClick={() => update("ads", !settings.ads)}
                className={`rounded-full px-3 py-1 text-xs ${
                  settings.ads
                    ? "bg-cyan-300/10 text-cyan-300"
                    : "bg-white/5 text-white/30"
                }`}
              >
                {settings.ads ? "ENABLED" : "DISABLED"}
              </button>
            </div>
          </div>

          {/* TOKEN */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-cyan-300" />
              <div>
                <h2 className="text-lg font-semibold">Token</h2>
                <p className="text-xs text-white/30">
                  Mengatur masa berlaku sesi/token download.
                </p>
              </div>
            </div>

            <label className="mt-5 block text-xs text-white/40">
              Token expiration (minutes)
              <input
                value={settings.expiry}
                onChange={(e) => update("expiry", e.target.value)}
                type="number"
                min="1"
                max="60"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm"
              />
            </label>
          </div>

          {/* SYSTEM */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Wrench className="h-5 w-5 text-cyan-300" />
              <div>
                <h2 className="text-lg font-semibold">System</h2>
                <p className="text-xs text-white/30">
                  Pengaturan operasional platform.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-white/5 bg-black/10 p-4">
              <div>
                <div className="text-sm">Maintenance mode</div>
                <div className="text-xs text-white/25">
                  Menonaktifkan akses publik saat maintenance.
                </div>
              </div>

              <button
                onClick={() => update("maintenance", !settings.maintenance)}
                className={`rounded-full px-3 py-1 text-xs ${
                  settings.maintenance
                    ? "bg-red-400/10 text-red-300"
                    : "bg-white/5 text-white/30"
                }`}
              >
                {settings.maintenance ? "ON" : "OFF"}
              </button>
            </div>

            <label className="mt-5 block text-xs text-white/40">
              Maintenance message
              <textarea
                value={settings.maintenanceMessage}
                onChange={(e) =>
                  update("maintenanceMessage", e.target.value)
                }
                rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm"
              />
            </label>
          </div>

          {/* SAVE */}
          <div className="glass flex items-center justify-between rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <Settings2 className="h-5 w-5 text-cyan-300" />
              <div>
                <div className="text-sm font-medium">
                  Platform configuration
                </div>
                <div className="text-xs text-white/25">
                  Pengaturan disimpan ke database.
                </div>
              </div>
            </div>

            <button
              onClick={saveSettings}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950"
            >
              <Save className="h-4 w-4" />
              {saved ? "Saved" : "Save Settings"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
