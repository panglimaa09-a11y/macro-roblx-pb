import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0b10] px-6 py-16 text-white">
      <article className="mx-auto max-w-4xl">
        <Link href="/" className="text-cyan-400">← Macrro Online</Link>

        <h1 className="mt-10 text-4xl font-bold">Privacy Policy</h1>

        <p className="mt-6 leading-8 text-zinc-400">
          Kebijakan ini menjelaskan bagaimana Macrro Online menangani
          informasi teknis yang dapat tercatat ketika pengguna mengakses
          layanan.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Informasi yang dapat dicatat</h2>
        <p className="mt-4 leading-8 text-zinc-400">
          Untuk kebutuhan operasional dan analytics, sistem dapat mencatat
          informasi seperti halaman yang diakses, session identifier,
          waktu akses, user agent, dan informasi referer apabila tersedia.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Penggunaan informasi</h2>
        <p className="mt-4 leading-8 text-zinc-400">
          Informasi tersebut digunakan untuk memahami penggunaan website,
          menjaga operasional layanan, dan meningkatkan pengalaman pengguna.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">File download</h2>
        <p className="mt-4 leading-8 text-zinc-400">
          Macrro Online menyediakan file untuk diunduh. Data analytics
          download dapat dicatat untuk statistik penggunaan layanan.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Perubahan kebijakan</h2>
        <p className="mt-4 leading-8 text-zinc-400">
          Kebijakan ini dapat diperbarui apabila fitur atau cara pengelolaan
          data pada layanan berubah.
        </p>
      </article>
    </main>
  );
}
