import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ Macrro Online",
  description: "Temukan jawaban atas pertanyaan umum tentang Macrro Online, download macro, penggunaan tools, keamanan file, dan eksekusi lokal di Windows.",
  alternates: {
    canonical: "https://macro-roblx-pb.vercel.app/faq",
  },
  openGraph: {
    title: "FAQ Macrro Online",
    description: "Temukan jawaban atas pertanyaan umum tentang Macrro Online, download macro, penggunaan tools, keamanan file, dan eksekusi lokal di Windows.",
    url: "https://macro-roblx-pb.vercel.app/faq",
    type: "website",
    locale: "id_ID",
    siteName: "Macrro Online",
  },
};
import Link from "next/link";

const faq = [
  ["Apa itu Macrro Online?", "Macrro Online adalah platform Download Center untuk menyediakan file software, tools, macro, dan utilitas."],
  ["Apakah file dijalankan di server?", "Tidak. Program yang diunduh dijalankan secara lokal pada komputer pengguna."],
  ["Apakah semua file aman?", "Pengguna tetap harus memeriksa file sebelum menjalankannya dan memastikan sumber serta informasi file sesuai."],
  ["Apakah saya perlu memasukkan URL download?", "Tidak. Pengguna cukup memilih file yang tersedia pada Download Center."],
  ["Mengapa download membutuhkan waktu tunggu?", "Beberapa download dapat menggunakan proses countdown sebelum file siap diunduh."],
  ["Apakah Macrro Online mendukung Windows?", "File yang ditujukan untuk Windows akan dijelaskan pada informasi masing-masing file."],
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#0a0b10] px-6 py-16 text-white">
      <article className="mx-auto max-w-4xl">
        <Link href="/" className="text-cyan-400">← Macrro Online</Link>

        <h1 className="mt-10 text-4xl font-bold">Frequently Asked Questions</h1>

        <div className="mt-10 space-y-4">
          {faq.map(([question, answer]) => (
            <details key={question} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <summary className="cursor-pointer font-semibold">{question}</summary>
              <p className="mt-4 leading-7 text-zinc-400">{answer}</p>
            </details>
          ))}
        </div>
      </article>
    </main>
  );
}

