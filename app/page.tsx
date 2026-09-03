import Link from "next/link";
import { ArrowRight, Download, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="font-outfit text-xl font-semibold tracking-[.22em] text-white">
          MACRRO<span className="text-cyan-300">.</span>
        </Link>
        <Link href="/admin/login" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:border-cyan-300/30 hover:text-white">
          Admin
        </Link>
      </header>

      <section className="relative mx-auto flex min-h-[78vh] max-w-5xl flex-col items-center justify-center px-6 pb-20 text-center">
        <div className="animate-rise mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/5 px-4 py-2 text-xs font-medium tracking-[.18em] text-cyan-200/80">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
          DIGITAL DOWNLOAD PLATFORM
        </div>

        <h1 className="animate-rise font-outfit text-5xl font-semibold leading-[.95] tracking-tight sm:text-7xl lg:text-8xl">
          Download.
          <br />
          <span className="neon-text bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-transparent">Without Gravity.</span>
        </h1>

        <p className="animate-rise mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
          Tempel tautan digital kamu, buat sesi download, lewati proses keamanan dan iklan yang dikonfigurasi admin, lalu lanjutkan ke file.
        </p>

        <Link href="/download" className="animate-float glass glass-hover mt-10 inline-flex items-center gap-3 rounded-2xl px-7 py-4 text-sm font-semibold text-white shadow-neon">
          <Download className="h-5 w-5 text-cyan-300" />
          Start Download
          <ArrowRight className="h-4 w-4 text-white/50" />
        </Link>

        <div className="mt-16 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            [Zap, "Fast", "Simple download flow"],
            [ShieldCheck, "Secure", "Temporary access session"],
            [Download, "Instant", "Ready-to-download state"]
          ].map(([Icon, title, desc]) => {
            const I = Icon as typeof Zap;
            return (
              <div key={title as string} className="glass glass-hover rounded-2xl p-5 text-left">
                <I className="mb-3 h-5 w-5 text-cyan-300" />
                <div className="text-sm font-semibold">{title as string}</div>
                <div className="mt-1 text-xs leading-5 text-white/40">{desc as string}</div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}