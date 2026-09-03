"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Download,
  Eye,
  Link2,
  Loader2,
  Wallet,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type AnalyticsRow = {
  download_date: string;
  total_downloads: number;
};

type Kpi = {
  title: string;
  value: string;
  change: string;
  available: boolean;
  icon: typeof Eye;
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [analytics, setAnalytics] = useState<AnalyticsRow[]>([]);
  const [supabaseOk, setSupabaseOk] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [
        usersResult,
        downloadsResult,
        analyticsResult,
      ] = await Promise.all([
        supabase.rpc("get_total_users"),

        supabase
          .from("downloads")
          .select("downloads"),

        supabase.rpc("get_download_analytics"),
      ]);

      if (usersResult.error) {
        throw new Error(
          `Total Users: ${usersResult.error.message}`
        );
      }

      if (downloadsResult.error) {
        throw new Error(
          `Downloads: ${downloadsResult.error.message}`
        );
      }

      if (analyticsResult.error) {
        throw new Error(
          `Analytics: ${analyticsResult.error.message}`
        );
      }

      const totalUsers = Number(usersResult.data ?? 0);

      const totalDownloads = (downloadsResult.data ?? []).reduce(
        (total, item) => total + Number(item.downloads ?? 0),
        0
      );

      setUsers(totalUsers);
      setDownloads(totalDownloads);
      setAnalytics(analyticsResult.data ?? []);
      setSupabaseOk(true);
    } catch (err) {
      console.error("Dashboard error:", err);
      setSupabaseOk(false);
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data Dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  const chartData = useMemo(() => {
    const today = new Date();
    const result: {
      date: string;
      label: string;
      value: number;
    }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const iso = date.toISOString().slice(0, 10);

      const found = analytics.find(
        (item) => item.download_date === iso
      );

      result.push({
        date: iso,
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        value: Number(found?.total_downloads ?? 0),
      });
    }

    return result;
  }, [analytics]);

  const maxDownloads = Math.max(
    ...chartData.map((item) => item.value),
    1
  );

  const kpis: Kpi[] = [
    {
      title: "Total Users",
      value: users.toLocaleString("id-ID"),
      change: "Live",
      available: true,
      icon: Eye,
    },
    {
      title: "Downloads",
      value: downloads.toLocaleString("id-ID"),
      change: "Live",
      available: true,
      icon: Download,
    },
    {
      title: "Ad Impressions",
      value: "—",
      change: "Not configured",
      available: false,
      icon: Activity,
    },
    {
      title: "Est. Revenue",
      value: "—",
      change: "Not configured",
      available: false,
      icon: Wallet,
    },
  ];

  return (
    <section>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.22em] text-cyan-300/60">
          Control Center
        </p>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="mt-2 font-outfit text-4xl font-semibold">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-white/35">
              Ringkasan performa Macrro Online.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60 transition hover:bg-white/10 disabled:opacity-50"
          >
            {loading && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            Refresh Data
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3">
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ title, value, change, available, icon: Icon }) => (
          <div
            key={title}
            className="glass glass-hover rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/35">
                {title}
              </span>

              <Icon className="h-4 w-4 text-cyan-300/60" />
            </div>

            <div className="mt-5 font-outfit text-2xl font-semibold">
              {loading && available ? (
                <span className="text-white/30">...</span>
              ) : (
                value
              )}
            </div>

            <div
              className={`mt-2 flex items-center gap-1 text-xs ${
                available
                  ? "text-cyan-300"
                  : "text-white/25"
              }`}
            >
              {available && (
                <ArrowUpRight className="h-3 w-3" />
              )}

              {change}

              {available && (
                <span className="text-white/25">
                  database
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-outfit text-lg font-semibold">
                Download Analytics
              </h2>

              <p className="mt-1 text-xs text-white/30">
                Last 7 days · Real download logs
              </p>
            </div>

            <Link2 className="h-5 w-5 text-cyan-300/60" />
          </div>

          <div className="mt-8 flex h-64 items-end gap-3">
            {chartData.map((item) => {
              const height =
                item.value === 0
                  ? 3
                  : Math.max(
                      (item.value / maxDownloads) * 100,
                      8
                    );

              return (
                <div
                  key={item.date}
                  className="group flex h-full flex-1 items-end"
                  title={`${item.label}: ${item.value} downloads`}
                >
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-cyan-400/10 to-cyan-300/70 transition group-hover:to-white/80"
                    style={{
                      height: `${height}%`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex justify-between text-[10px] text-white/20">
            {chartData.map((item) => (
              <span key={item.date}>
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-outfit text-lg font-semibold">
            System Status
          </h2>

          <div className="mt-5 space-y-3">
            <StatusRow
              name="Supabase"
              operational={supabaseOk}
            />

            <StatusRow
              name="Downloads Database"
              operational={supabaseOk}
            />

            <StatusRow
              name="Analytics"
              operational={supabaseOk}
            />

            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/10 p-4">
              <span className="text-sm text-white/60">
                Ads Engine
              </span>

              <span className="text-xs text-amber-300">
                Not configured
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusRow({
  name,
  operational,
}: {
  name: string;
  operational: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/10 p-4">
      <span className="text-sm text-white/60">
        {name}
      </span>

      <span
        className={`flex items-center gap-2 text-xs ${
          operational
            ? "text-cyan-300"
            : "text-red-300"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            operational
              ? "bg-cyan-300"
              : "bg-red-300"
          }`}
        />

        {operational
          ? "Operational"
          : "Error"}
      </span>
    </div>
  );
}
