import { NextResponse } from "next/server";

const systemPrompt = `Kamu adalah Macrro AI, asisten resmi untuk Macrro Online. Jawab dalam bahasa Indonesia yang jelas, singkat, ramah, natural, dan membantu. Pahami percakapan sebelumnya dan jangan mengulang jawaban template jika pertanyaan pengguna bisa dijawab secara langsung.

Macrro Online adalah platform download software, tools, macro, dan utilitas untuk Windows. Eksekusi program dilakukan secara lokal di komputer pengguna, bukan di server Macrro Online. Jangan mengklaim file aman 100%; jelaskan bahwa pengguna tetap perlu memeriksa sumber, antivirus, dan izin aplikasi.

Kamu dapat membantu menjelaskan apa itu macro, fungsi macro, cara penggunaan, download, FAQ, keamanan file, Windows, Roblox secara umum, dan fitur Macrro Online. Jika informasi harga atau status pembayaran tidak tersedia dalam konteks, jangan menebak. Katakan bahwa pengguna perlu memeriksa detail file di Download Center.

Jika pengguna menyapa seperti halo/hai, balas secara natural dan tawarkan bantuan. Jika pengguna bertanya apakah kamu bisa membantu, jawab langsung bahwa kamu bisa membantu. Jika pertanyaan kurang jelas, ajukan satu pertanyaan klarifikasi yang singkat.

Jangan memberikan instruksi untuk malware, pencurian akun, bypass keamanan, atau aktivitas berbahaya.`;

const fallback = (text: string) => {
  const q = text.toLowerCase().trim();

  if (/^(halo|hai|hello|hi|helo|haloo|halooo)[!. ]*$/.test(q)) {
    return "Halo! 👋 Saya Macrro AI. Tentu saya bisa membantu. Mau mengetahui fungsi macro, cara menggunakan macro, download, keamanan file, atau fitur Macrro Online?";
  }

  if (q.includes("bisa") && (q.includes("bantu") || q.includes("membantu"))) {
    return "Tentu bisa! 👋 Saya bisa membantu menjelaskan Macrro Online, fungsi dan penggunaan macro, download, Windows, keamanan file, serta fitur situs. Silakan tanyakan apa yang ingin kamu ketahui.";
  }

  if ((q.includes("fungsi") || q.includes("kegunaan")) && q.includes("macro")) {
    return "Macro berfungsi mengotomatiskan rangkaian tindakan yang berulang, sehingga pekerjaan tertentu bisa dilakukan lebih cepat dan konsisten pada aplikasi yang mendukung otomatisasi.";
  }

  if (q === "macro" || q.includes("apa itu macro")) {
    return "Macro adalah rangkaian tindakan atau instruksi yang dijalankan secara otomatis untuk membantu melakukan pekerjaan berulang. Penggunaannya bergantung pada aplikasi yang didukung dan aturan aplikasi tersebut.";
  }

  if (q.includes("aman") || q.includes("keamanan")) {
    return "Eksekusi file Macrro Online dilakukan secara lokal di komputer Windows kamu. Namun, tidak ada file yang bisa dijamin 100% aman. Periksa sumber file, gunakan antivirus, dan pahami izin yang diminta program sebelum menjalankannya.";
  }

  if (q.includes("cara") || q.includes("penggunaan")) {
    return "Buka halaman Cara Penggunaan di Macrro Online untuk panduan. Secara umum, baca informasi file terlebih dahulu, download file yang sesuai, lalu ikuti instruksi penggunaan dan persyaratan Windows yang tercantum.";
  }

  if (q.includes("download")) {
    return "Kamu bisa membuka Download Center Macrro Online untuk melihat file yang tersedia beserta informasi file yang tercantum di situs.";
  }

  if (q.includes("bayar") || q.includes("berbayar") || q.includes("gratis") || q.includes("harga") || q.includes("biaya") || q.includes("free") || q.includes("paid")) {
    return "Status gratis atau berbayar bergantung pada file yang tersedia di Macrro Online. Saya tidak akan menebak harga. Silakan cek detail file di Download Center untuk informasi harga atau status pembayaran yang tercantum.";
  }

  if (q.includes("windows")) {
    return "Macrro Online ditujukan untuk pengguna Windows. Periksa persyaratan sistem pada detail file sebelum mengunduh atau menjalankannya.";
  }

  if (q.includes("roblox")) {
    return "Untuk penggunaan macro pada Roblox, pastikan macro dan aplikasinya sesuai dengan ketentuan layanan game. Macrro Online hanya menyediakan informasi dan file; eksekusi dilakukan secara lokal di Windows.";
  }

  return "Saya siap membantu tentang Macrro Online, macro, cara penggunaan, download, keamanan file, Windows, dan fitur situs. Coba jelaskan pertanyaan kamu sedikit lebih spesifik.";
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const input = messages
      .filter((m: any) =>
        (m?.role === "user" || m?.role === "assistant") &&
        typeof m?.content === "string" &&
        m.content.trim()
      )
      .slice(-12)
      .map((m: any) => ({
        role: m.role,
        content: m.content.trim(),
      }));

    const latest = [...input].reverse().find((m: any) => m.role === "user")?.content || "";

    if (!latest) {
      return NextResponse.json({ message: "Silakan tulis pertanyaan kamu." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      console.error("[Macrro AI] OPENAI_API_KEY belum tersedia di environment runtime.");
      return NextResponse.json({
        message: fallback(latest),
        source: "fallback",
        error: "OPENAI_API_KEY_MISSING",
      });
    }

    const model = process.env.OPENAI_MODEL?.trim() || "gpt-5.6-luna";

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
        store: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Macrro AI] OpenAI API error ${response.status}: ${errorText}`);

      return NextResponse.json({
        message: fallback(latest),
        source: "fallback",
        error: `OPENAI_API_${response.status}`,
      });
    }

    const data = await response.json();
    const message = typeof data?.output_text === "string" && data.output_text.trim()
      ? data.output_text.trim()
      : "Maaf, saya belum mendapatkan jawaban dari model. Coba tanyakan lagi.";

    return NextResponse.json({
      message,
      source: "openai",
    });
  } catch (error) {
    console.error("[Macrro AI] Unexpected error:", error);
    return NextResponse.json({
      message: "Maaf, Macrro AI sedang mengalami gangguan. Silakan coba lagi.",
      source: "error",
    }, { status: 500 });
  }
}
