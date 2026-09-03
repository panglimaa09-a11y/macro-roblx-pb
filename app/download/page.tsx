"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Loader2,
  ShieldCheck,
  Sparkles,
  XCircle
} from "lucide-react";

type DownloadItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  fileName: string;
  category: string;
  status: boolean;
  downloads: number;
  createdAt: string;
};

type State = "idle" | "processing" | "ad" | "ready" | "error";

const STORAGE_KEY = "macrro_download_links";

export default function DownloadPage() {
  const [links, setLinks] = useState<DownloadItem[]>([]);
  const [selected, setSelected] = useState<DownloadItem | null>(null);
  const [state, setState] = useState<State>("idle");
  const [seconds, setSeconds] = useState(5);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        setLinks([]);
        return;
      }

      try {
        const parsed = JSON.parse(saved);
        setLinks(parsed.filter((item: DownloadItem) => item.status));
      } catch {
        setLinks([]);
      }
    };

    load();

    window.addEventListener("storage", load);

    return () => window.removeEventListener("storage", load);
  }, []);

  const startDownload = (item: DownloadItem) => {
    setError("");
    setSelected(item);
    setState("processing");

    setTimeout(() => {
      setState("ad");

      let s = 5;
      setSeconds(s);

      const timer = setInterval(() => {
        s -= 1;
        setSeconds(s);

        if (s <= 0) {
          clearInterval(timer);
          setState("ready");
        }
      }, 1000);
    }, 1000);
  };

  const reset = () => {
    setSelected(null);
    setState("idle");
    setSeconds(5);
    setError("");
  };

  const completeDownload = () => {
    if (!selected) return;

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const all: DownloadItem[] = JSON.parse(saved);

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(
            all.map((item) =>
              item.id === selected.id
                ? { ...item, downloads: item.downloads + 1 }
                : item
            )
          )
        );
      } catch {
        // Ignore local demo storage errors.
      }
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute left-1/2 top-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="font-outfit text-lg font-semibold tracking-[.2em]">
          MACRRO<span className="text-cyan-300">.</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/35">
          <ShieldCheck className="h-4 w-4 text-cyan-300/70" />
          Secure session
        </div>
      </header>

      <section className="relative mx-auto min-h-[78vh] max-w-5xl px-6 py-10">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/5">
            <Sparkles className="h-5 w-5 text-cyan-300" />
          </div>

          <h1 className="font-outfit text-4xl font-semibold sm:text-5xl">
            Download Center
          </h1>

          <p className="mt-3 text-sm text-white/40">
            Pilih file yang ingin kamu download.
          </p>
        </div>

        {state === "idle" && (
          <>
            {links.length === 0 ? (
              <div className="glass rounded-3xl p-10 text-center">
                <Download className="mx-auto h-10 w-10 text-white/20" />

                <h2 className="mt-5 font-outfit text-2xl font-semibold">
                  Belum ada file
                </h2>

                <p className="mt-2 text-sm text-white/35">
                  Admin belum menambahkan download yang aktif.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {links.map((item) => (
                  <div
                    key={item.id}
                    className="glass glass-hover rounded-3xl p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/5">
                        <Download className="h-5 w-5 text-cyan-300" />
                      </div>

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-wider text-white/35">
                        {item.category}
                      </span>
                    </div>

                    <h2 className="mt-6 font-outfit text-xl font-semibold text-white/90">
                      {item.title}
                    </h2>

                    <p className="mt-2 min-h-10 text-sm leading-6 text-white/35">
                      {item.description || "Download file dari Macrro Online."}
                    </p>

                    <div className="mt-5 rounded-xl border border-white/5 bg-black/20 px-3 py-2 text-xs text-white/30">
                      {item.fileName}
                    </div>

                    <button
                      onClick={() => startDownload(item)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
                    >
                      <Download className="h-4 w-4" />
                      DOWNLOAD
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {state === "processing" && (
          <StatusCard
            icon={
              <Loader2 className="h-8 w-8 animate-spin text-cyan-300" />
            }
            title="Preparing download..."
            text="Menyiapkan secure download session."
          />
        )}

        {state === "ad" && selected && (
          <div className="glass rounded-3xl p-8 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/5">
              <span className="font-outfit text-4xl font-semibold text-cyan-200">
                {seconds}
              </span>
            </div>

            <div className="mt-7 text-sm font-semibold">
              Preparing your download
            </div>

            <p className="mt-2 text-xs text-white/35">
              Advertisement placement • countdown
            </p>

            <div className="mx-auto mt-7 flex h-24 max-w-xl items-center justify-center rounded-2xl border border-white/5 bg-black/20 text-[10px] tracking-[.3em] text-white/20">
              ADVERTISEMENT
            </div>

            <p className="mt-5 text-xs text-white/25">
              {selected.fileName}
            </p>
          </div>
        )}

        {state === "ready" && selected && (
          <div className="glass rounded-3xl p-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-cyan-300" />

            <h2 className="mt-5 font-outfit text-2xl font-semibold">
              Your file is ready
            </h2>

            <p className="mt-2 text-sm text-white/35">
              {selected.title}
            </p>

            <p className="mt-1 text-xs text-white/25">
              {selected.fileName}
            </p>

            <a
              href={selected.url}
              target="_blank"
              rel="noreferrer"
              onClick={completeDownload}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              <Download className="h-4 w-4" />
              DOWNLOAD FILE
            </a>

            <button
              onClick={reset}
              className="mt-3 text-xs text-white/35 hover:text-white"
            >
              Kembali ke Download Center
            </button>
          </div>
        )}

        {state === "error" && (
          <div className="glass rounded-3xl p-8 text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-300" />

            <h2 className="mt-5 font-outfit text-2xl font-semibold">
              Download gagal
            </h2>

            <p className="mt-2 text-sm text-white/40">{error}</p>

            <button
              onClick={reset}
              className="mt-7 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm"
            >
              Kembali
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function StatusCard({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="glass rounded-3xl p-10 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/5">
        {icon}
      </div>

      <h2 className="mt-6 font-outfit text-2xl font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-sm text-white/40">{text}</p>
    </div>
  );
}
