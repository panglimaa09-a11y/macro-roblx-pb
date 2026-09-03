import Link from "next/link";

export default function CaraPenggunaanPage() {
  return (
    <main className="min-h-screen bg-[#0a0b10] px-6 py-16 text-white">
      <article className="mx-auto max-w-4xl">
        <Link href="/" className="text-cyan-400">← Macrro Online</Link>

        <h1 className="mt-10 text-4xl font-bold">Cara Penggunaan</h1>

        <div className="mt-8 grid gap-5">
          {[
            ["01", "Buka Download Center", "Pilih file yang tersedia pada halaman download."],
            ["02", "Periksa informasi file", "Baca nama file, ukuran, kategori, versi, dan deskripsi."],
            ["03", "Mulai download", "Klik tombol download dan ikuti proses yang ditampilkan."],
            ["04", "Simpan file", "Simpan file pada lokasi yang kamu kenal di komputer."],
            ["05", "Periksa sebelum menjalankan", "Pastikan file sesuai sumber dan informasi yang ditampilkan."],
            ["06", "Jalankan secara lokal", "Program berjalan pada komputer Windows pengguna sesuai fungsi program tersebut."],
          ].map(([number, title, description]) => (
            <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-sm text-cyan-400">{number}</div>
              <h2 className="mt-2 text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-zinc-400">{description}</p>
            </div>
          ))}
        </div>

        <Link
          href="/download"
          className="mt-10 inline-block rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-black"
        >
          Download Center
        </Link>
      </article>
    </main>
  );
}
