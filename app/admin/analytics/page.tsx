"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Download,
  Eye,
  RefreshCw,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type RangeDays = 7 | 30 | 90;

type VisitorRow = {
  visitor_date: string;
  unique_visitors: number;
  page_views: number;
};

type VisitorEvent = {
  session_id: string;
  event_type: string;
  created_at: string;
};

type DownloadRow = {
  download_date: string;
  total_downloads: number;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function buildDateRange(days: number) {
  const result: string[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    result.push(getDateKey(date));
  }

  return result;
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<RangeDays>(7);

  const [visitorRows, setVisitorRows] = useState<VisitorRow[]>([]);
  const [visitorEvents, setVisitorEvents] = useState<VisitorEvent[]>([]);
  const [downloadRows, setDownloadRows] = useState<DownloadRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - (range - 1));

      const startIso = startDate.toISOString();

      const [
        visitorAnalyticsResult,
        visitorEventsResult,
        downloadAnalyticsResult,
      ] = await Promise.all([
        supabase.rpc("get_visitor_analytics", {
          days_back: range,
        }),

        supabase
          .from("visitor_events")
          .select("session_id,event_type,created_at")
          .gte("created_at", startIso),

        supabase.rpc("get_download_analytics_range", {
          days_back: range,
        }),
      ]);

      if (visitorAnalyticsResult.error) {
        throw new Error(
          `Visitor analytics: ${visitorAnalyticsResult.error.message}`
        );
      }

      if (visitorEventsResult.error) {
        throw new Error(
          `Visitor events: ${visitorEventsResult.error.message}`
        );
      }

      if (downloadAnalyticsResult.error) {
        throw new Error(
          `Download analytics: ${downloadAnalyticsResult.error.message}`
        );
      }

      setVisitorRows(
        (visitorAnalyticsResult.data ?? []).map((row: VisitorRow) => ({
          visitor_date: row.visitor_date,
          unique_visitors: Number(row.unique_visitors ?? 0),
          page_views: Number(row.page_views ?? 0),
        }))
      );

      setVisitorEvents(
        (visitorEventsResult.data ?? []).map((row) => ({
          session_id: row.session_id,
          event_type: row.event_type,
          created_at: row.created_at,
        }))
      );

      setDownloadRows(
        (downloadAnalyticsResult.data ?? []).map((row: DownloadRow) => ({
          download_date: row.download_date,
          total_downloads: Number(row.total_downloads ?? 0),
        }))
      );
    } catch (error) {
      console.error("Analytics loading error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data analytics."
      );
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const visitorTotals = useMemo(() => {
    const uniqueVisitors = new Set(
      visitorEvents
        .map((event) => event.session_id)
        .filter(Boolean)
    ).size;

    const pageViews = visitorEvents.length;

    return {
      uniqueVisitors,
      pageViews,
    };
  }, [visitorEvents]);

  const downloadTotals = useMemo(() => {
    return downloadRows.reduce(
      (total, row) => total + Number(row.total_downloads || 0),
      0
    );
  }, [downloadRows]);

  const visitorChart = useMemo(() => {
    const dates = buildDateRange(range);

    const map = new Map(
      visitorRows.map((row) => [
        row.visitor_date,
        {
          visitors: row.unique_visitors,
          pageViews: row.page_views,
        },
      ])
    );

    return dates.map((date) => {
      const value = map.get(date);

      return {
        date,
        visitors: value?.visitors ?? 0,
        pageViews: value?.pageViews ?? 0,
      };
    });
  }, [range, visitorRows]);

  const downloadChart = useMemo(() => {
    const dates = buildDateRange(range);

    const map = new Map(
      downloadRows.map((row) => [
        row.download_date,
        row.total_downloads,
      ])
    );

    return dates.map((date) => ({
      date,
      downloads: map.get(date) ?? 0,
    }));
  }, [range, downloadRows]);

  const maxVisitors = Math.max(
    1,
    ...visitorChart.map((item) => item.visitors)
  );

  const maxDownloads = Math.max(
    1,
    ...downloadChart.map((item) => item.downloads)
  );

  const averageVisitors =
    visitorChart.length > 0
      ? visitorChart.reduce((sum, item) => sum + item.visitors, 0) /
        visitorChart.length
      : 0;

  const averageDownloads =
    downloadChart.length > 0
      ? downloadChart.reduce((sum, item) => sum + item.downloads, 0) /
        downloadChart.length
      : 0;

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Performance Analytics
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Data ditampilkan berdasarkan aktivitas nyata dari Supabase.
          </p>
        </div>

        <button
          onClick={() => void loadAnalytics()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Data
        </button>
      </section>

      {errorMessage && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<Users size={20} />}
          label="Visitors"
          value={loading ? "..." : formatNumber(visitorTotals.uniqueVisitors)}
          description="Unique visitor berdasarkan session ID"
        />

        <MetricCard
          icon={<Eye size={20} />}
          label="Page Views"
          value={loading ? "..." : formatNumber(visitorTotals.pageViews)}
          description="Aktivitas page view yang tercatat"
        />

        <MetricCard
          icon={<Download size={20} />}
          label="Downloads"
          value={loading ? "..." : formatNumber(downloadTotals)}
          description="Data nyata dari download logs"
        />

        <MetricCard
          icon={<Activity size={20} />}
          label="Ad Tracking"
          value="Not configured"
          description="Impression dan click tracking belum tersedia"
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Visitor Overview
            </h2>
            <p className="text-sm text-white/50">
              Unique visitors berdasarkan session dan page view.
            </p>
          </div>

          <RangeSelector value={range} onChange={setRange} />
        </div>

        <div className="mb-5 grid gap-4 md:grid-cols-3">
          <StatBox
            label="Unique Visitors"
            value={formatNumber(visitorTotals.uniqueVisitors)}
          />
          <StatBox
            label="Page Views"
            value={formatNumber(visitorTotals.pageViews)}
          />
          <StatBox
            label="Rata-rata Visitor / hari"
            value={averageVisitors.toFixed(1)}
          />
        </div>

        <div className="flex h-64 items-end gap-1 overflow-hidden rounded-xl border border-white/5 bg-black/20 px-2 py-4">
          {visitorChart.map((item) => {
            const height =
              item.visitors === 0
                ? 2
                : Math.max(
                    4,
                    (item.visitors / maxVisitors) * 100
                  );

            return (
              <div
                key={item.date}
                className="group flex h-full min-w-0 flex-1 flex-col justify-end"
                title={`${item.date}: ${item.visitors} visitor, ${item.pageViews} page view`}
              >
                <div className="relative flex h-full items-end">
                  <div
                    className="w-full rounded-t-md bg-cyan-400/70 transition-all group-hover:bg-cyan-300"
                    style={{ height: `${height}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex justify-between text-[10px] text-white/30">
          <span>{visitorChart[0]?.date ?? "-"}</span>
          <span>{visitorChart[visitorChart.length - 1]?.date ?? "-"}</span>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Download Overview
            </h2>
            <p className="text-sm text-white/50">
              Jumlah download berdasarkan download logs.
            </p>
          </div>

          <RangeSelector value={range} onChange={setRange} />
        </div>

        <div className="mb-5 grid gap-4 md:grid-cols-2">
          <StatBox
            label="Total Downloads"
            value={formatNumber(downloadTotals)}
          />
          <StatBox
            label="Rata-rata / hari"
            value={averageDownloads.toFixed(1)}
          />
        </div>

        <div className="flex h-64 items-end gap-1 overflow-hidden rounded-xl border border-white/5 bg-black/20 px-2 py-4">
          {downloadChart.map((item) => {
            const height =
              item.downloads === 0
                ? 2
                : Math.max(
                    4,
                    (item.downloads / maxDownloads) * 100
                  );

            return (
              <div
                key={item.date}
                className="group flex h-full min-w-0 flex-1 flex-col justify-end"
                title={`${item.date}: ${item.downloads} download`}
              >
                <div className="relative flex h-full items-end">
                  <div
                    className="w-full rounded-t-md bg-violet-400/70 transition-all group-hover:bg-violet-300"
                    style={{ height: `${height}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex justify-between text-[10px] text-white/30">
          <span>{downloadChart[0]?.date ?? "-"}</span>
          <span>{downloadChart[downloadChart.length - 1]?.date ?? "-"}</span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatusCard
          title="Download Tracking"
          status="Connected"
          description="download_logs tersedia dan digunakan sebagai sumber analytics."
        />

        <StatusCard
          title="Visitor Tracking"
          status="Connected"
          description="visitor_events aktif dan menerima page view dari halaman publik."
        />

        <StatusCard
          title="Ads Tracking"
          status="Not configured"
          description="Impression dan click tracking belum tersedia."
        />
      </section>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-cyan-300">
          {icon}
        </div>
        <span className="text-[10px] font-semibold tracking-widest text-cyan-300">
          REAL DATA
        </span>
      </div>

      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      <p className="mt-2 text-xs text-white/35">{description}</p>
    </div>
  );
}

function StatBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-4">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function RangeSelector({
  value,
  onChange,
}: {
  value: RangeDays;
  onChange: (value: RangeDays) => void;
}) {
  return (
    <div className="flex rounded-xl border border-white/10 bg-black/20 p-1">
      {([7, 30, 90] as RangeDays[]).map((days) => (
        <button
          key={days}
          onClick={() => onChange(days)}
          className={`rounded-lg px-3 py-1.5 text-xs transition ${
            value === days
              ? "bg-white/10 text-white"
              : "text-white/40 hover:text-white"
          }`}
        >
          {days} Days
        </button>
      ))}
    </div>
  );
}

function StatusCard({
  title,
  status,
  description,
}: {
  title: string;
  status: string;
  description: string;
}) {
  const connected = status === "Connected";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            connected ? "bg-emerald-400" : "bg-amber-400"
          }`}
        />
        <span className="text-sm font-semibold text-white">{title}</span>
      </div>

      <p
        className={`mt-3 text-sm font-medium ${
          connected ? "text-emerald-300" : "text-amber-300"
        }`}
      >
        {status}
      </p>

      <p className="mt-2 text-xs leading-5 text-white/40">
        {description}
      </p>
    </div>
  );
}

