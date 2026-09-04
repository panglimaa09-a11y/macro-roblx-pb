"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Loader2,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  Search,
  FileArchive,
  FileCode2,
  FileText,
  Package,
  Monitor,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type DownloadItem = {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string | null;
  category: string | null;
  version: string | null;
  file_size: number | null;
  mime_type: string | null;
  downloads: number;
  created_at: string;
};

type State = "idle" | "processing" | "ad" | "ready" | "error";

function formatBytes(bytes: number | null) {
  if (!bytes || bytes <= 0) return "Ukuran tidak tersedia";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "-";
  }
}

function getFileType(item: DownloadItem) {
  const name = item.file_name?.toLowerCase() || "";
  if (name.endsWith(".zip")) return "ZIP Archive";
  if (name.endsWith(".exe")) return "Windows EXE";
  if (name.endsWith(".msi")) return "Windows Installer";
  if (name.endsWith(".pdf")) return "PDF";
  if (item.mime_type) return item.mime_type.split("/").pop()?.toUpperCase() || "FILE";
  return "FILE";
}

function getFileIcon(item: DownloadItem) {
  const name = item.file_name?.toLowerCase() || "";
  if (name.endsWith(".zip")) return FileArchive;
  if (name.endsWith(".exe") || name.endsWith(".msi")) return Monitor;
  if (name.endsWith(".js") || name.endsWith(".ts") || name.endsWith(".tsx"))
    return FileCode2;
  if (name.endsWith(".pdf") || name.endsWith(".txt")) return FileText;
  return Package;
}

export default function DownloadPage() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [selected, setSelected] = useState<DownloadItem | null>(null);
  const [state, setState] = useState<State>("idle");
  const [countdown, setCountdown] = useState(0);
  const [settingsCountdown, setSettingsCountdown] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [downloadCounted, setDownloadCounted] = useState(false);

  useEffect(() => {
    void loadDownloads();
  }, []);

  async function loadDownloads() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("downloads")
      .select(
        "id,title,description,file_url,file_name,category,version,file_size,mime_type,downloads,created_at"
      )
      .eq("status", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Download query error:", error);
      setErrorMessage("Gagal mengambil daftar download dari server.");
      setItems([]);
    } else {
      setItems((data ?? []) as DownloadItem[]);
    }

    setLoading(false);
  }

  const categories = useMemo(() => {
    return Array.from(
      new Set(items.map((item) => item.category).filter(Boolean))
    ) as string[];
  }, [items]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        category === "all" || (item.category || "").toLowerCase() === category.toLowerCase();

      if (!matchesCategory) return false;
      if (!keyword) return true;

      return [item.title, item.description, item.file_name, item.category, item.version]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
  }, [items, search, category]);


  async function startDownload(item: DownloadItem) {
    try {
      // Baca settings TERBARU tepat saat tombol Download ditekan.
      const response = await fetch(
        "/api/admin/settings?t=" + Date.now(),
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Gagal membaca pengaturan download.");
      }

      const data = await response.json();
      const value = Number(data?.settings?.countdown);

      if (!Number.isFinite(value)) {
        throw new Error("Countdown dari settings tidak valid.");
      }

      const countdownValue = Math.min(
        30,
        Math.max(1, Math.round(value))
      );

      console.log(
        "[MACRRO DOWNLOAD] Countdown dari Admin Settings:",
        countdownValue
      );

      setSelected(item);
      setDownloadCounted(false);
      setSettingsCountdown(countdownValue);
      setCountdown(countdownValue);

      // Langsung masuk Advertisement setelah countdown sudah siap.
      setState("ad");
    } catch (error) {
      console.error("[MACRRO DOWNLOAD] Settings error:", error);

      setSelected(item);
      setDownloadCounted(false);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal membaca pengaturan download."
      );
      setState("error");
    }
  }
  useEffect(() => {
    if (state !== "ad") return;

    if (countdown <= 0) return;

    const timer = window.setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [state, countdown]);

  function continueDownload() {
    if (!selected) return;
    setState("ready");
  }

  async function handleActualDownload() {
    if (!selected) return;

    if (!downloadCounted) {
      const { error } = await supabase.rpc("increment_download", {
        download_uuid: selected.id,
      });

      if (error) {
        console.error("Increment download error:", error);
      } else {
        setDownloadCounted(true);
        setItems((current) =>
          current.map((item) =>
            item.id === selected.id
              ? { ...item, downloads: (item.downloads || 0) + 1 }
              : item
          )
        );
      }
    }
  }

  function reset() {
    setSelected(null);
    setState("idle");
    setCountdown(0);
    setDownloadCounted(false);
  }

  if (selected && state !== "idle") {
    return (
      <main className="min-h-screen bg-[#0a0b10] px-4 py-8 text-white sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-8">
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
              <div className="py-8 text-center sm:py-12">
                <Sparkles className="mx-auto mb-5 h-10 w-10 text-cyan-400" />
                <p className="mb-3 text-sm uppercase tracking-[0.25em] text-cyan-400">
                  Advertisement
                </p>

                <div className="mx-auto mb-8 flex min-h-[180px] max-w-xl items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-white/30">
                  Advertisement
                </div>

                <h1 className="text-2xl font-bold">
                  {countdown > 0
                    ? `Menyiapkan download... ${countdown} detik`
                    : "Download siap dilanjutkan"}
                </h1>

                <p className="mt-3 text-white/50">
                  Tunggu sampai timer selesai, kemudian lanjutkan download.
                </p>

                {countdown === 0 && (
                  <button
                    onClick={continueDownload}
                    className="mt-8 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black transition hover:scale-[1.02]"
                  >
                    Lanjutkan Download
                  </button>
                )}
              </div>
            )}

            {state === "ready" && (
              <div className="py-8 text-center sm:py-12">
                <CheckCircle2 className="mx-auto mb-5 h-14 w-14 text-emerald-400" />

                <p className="text-sm uppercase tracking-[0.25em] text-emerald-400">
                  Ready
                </p>

                <h1 className="mt-3 text-3xl font-bold">{selected.title}</h1>

                <p className="mt-3 text-white/50">
                  {selected.file_name || "File download"}
                </p>

                <div className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-3 text-left sm:grid-cols-4">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-white/40">Versi</p>
                    <p className="mt-1 text-sm font-semibold">{selected.version || "-"}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-white/40">Ukuran</p>
                    <p className="mt-1 text-sm font-semibold">{formatBytes(selected.file_size)}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-white/40">Tipe</p>
                    <p className="mt-1 text-sm font-semibold">{getFileType(selected)}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-white/40">Download</p>
                    <p className="mt-1 text-sm font-semibold">{selected.downloads || 0}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-left text-sm text-amber-100/80">
                  <strong className="text-amber-300">Keamanan file:</strong>{" "}
                  Download hanya dari sumber resmi Macrro Online. Eksekusi aplikasi
                  dilakukan secara lokal di Windows. Periksa nama dan sumber file
                  sebelum menjalankannya.
                </div>

                <a
                  href={selected.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => void handleActualDownload()}
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
    <main className="min-h-screen bg-[#0a0b10] px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center sm:mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
            <ShieldCheck className="h-4 w-4" />
            Secure Download Center
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Macrro Online
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-white/50">
            Download file resmi Macrro Online untuk penggunaan lokal di Windows.
            Pilih file yang kamu perlukan dari daftar di bawah.
          </p>
        </div>

        <div className="mb-7 grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari file, versi, kategori..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-white/30 focus:border-cyan-400/40"
            />
          </div>

          <button
            onClick={() => void loadDownloads()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-cyan-400/30 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {categories.length > 0 && (
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setCategory("all")}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === "all"
                  ? "bg-cyan-400 text-black"
                  : "border border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
              }`}
            >
              Semua
            </button>

            {categories.map((value) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  category.toLowerCase() === value.toLowerCase()
                    ? "bg-cyan-400 text-black"
                    : "border border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="py-20 text-center text-white/50">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-cyan-400" />
            Memuat file...
          </div>
        )}

        {!loading && errorMessage && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center text-red-300">
            <XCircle className="mx-auto mb-4 h-8 w-8" />
            <p>{errorMessage}</p>
            <button
              onClick={() => void loadDownloads()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black"
            >
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </button>
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

        {!loading && !errorMessage && items.length > 0 && filteredItems.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <Search className="mx-auto mb-5 h-10 w-10 text-white/30" />
            <h2 className="text-xl font-bold">File tidak ditemukan</h2>
            <p className="mt-2 text-white/40">
              Coba gunakan kata kunci atau kategori lain.
            </p>
          </div>
        )}

        {!loading && !errorMessage && filteredItems.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const Icon = getFileIcon(item);

              return (
                <article
                  key={item.id}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.05]"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                      <Icon className="h-6 w-6" />
                    </div>

                    {item.category && (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/50">
                        {item.category}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold">{item.title}</h2>

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-white/45">
                    {item.description || "File resmi tersedia untuk didownload."}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-black/20 p-3">
                      <p className="text-white/30">Versi</p>
                      <p className="mt-1 font-semibold text-white/70">
                        {item.version || "-"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-black/20 p-3">
                      <p className="text-white/30">Ukuran</p>
                      <p className="mt-1 font-semibold text-white/70">
                        {formatBytes(item.file_size)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-black/20 p-3">
                      <p className="text-white/30">Tipe</p>
                      <p className="mt-1 font-semibold text-white/70">
                        {getFileType(item)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-black/20 p-3">
                      <p className="text-white/30">Download</p>
                      <p className="mt-1 font-semibold text-white/70">
                        {item.downloads || 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-white/30">
                    <span>Windows</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>

                  <button
                    onClick={() => startDownload(item)}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-black transition group-hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]"
                  >
                    <Download className="h-4 w-4" />
                    DOWNLOAD
                  </button>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-5 text-sm text-white/55">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="font-semibold text-emerald-300">Keamanan & penggunaan</p>
              <p className="mt-1 leading-6">
                File dieksekusi secara lokal di Windows. Gunakan file dari
                Download Center resmi dan jangan menjalankan file yang berasal
                dari sumber tidak dikenal.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white">
              Tentang Download Center
            </h2>
            <p className="mt-3 leading-7 text-white/55">
              Download Center Macrro Online menyediakan file resmi untuk
              penggunaan lokal di Windows. Setiap file yang tersedia
              ditampilkan bersama informasi versi, ukuran, tipe file, kategori,
              dan jumlah download sehingga pengguna dapat memilih file yang
              sesuai dengan kebutuhannya.
            </p>
            <p className="mt-3 leading-7 text-white/55">
              Sebelum mengunduh, pastikan kamu memilih file dari daftar resmi
              dan membaca informasi yang tersedia pada setiap kartu download.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <h2 className="text-xl font-bold">Apa itu Macrro Online?</h2>
              <p className="mt-3 leading-7 text-white/55">
                Macrro Online adalah platform untuk menyediakan dan
                mendistribusikan tools macro yang digunakan secara lokal pada
                komputer Windows. Aplikasi yang diunduh tidak dijalankan di
                server website, tetapi diproses pada perangkat pengguna.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <h2 className="text-xl font-bold">Eksekusi lokal di Windows</h2>
              <p className="mt-3 leading-7 text-white/55">
                Setelah file berhasil diunduh, proses menjalankan aplikasi
                dilakukan pada komputer Windows pengguna. Website berfungsi
                sebagai pusat informasi dan distribusi file, bukan sebagai
                lingkungan untuk menjalankan aplikasi tersebut.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Cara menggunakan Download Center</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-bold text-cyan-300">01 · Pilih file</p>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  Cari file berdasarkan nama, versi, atau kategori yang
                  tersedia.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-bold text-cyan-300">02 · Periksa informasi</p>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  Periksa versi, ukuran, tipe file, dan deskripsi sebelum
                  melakukan download.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-bold text-cyan-300">03 · Download</p>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  Tekan tombol download dan tunggu proses persiapan sampai
                  tombol untuk mengambil file tersedia.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-bold text-cyan-300">04 · Jalankan lokal</p>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  Setelah file tersimpan, ikuti petunjuk penggunaan dan jalankan
                  aplikasi pada Windows sesuai kebutuhan.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <h2 className="text-xl font-bold">Keamanan file</h2>
              <p className="mt-3 leading-7 text-white/55">
                Download file hanya dari sumber resmi Macrro Online. Jangan
                menggunakan file yang dimodifikasi atau berasal dari website
                dan sumber yang tidak dikenal. Sebelum menjalankan file,
                periksa nama file dan pastikan file yang digunakan sesuai
                dengan informasi yang ditampilkan pada Download Center.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <h2 className="text-xl font-bold">Kompatibilitas</h2>
              <p className="mt-3 leading-7 text-white/55">
                File pada Download Center ditujukan untuk penggunaan pada
                Windows sesuai dengan kebutuhan masing-masing tools. Periksa
                versi dan deskripsi file sebelum menggunakannya agar sesuai
                dengan lingkungan Windows yang kamu gunakan.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-2xl font-bold">FAQ Download</h2>

            <div className="mt-5 space-y-5">
              <div>
                <h3 className="font-semibold text-white">
                  Apakah aplikasi dijalankan di website?
                </h3>
                <p className="mt-2 leading-6 text-white/50">
                  Tidak. File diunduh melalui website, sedangkan aplikasi
                  dijalankan secara lokal pada komputer Windows pengguna.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Bagaimana mengetahui file yang harus diunduh?
                </h3>
                <p className="mt-2 leading-6 text-white/50">
                  Gunakan nama, kategori, versi, ukuran, dan deskripsi pada
                  kartu file untuk menentukan pilihan yang sesuai.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Apakah file dari sumber lain direkomendasikan?
                </h3>
                <p className="mt-2 leading-6 text-white/50">
                  Tidak. Untuk mengurangi risiko file yang telah dimodifikasi,
                  gunakan file yang tersedia melalui sumber resmi Macrro Online.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6 text-sm">
            <a
              href="/cara-penggunaan"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white/60 transition hover:border-cyan-400/30 hover:text-white"
            >
              Cara Penggunaan
            </a>
            <a
              href="/faq"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white/60 transition hover:border-cyan-400/30 hover:text-white"
            >
              FAQ
            </a>
            <a
              href="/privacy"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white/60 transition hover:border-cyan-400/30 hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href="/disclaimer"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white/60 transition hover:border-cyan-400/30 hover:text-white"
            >
              Disclaimer
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}









