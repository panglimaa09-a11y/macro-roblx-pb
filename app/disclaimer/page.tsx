import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer Macrro Online mengenai penggunaan macro, tools, file download, dan aplikasi yang dijalankan secara lokal di Windows.",
  alternates: {
    canonical: "https://macro-roblx-pb.vercel.app/disclaimer",
  },
  openGraph: {
    title: "Disclaimer",
    description: "Disclaimer Macrro Online mengenai penggunaan macro, tools, file download, dan aplikasi yang dijalankan secara lokal di Windows.",
    url: "https://macro-roblx-pb.vercel.app/disclaimer",
    type: "website",
    locale: "id_ID",
    siteName: "Macrro Online",
  },
};
import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#0a0b10] px-6 py-16 text-white">
      <article className="mx-auto max-w-4xl">
        <Link href="/" className="text-cyan-400">← Macrro Online</Link>

        <h1 className="mt-10 text-4xl font-bold">Disclaimer</h1>

        <p className="mt-6 leading-8 text-zinc-400">
          Macrro Online merupakan platform distribusi dan Download Center.
          Informasi mengenai fungsi setiap file dapat berbeda sesuai dengan
          software yang disediakan.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Tanggung jawab pengguna</h2>
        <p className="mt-4 leading-8 text-zinc-400">
          Pengguna bertanggung jawab memeriksa file yang diunduh,
          memahami lisensinya, dan memastikan penggunaannya sesuai dengan
          hukum serta aturan software atau platform yang digunakan.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Eksekusi lokal</h2>
        <p className="mt-4 leading-8 text-zinc-400">
          Program yang telah diunduh dijalankan pada perangkat pengguna.
          Macrro Online tidak menjalankan program tersebut di server.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Keamanan</h2>
        <p className="mt-4 leading-8 text-zinc-400">
          Sebelum menjalankan file executable atau installer, pengguna
          disarankan memeriksa sumber file dan menggunakan perlindungan
          keamanan pada perangkatnya.
        </p>
      </article>
    </main>
  );
}

