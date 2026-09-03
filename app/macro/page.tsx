import Link from "next/link";

export default function MacroPage() {
  return (
    <main className="min-h-screen bg-[#0a0b10] px-6 py-16 text-white">
      <article className="mx-auto max-w-4xl">
        <Link href="/" className="text-cyan-400">← Macrro Online</Link>

        <h1 className="mt-10 text-4xl font-bold">Apa itu Macro?</h1>

        <p className="mt-6 leading-8 text-zinc-400">
          Macro adalah rangkaian tindakan yang dapat dijalankan secara
          otomatis untuk membantu pekerjaan yang berulang. Bentuk macro
          dapat berbeda tergantung aplikasi atau software yang digunakan.
        </p>

        <h2 className="mt-12 text-2xl font-semibold">Bagaimana cara kerjanya?</h2>

        <p className="mt-4 leading-8 text-zinc-400">
          Macro dapat merekam atau menjalankan serangkaian input seperti
          klik mouse, penekanan keyboard, jeda waktu, atau tindakan lain
          yang didukung oleh software tertentu.
        </p>

        <h2 className="mt-12 text-2xl font-semibold">Eksekusi lokal</h2>

        <p className="mt-4 leading-8 text-zinc-400">
          File program yang diunduh dari Macrro Online dijalankan pada
          perangkat pengguna. Macrro Online berfungsi sebagai platform
          penyedia dan distribusi file, bukan sebagai lingkungan eksekusi
          program pengguna.
        </p>

        <Link
          href="/download"
          className="mt-10 inline-block rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-black"
        >
          Buka Download Center
        </Link>
      </article>
    </main>
  );
}
