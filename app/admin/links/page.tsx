"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  ExternalLink,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X
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

const STORAGE_KEY = "macrro_download_links";

const demoLinks: DownloadItem[] = [
  {
    id: "demo-1",
    title: "Macro Online v1.0",
    description: "Versi terbaru Macro Online.",
    url: "https://example.com/macro-online-v1.zip",
    fileName: "Macro-Online-v1.0.zip",
    category: "Software",
    status: true,
    downloads: 0,
    createdAt: new Date().toISOString()
  }
];

export default function LinksPage() {
  const [links, setLinks] = useState<DownloadItem[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [category, setCategory] = useState("Software");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        setLinks(JSON.parse(saved));
      } catch {
        setLinks(demoLinks);
      }
    } else {
      setLinks(demoLinks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoLinks));
    }
  }, []);

  const saveLinks = (items: DownloadItem[]) => {
    setLinks(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    return links.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.fileName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [links, query]);

  const createLink = () => {
    setError("");

    if (!title.trim()) {
      setError("Judul download wajib diisi.");
      return;
    }

    if (!url.trim()) {
      setError("URL file wajib diisi.");
      return;
    }

    try {
      const parsed = new URL(url);

      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error();
      }
    } catch {
      setError("URL file harus menggunakan http:// atau https://.");
      return;
    }

    if (!fileName.trim()) {
      setError("Nama file wajib diisi.");
      return;
    }

    const item: DownloadItem = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      fileName: fileName.trim(),
      category,
      status: true,
      downloads: 0,
      createdAt: new Date().toISOString()
    };

    saveLinks([item, ...links]);

    setTitle("");
    setDescription("");
    setUrl("");
    setFileName("");
    setCategory("Software");
    setShowForm(false);
  };

  const toggleStatus = (id: string) => {
    saveLinks(
      links.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  const deleteLink = (id: string) => {
    if (!confirm("Hapus download ini?")) return;

    saveLinks(links.filter((item) => item.id !== id));
  };

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[.22em] text-cyan-300/60">
            Management
          </p>

          <h1 className="mt-2 font-outfit text-4xl font-semibold">
            Download Manager
          </h1>

          <p className="mt-2 text-sm text-white/35">
            Buat dan kelola file yang tersedia untuk user.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950"
        >
          <Plus className="h-4 w-4" />
          Tambah Download
        </button>
      </div>

      {showForm && (
        <div className="glass mt-7 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[.18em] text-cyan-300/60">
                Create
              </p>
              <h2 className="mt-1 font-outfit text-2xl font-semibold">
                Tambah Download
              </h2>
            </div>

            <button
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-white/10 p-2 text-white/40 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-xs text-white/40">
              Judul Download
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Macro Online v1.0"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white"
              />
            </label>

            <label className="text-xs text-white/40">
              Nama File
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Macro-Online-v1.0.zip"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white"
              />
            </label>

            <label className="text-xs text-white/40 md:col-span-2">
              URL File
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/file.zip"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white"
              />
            </label>

            <label className="text-xs text-white/40">
              Kategori
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white"
              >
                <option>Software</option>
                <option>Tools</option>
                <option>Game</option>
                <option>Document</option>
                <option>Other</option>
              </select>
            </label>

            <label className="text-xs text-white/40">
              Deskripsi
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat file..."
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white"
              />
            </label>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            onClick={createLink}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950"
          >
            <Plus className="h-4 w-4" />
            Simpan Download
          </button>
        </div>
      )}

      <div className="glass mt-7 rounded-2xl p-4">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3">
          <Search className="h-4 w-4 text-white/30" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari download..."
            className="w-full bg-transparent py-3 text-sm"
          />
        </div>
      </div>

      <div className="glass mt-4 overflow-hidden rounded-2xl">
        <div className="hidden grid-cols-[1.6fr_.7fr_.5fr_.5fr_.5fr] border-b border-white/10 px-5 py-4 text-[10px] uppercase tracking-[.18em] text-white/25 md:grid">
          <span>Download</span>
          <span>Status</span>
          <span>Downloads</span>
          <span>File</span>
          <span>Action</span>
        </div>

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-white/30">
            Belum ada download.
          </div>
        )}

        {filtered.map((item) => (
          <div
            key={item.id}
            className="grid gap-4 border-b border-white/5 px-5 py-5 last:border-0 md:grid-cols-[1.6fr_.7fr_.5fr_.5fr_.5fr] md:items-center"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white/80">
                {item.title}
              </div>

              <div className="mt-1 truncate text-xs text-white/30">
                {item.description || item.category}
              </div>

              <div className="mt-2 flex items-center gap-1 text-[10px] text-cyan-300/50">
                <ExternalLink className="h-3 w-3" />
                {item.fileName}
              </div>
            </div>

            <button
              onClick={() => toggleStatus(item.id)}
              className={
                item.status ? "text-cyan-300" : "text-white/20"
              }
              title={item.status ? "Nonaktifkan" : "Aktifkan"}
            >
              {item.status ? (
                <ToggleRight className="h-6 w-6" />
              ) : (
                <ToggleLeft className="h-6 w-6" />
              )}
            </button>

            <span className="text-sm text-white/55">
              {item.downloads.toLocaleString("id-ID")}
            </span>

            <span className="truncate text-xs text-white/40">
              {item.fileName}
            </span>

            <button
              onClick={() => deleteLink(item.id)}
              className="inline-flex items-center gap-2 text-xs text-red-300/50 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
