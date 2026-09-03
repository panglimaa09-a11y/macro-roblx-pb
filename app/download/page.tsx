"use client";

import { useEffect, useState } from "react";
import {
  Download,
  Loader2,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type DownloadItem = {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string | null;
  category_id: string | null;
  downloads: number;
};

type State = "idle" | "processing" | "ad" | "ready" | "error";

export default function DownloadPage() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [selected, setSelected] = useState<DownloadItem | null>(null);
  const [state, setState] = useState<State>("idle");
  const [countdown, setCountdown] = useState(3);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadDownloads();
  }, []);

  async function loadDownloads() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("downloads")
      .select(
        "id,title,description,file_url,file_name,category_id,downloads"
      )
      .eq("status", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Download query error:", error?.message ?? error);
      setErrorMessage("Gagal mengambil daftar download dari server.");
      setItems([]);
    } else {
      setItems(data ?? []);
    }

    setLoading(false);
  }

  function startDownload(item: DownloadItem) {
    setSelected(item);
    setState("processing");
    setCountdown(3);

    setTimeout(() => {
      setState("ad");
    }, 900);
  }

  useEffect(() => {
    if (state !== "ad") return;

    if (countdown <= 0) {
      setState("ready");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [state, countdown]);

  async function confirmDownload() {
    if (!selected) return;

    await supabase.rpc("increment_download", {
      download_id: selected.id,
    });

    setState("ready");
  }

  function reset() {
    setSelected(null);
    setState("idle");
    setCountdown(3);
  }

  if (selected && state !== "idle") {
    return (
      <main className="min-h-screen bg-[#0a0b10] text-white px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
            {state === "processing" && (
              <div className="py-16 text-center">
                <Loader2 className="mx-auto mb-6 h-12 w-12 animate-spin text-cyan-400" />
                <h1 className="text-2xl font-bold">Preparing Download</h1>
                <p className="mt-2 text-white/50">
                  Menyiapkan file untuk kamu...
                </p>
              </div>
            )}

            {state === "ad" && (
              <div className="py-12 text-center">
                <Sparkles className="mx-auto mb-5 h-10 w-10 text-cyan-400" />
                <p className="mb-3 text-sm uppercase tracking-[0.25em] text-cyan-400">
                  Advertisement
                </p>

                <div className="mx-auto mb-8 flex min-h-[180px] max-w-xl items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-white/30">
                  Advertisement
                </div>

                <h1 className="text-2xl font-bold">
                  Menyiapkan download... {countdown} detik
                </h1>

                <p className="mt-3 text-white/50">
                  Mohon tunggu sampai proses persiapan selesai.
                </p>

                {countdown === 0 && (
                  <button
                    onClick={confirmDownload}
                    className="mt-8 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black"
                  >
                    Lanjutkan Download
                  </button>
                )}
              </div>
            )}

            {state === "ready" && (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto mb-5 h-14 w-14 text-emerald-400" />

                <p className="text-sm uppercase tracking-[0.25em] text-emerald-400">
                  Ready
                </p>

                <h1 className="mt-3 text-3xl font-bold">
                  {selected.title}
                </h1>

                <p className="mt-3 text-white/50">
                  {selected.file_name || "File download"}
                </p>

                <a
                  href={selected.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    void supabase.rpc("increment_download", {
                      download_id: selected.id,
                    });
                  }}
                  className="mt-8 inline-flex items-center gap-3 rounded-xl bg-cyan-400 px-8 py-4 font-bold text-black transition hover:scale-[1.02]"
                >
                  <Download className="h-5 w-5" />
                  DOWNLOAD FILE
                </a>

                <button
                  onClick={reset}
                  className="mt-5 block w-full text-sm text-white/40 hover:text-white"
                >
                  Kembali ke Download Center
                </button>
              </div>
            )}

            {state === "error" && (
              <div className="py-16 text-center">
                <XCircle className="mx-auto mb-5 h-12 w-12 text-red-400" />
                <h1 className="text-2xl font-bold">Download gagal</h1>
                <button
                  onClick={reset}
                  className="mt-6 rounded-xl bg-white px-6 py-3 font-bold text-black"
                >
                  Kembali
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0b10] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
            <ShieldCheck className="h-4 w-4" />
            Secure Download Center
          </div>

          <h1 className="text-4xl font-black tracking-tight">
            Macrro Online
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-white/50">
            Pilih file yang tersedia dan klik DOWNLOAD untuk memulai.
          </p>
        </div>

        {loading && (
          <div className="py-20 text-center text-white/50">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-cyan-400" />
            Memuat file...
          </div>
        )}

        {!loading && errorMessage && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6 text-center text-red-300">
            {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && items.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <Download className="mx-auto mb-5 h-10 w-10 text-white/30" />
            <h2 className="text-xl font-bold">Belum ada file</h2>
            <p className="mt-2 text-white/40">
              Admin belum menambahkan file download aktif.
            </p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-cyan-400/30"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <Download className="h-6 w-6" />
                </div>

                <h2 className="text-xl font-bold">{item.title}</h2>

                <p className="mt-3 min-h-12 text-sm leading-6 text-white/45">
                  {item.description || "File tersedia untuk didownload."}
                </p>

                <button
                  onClick={() => startDownload(item)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-black transition group-hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]"
                >
                  <Download className="h-4 w-4" />
                  DOWNLOAD
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}





