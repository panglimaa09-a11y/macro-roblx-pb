import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0b10] px-6 py-16 text-white">
      <article className="mx-auto max-w-4xl">
        <Link href="/" className="text-cyan-400">← Macrro Online</Link>

        <h1 className="mt-10 text-4xl font-bold">Terms of Service</h1>

        <h2 className="mt-10 text-2xl font-semibold">Penggunaan layanan</h2>
        <p className="mt-4 leading-8 text-zinc-400">
          Pengguna bertanggung jawab menggunakan Macrro Online sesuai
          hukum yang berlaku dan tidak menyalahgunakan layanan.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">File dan software</h2>
        <p className="mt-4 leading-8 text-zinc-400">
          Setiap file dapat memiliki persyaratan, lisensi, atau ketentuan
          penggunaan tersendiri. Pengguna bertanggung jawab membaca
          informasi dan lisensi yang terkait dengan file tersebut.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Perubahan layanan</h2>
        <p className="mt-4 leading-8 text-zinc-400">
          Macrro Online dapat mengubah, menambahkan, atau menghapus fitur
          layanan untuk kebutuhan pengembangan dan operasional.
        </p>
      </article>
    </main>
  );
}
