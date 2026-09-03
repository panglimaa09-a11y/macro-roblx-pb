import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      <header className="border-b border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-cyan-400">MACRRO</span> ONLINE
          </Link>

          <Link
            href="/download"
            className="rounded-lg border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10"
          >
            Download Center
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Contact
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Hubungi Macrro Online
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/60">
            Jika Anda memiliki pertanyaan, membutuhkan bantuan, menemukan
            masalah pada website, atau ingin menyampaikan informasi terkait
            file yang tersedia di Macrro Online, silakan hubungi kami melalui
            email.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-white/[0.03] p-8 shadow-2xl shadow-cyan-950/20">
          <p className="text-sm text-white/50">Email resmi</p>

          <a
            href="mailto:nexorateam44@gmail.com"
            className="mt-3 inline-block text-xl font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            nexorateam44@gmail.com
          </a>

          <p className="mt-5 text-sm leading-6 text-white/50">
            Kami menyarankan Anda menjelaskan kebutuhan atau kendala secara
            jelas agar dapat membantu proses penanganan dengan lebih cepat.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/faq"
            className="rounded-xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-cyan-400/30 hover:bg-white/[0.04]"
          >
            <h2 className="font-semibold">FAQ</h2>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Lihat pertanyaan yang sering diajukan sebelum menghubungi kami.
            </p>
          </Link>

          <Link
            href="/disclaimer"
            className="rounded-xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-cyan-400/30 hover:bg-white/[0.04]"
          >
            <h2 className="font-semibold">Disclaimer</h2>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Baca informasi dan batas tanggung jawab penggunaan platform.
            </p>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        © {new Date().getFullYear()} Macrro Online. All rights reserved.
      </footer>
    </main>
  );
}
