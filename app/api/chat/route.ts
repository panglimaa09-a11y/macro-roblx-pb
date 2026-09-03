import { NextResponse } from "next/server";

const systemPrompt = `Kamu adalah Macrro AI, asisten resmi untuk Macrro Online. Jawab dalam bahasa Indonesia yang jelas, singkat, ramah, dan natural. Kamu harus bisa menjawab sapaan umum seperti halo, pertanyaan apakah kamu bisa membantu, dan pertanyaan lanjutan berdasarkan percakapan. Macrro Online adalah platform download software, tools, macro, dan utilitas untuk Windows. Eksekusi program dilakukan secara lokal di komputer pengguna, bukan di server Macrro Online. Jangan mengklaim file aman 100%; jelaskan bahwa pengguna tetap perlu memeriksa sumber, antivirus, dan izin aplikasi. Bantu pertanyaan tentang apa itu macro, cara penggunaan, download, FAQ, keamanan file, status gratis/berbayar, dan navigasi situs. Jika informasi harga atau status pembayaran tidak tersedia di data yang diberikan, jangan menebak. Jangan memberikan instruksi untuk malware, pencurian akun, bypass keamanan, atau aktivitas berbahaya.`;

const fallback = (text: string) => {
  const q = text.toLowerCase().trim();
  if (/^(halo|hai|hello|hi|helo|haloo|halooo)[!. ]*$/.test(q)) return "Halo! 👋 Saya Macrro AI. Tentu saya bisa membantu. Kamu bisa bertanya tentang macro, download, Windows, keamanan file, cara penggunaan, atau fitur Macrro Online.";
  if (q.includes("bisa") && (q.includes("bantu") || q.includes("membantu"))) return "Tentu bisa! 👋 Saya bisa membantu menjelaskan macro, cara penggunaan, download, Windows, keamanan file, serta fitur-fitur Macrro Online. Silakan tanyakan apa yang ingin kamu ketahui.";
  if (q.includes("apa itu") && q.includes("macro")) return "Macro adalah rangkaian tindakan yang dijalankan otomatis berdasarkan instruksi atau konfigurasi tertentu untuk membantu mengurangi pekerjaan berulang pada aplikasi yang mendukung otomatisasi.";
  if (q.includes("aman") || q.includes("keamanan")) return "Eksekusi file Macrro Online dilakukan secara lokal di komputer Windows kamu. Namun, tidak ada file yang bisa dijamin 100% aman. Periksa sumber file, gunakan antivirus, dan pastikan kamu memahami izin yang diminta program sebelum menjalankannya.";
  if (q.includes("cara") || q.includes("penggunaan")) return "Buka halaman Cara Penggunaan di Macrro Online untuk panduan. Secara umum, baca informasi file terlebih dahulu, download file yang sesuai, lalu ikuti instruksi penggunaan dan persyaratan Windows yang tercantum.";
  if (q.includes("download")) return "Kamu bisa membuka Download Center Macrro Online untuk melihat file yang tersedia beserta nama, ukuran, kategori, versi, dan deskripsinya.";
  if (q.includes("bayar") || q.includes("berbayar") || q.includes("gratis") || q.includes("harga") || q.includes("biaya") || q.includes("free") || q.includes("paid")) return "Status gratis atau berbayar bergantung pada file yang tersedia di Macrro Online. Saya tidak akan menebak harga. Silakan cek detail file di Download Center untuk informasi harga atau status pembayaran yang tercantum.";
  if (q.includes("windows")) return "Macrro Online ditujukan untuk pengguna Windows. Periksa persyaratan sistem pada detail file sebelum mengunduh atau menjalankannya.";
  if (q.includes("roblox")) return "Untuk penggunaan macro pada Roblox, pastikan macro dan aplikasinya sesuai dengan ketentuan layanan game. Macrro Online hanya menyediakan informasi dan file; eksekusi dilakukan secara lokal di Windows.";
  return "Saya siap membantu. Kamu bisa bertanya tentang Macrro Online, macro, cara penggunaan, download, harga/gratis, keamanan file, Windows, dan fitur situs.";
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const userMessages = messages.filter((m: any) => m?.role === "user" && typeof m?.content === "string");
    const latest = userMessages.at(-1)?.content?.trim() || "";

    if (!latest) {
      return NextResponse.json({ message: "Silakan tulis pertanyaan kamu." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      console.error("[Macrro AI] OPENAI_API_KEY belum tersedia di environment.");
      return NextResponse.json({ message: fallback(latest), source: "fallback" });
    }

    const input = messages.slice(-12)
      .filter((m: any) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string")
      .map((m: any) => ({ role: m.role, content: m.content }));

    const model = process.env.OPENAI_MODEL?.trim() || "gpt-5";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        instructions: systemPrompt,
        input,
        max_output_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Macrro AI] OpenAI API error ${response.status}:`, errorText);
      return NextResponse.json({
        message: fallback(latest),
        source: "fallback",
        error: `OpenAI API returned ${response.status}`,
      });
    }

    const data = await response.json();
    const message = typeof data?.output_text === "string" && data.output_text.trim()
      ? data.output_text.trim()
      : fallback(latest);

    return NextResponse.json({ message, source: "openai" });
  } catch (error) {
    console.error("[Macrro AI] Unexpected error:", error);
    return NextResponse.json({ message: "Maaf, Macrro AI sedang mengalami gangguan. Silakan coba lagi." }, { status: 500 });
  }
}
