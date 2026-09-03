"use client";

import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import {
  UploadCloud,
  FileArchive,
  File,
  Trash2,
  Power,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type DownloadItem = {
  id: string;
  title: string;
  description: string | null;
  file_name: string;
  file_url: string;
  storage_path: string | null;
  category: string | null;
  version: string | null;
  file_size: number | null;
  mime_type: string | null;
  status: boolean;
  downloads: number;
  created_at: string;
};

const MAX_FILE_SIZE = 500 * 1024 * 1024;

function formatBytes(bytes: number | null) {
  if (!bytes) return "Ukuran tidak diketahui";

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminLinksPage() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Software");
  const [version, setVersion] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function loadItems() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("downloads")
      .select(
        "id,title,description,file_name,file_url,storage_path,category,version,file_size,mime_type,status,downloads,created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Load downloads error:", error);
      setError(error.message);
      setItems([]);
    } else {
      setItems((data ?? []) as DownloadItem[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadItems();
  }, []);

  function validateFile(file: File) {
    if (file.size > MAX_FILE_SIZE) {
      setError("Ukuran file maksimal 500 MB.");
      return false;
    }

    return true;
  }

  function chooseFile(file: File | null) {
    if (!file) return;

    setError("");
    setMessage("");

    if (!validateFile(file)) return;

    setSelectedFile(file);

    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      setTitle(cleanName);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    chooseFile(event.target.files?.[0] ?? null);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files?.[0] ?? null;
    chooseFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError("Pilih atau seret file terlebih dahulu.");
      return;
    }

    if (!title.trim()) {
      setError("Judul download wajib diisi.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const safeName = selectedFile.name
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .replace(/-+/g, "-");

      const uniquePath = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("downloads")
        .upload(uniquePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: selectedFile.type || "application/octet-stream",
        });

      if (uploadError) {
        throw new Error(`Upload file gagal: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("downloads")
        .getPublicUrl(uniquePath);

      const fileUrl = publicUrlData.publicUrl;

      const slugBase = slugify(title) || "download";
      const slug = `${slugBase}-${Date.now()}`;

      const { error: insertError } = await supabase
        .from("downloads")
        .insert({
          title: title.trim(),
          slug,
          description: description.trim() || null,
          file_name: selectedFile.name,
          file_url: fileUrl,
          storage_path: uniquePath,
          category,
          version: version.trim() || null,
          file_size: selectedFile.size,
          mime_type: selectedFile.type || "application/octet-stream",
          status: true,
        });

      if (insertError) {
        await supabase.storage.from("downloads").remove([uniquePath]);
        throw new Error(`Data download gagal disimpan: ${insertError.message}`);
      }

      setMessage("File berhasil di-upload dan ditambahkan ke Download Center.");

      setTitle("");
      setDescription("");
      setCategory("Software");
      setVersion("");
      setSelectedFile(null);

      await loadItems();
    } catch (uploadError) {
      console.error("Upload error:", uploadError);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Terjadi kesalahan saat upload."
      );
    } finally {
      setUploading(false);
    }
  }

  async function toggleStatus(item: DownloadItem) {
    setError("");

    const { error } = await supabase
      .from("downloads")
      .update({ status: !item.status })
      .eq("id", item.id);

    if (error) {
      setError(error.message);
      return;
    }

    await loadItems();
  }

  async function deleteItem(item: DownloadItem) {
    const confirmed = window.confirm(
      `Hapus "${item.title}" dari Download Center?`
    );

    if (!confirmed) return;

    setError("");

    if (item.storage_path) {
      const { error: storageError } = await supabase.storage
        .from("downloads")
        .remove([item.storage_path]);

      if (storageError) {
        console.error("Storage delete error:", storageError);
      }
    }

    const { error } = await supabase
      .from("downloads")
      .delete()
      .eq("id", item.id);

    if (error) {
      setError(error.message);
      return;
    }

    await loadItems();
  }

  const filteredItems = items.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.title.toLowerCase().includes(keyword) ||
      item.file_name.toLowerCase().includes(keyword) ||
      (item.category ?? "").toLowerCase().includes(keyword)
    );
  });

  return (
    <main className="min-h-screen bg-[#0a0b10] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <UploadCloud className="h-7 w-7 text-cyan-400" />
            <h1 className="text-3xl font-bold">Download Manager</h1>
          </div>

          <p className="text-sm text-zinc-400">
            Upload file langsung dari komputer dan kelola file yang tersedia
            untuk pengguna.
          </p>
        </div>

        {message && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
            {message}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Tambah Download</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Seret file ke area upload atau pilih file dari Windows.
            </p>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition ${
              dragging
                ? "border-cyan-400 bg-cyan-400/10"
                : "border-white/15 bg-black/20 hover:border-cyan-400/50 hover:bg-white/[0.04]"
            }`}
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 cursor-pointer opacity-0"
            />

            {selectedFile ? (
              <>
                <FileArchive className="mb-4 h-14 w-14 text-cyan-400" />

                <p className="max-w-xl truncate px-6 text-center font-medium">
                  {selectedFile.name}
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  {formatBytes(selectedFile.size)}
                </p>

                <p className="mt-4 text-xs text-cyan-400">
                  File siap di-upload
                </p>
              </>
            ) : (
              <>
                <UploadCloud className="mb-4 h-14 w-14 text-zinc-500" />

                <p className="text-lg font-medium">
                  Seret & lepas file di sini
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  atau klik untuk memilih file
                </p>

                <p className="mt-4 text-xs text-zinc-600">
                  Maksimal 500 MB
                </p>
              </>
            )}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Judul
              </label>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Contoh: Macro Online v1.0"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Kategori
              </label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              >
                <option>Software</option>
                <option>Tools</option>
                <option>Macro</option>
                <option>Windows</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Version
              </label>

              <input
                value={version}
                onChange={(event) => setVersion(event.target.value)}
                placeholder="Contoh: v1.0.0"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                File
              </label>

              <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-400">
                {selectedFile?.name ?? "Belum ada file"}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm text-zinc-400">
              Deskripsi
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Jelaskan file yang akan didownload..."
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <UploadCloud className="h-5 w-5" />
                Upload & Simpan
              </>
            )}
          </button>
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">File Tersimpan</h2>
              <p className="text-sm text-zinc-500">
                Semua file berasal dari database Supabase.
              </p>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari file..."
                  className="rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-4 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <button
                onClick={() => void loadItems()}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.06]"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-20">
              <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
              <File className="mx-auto h-10 w-10 text-zinc-700" />
              <p className="mt-4 text-zinc-500">Belum ada file.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
                      <FileArchive className="h-6 w-6 text-cyan-400" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {item.title}
                      </h3>

                      <p className="mt-1 truncate text-sm text-zinc-500">
                        {item.file_name}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                        <span>{formatBytes(item.file_size)}</span>

                        {item.category && (
                          <span>• {item.category}</span>
                        )}

                        {item.version && (
                          <span>• {item.version}</span>
                        )}

                        <span>• {item.downloads ?? 0} downloads</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => void toggleStatus(item)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm ${
                        item.status
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-zinc-500/10 text-zinc-500"
                      }`}
                    >
                      <Power className="h-4 w-4" />
                      {item.status ? "Aktif" : "Nonaktif"}
                    </button>

                    <button
                      onClick={() => void deleteItem(item)}
                      className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-red-400 hover:bg-red-500/10"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
