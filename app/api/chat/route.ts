import { NextResponse } from "next/server";

const systemPrompt = `Kamu adalah Macrro AI, asisten resmi untuk Macrro Online. Jawab dalam bahasa Indonesia yang jelas, singkat, ramah, dan faktual. Macrro Online adalah platform download software, tools, macro, dan utilitas untuk Windows. Eksekusi program dilakukan secara lokal di komputer pengguna, bukan di server Macrro Online. Jangan mengklaim file aman 100%; jelaskan bahwa pengguna tetap perlu memeriksa sumber, antivirus, dan izin aplikasi. Bantu pertanyaan tentang apa itu macro, cara penggunaan, download, FAQ, keamanan file, dan navigasi situs. Jika pertanyaan di luar pengetahuan situs, katakan dengan jujur bahwa kamu tidak memiliki informasi yang cukup. Jangan memberikan instruksi untuk malware, pencurian akun, bypass keamanan, atau aktivitas berbahaya.`;

const fallback = (text: string) => {
  const q = text.toLowerCase();
  if (q.includes("apa itu") && q.includes("macro")) return "Macro adalah rangkaian tindakan yang dijalankan otomatis berdasarkan instruksi atau konfigurasi tertentu untuk membantu mengurangi pekerjaan berulang pada aplikasi yang mendukung otomatisasi.";
  if (q.includes("aman") || q.includes("keamanan")) return "Eksekusi file Macrro Online dilakukan secara lokal di komputer Windows kamu. Namun, tidak ada file yang bisa dijamin 100% aman. Periksa sumber file, gunakan antivirus, dan pastikan kamu memahami izin yang diminta program sebelum menjalankannya.";
  if (q.includes("cara") || q.includes("penggunaan")) return "Buka halaman Cara Penggunaan di Macrro Online untuk panduan. Secara umum, baca informasi file terlebih dahulu, download file yang sesuai, lalu ikuti instruksi penggunaan dan persyaratan Windows yang tercantum.";
  if (q.includes("download")) return "Kamu bisa membuka Download Center Macrro Online untuk melihat file yang tersedia beserta nama, ukuran, kategori, versi, dan deskripsinya.";
  return "Saya siap membantu tentang Macrro Online, macro, cara penggunaan, download, dan keamanan file. Coba tanyakan sesuatu yang lebih spesifik.";
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const latest = messages.filter((m: any) => m?.role === "user" && typeof m?.content === "string").at(-1)?.content || "";
    if (!latest) return NextResponse.json({ message: "Silakan tulis pertanyaan kamu." }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ message: fallback(latest) });

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions: systemPrompt,
        input: messages.slice(-12).map((m: any) => ({ role: m.role, content: m.content })),
        max_output_tokens: 500,
      }),
    });

    if (!response.ok) return NextResponse.json({ message: fallback(latest) });
    const data = await response.json();
    const message = data.output_text || fallback(latest);
    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ message: "Maaf, terjadi kesalahan. Silakan coba lagi." }, { status: 500 });
  }
}
