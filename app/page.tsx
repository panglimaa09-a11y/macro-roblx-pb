import Link from "next/link";
import {
  Download,
  ShieldCheck,
  Monitor,
  Zap,
  FileCheck2,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      <header className="border-b border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Macrro<span className="text-cyan-400"> Online</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
            <Link href="/macro" className="hover:text-white">Apa itu Macro</Link>
            <Link href="/cara-penggunaan" className="hover:text-white">Cara Penggunaan</Link>
            <Link href="/faq" className="hover:text-white">FAQ</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </nav>

          <Link
            href="/download"
            className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-cyan-300"
          >
            Download
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-28 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
            <Zap className="h-4 w-4" />
            Digital Download Platform
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
            Download software dengan
            <span className="block text-cyan-400">lebih sederhana.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
            Macrro Online menyediakan pusat download untuk file software,
            tools, macro, dan utilitas yang tersedia untuk pengguna Windows.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/download"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-7 py-4 font-semibold text-black hover:bg-cyan-300"
            >
              <Download className="h-5 w-5" />
              Buka Download Center
            </Link>

            <Link
              href="/macro"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-4 font-semibold hover:bg-white/10"
            >
              Pelajari Macro
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-16 md:grid-cols-3">
          <Feature
            icon={<Monitor />}
            title="Untuk Windows"
            description="File yang tersedia ditujukan untuk penggunaan pada lingkungan Windows sesuai informasi masing-masing file."
          />

          <Feature
            icon={<ShieldCheck />}
            title="Informasi File Jelas"
            description="Download Center menampilkan informasi dasar file seperti nama, ukuran, kategori, versi, dan deskripsi."
          />

          <Feature
            icon={<FileCheck2 />}
            title="Terpusat"
            description="Semua file yang tersedia dapat ditemukan melalui satu halaman Download Center."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Tentang Macro
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Apa sebenarnya macro?
            </h2>

            <p className="mt-5 leading-8 text-zinc-400">
              Macro adalah rangkaian tindakan yang dapat dijalankan secara
              otomatis berdasarkan instruksi atau konfigurasi tertentu.
              Penggunaannya dapat membantu mengurangi pekerjaan berulang
              ketika digunakan pada aplikasi yang mendukung otomatisasi.
            </p>

            <Link
              href="/macro"
              className="mt-7 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
            >
              Baca penjelasan lengkap
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <h3 className="text-xl font-semibold">Keamanan File</h3>

            <p className="mt-4 leading-7 text-zinc-400">
              Macrro Online menjelaskan sumber dan informasi file yang
              disediakan. Eksekusi program dilakukan secara lokal pada
              komputer pengguna, bukan dijalankan di server Macrro Online.
            </p>

            <Link
              href="/disclaimer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white"
            >
              Baca Disclaimer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Mulai sekarang
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Cari file yang kamu butuhkan
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Buka Download Center untuk melihat file yang saat ini tersedia.
            </p>

            <Link
              href="/download"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-7 py-3.5 font-semibold text-black hover:bg-cyan-300"
            >
              Lihat Download Center
              <Download className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-7">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
        {icon}
      </div>

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-zinc-500">
        {description}
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <div className="text-lg font-bold">
            Macrro<span className="text-cyan-400"> Online</span>
          </div>

          <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-500">
            Digital Download Platform untuk file software, tools, macro,
            dan utilitas.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Informasi</h3>

          <div className="mt-4 grid gap-3 text-sm text-zinc-500">
            <Link href="/macro" className="hover:text-white">Apa itu Macro</Link>
            <Link href="/cara-penggunaan" className="hover:text-white">Cara Penggunaan</Link>
            <Link href="/faq" className="hover:text-white">FAQ</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Legal</h3>

          <div className="mt-4 grid gap-3 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} Macrro Online. All rights reserved.
      </div>
    </footer>
  );
}
