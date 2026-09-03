"use client";

import { FormEvent, useState } from "react";
import { Bot, MessageCircle, Send, X, Loader2 } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const quickQuestions = ["Apa itu macro?", "Cara penggunaan?", "Apakah file aman?", "Macro untuk Windows?"];

export default function MacrroAiChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Halo! Saya Macrro AI. Saya bisa membantu menjelaskan macro, cara penggunaan, download, keamanan file, dan fitur Macrro Online." },
  ]);

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await response.json();
      setMessages((current) => [...current, { role: "assistant", content: data.message || "Maaf, saya belum bisa menjawab saat ini." }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "Koneksi ke asisten sedang bermasalah. Silakan coba lagi." }]);
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-[min(390px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1018]/95 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300"><Bot size={21} /></div>
              <div><p className="font-semibold">Macrro AI</p><p className="text-xs text-white/50">Asisten Macrro Online</p></div>
            </div>
            <button aria-label="Tutup chat" onClick={() => setOpen(false)} className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white"><X size={18} /></button>
          </div>

          <div className="h-[390px] overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${message.role === "user" ? "bg-cyan-400 text-slate-950" : "bg-white/7 text-white/85"}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {quickQuestions.map((question) => <button key={question} onClick={() => void sendMessage(question)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/65 hover:border-cyan-400/30 hover:text-cyan-200">{question}</button>)}
              </div>
            )}
            {loading && <div className="flex items-center gap-2 text-xs text-white/45"><Loader2 size={14} className="animate-spin" /> Macrro AI sedang mengetik...</div>}
          </div>

          <form onSubmit={submit} className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1">
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tulis pertanyaan..." className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-white placeholder:text-white/35" disabled={loading} />
              <button aria-label="Kirim" type="submit" disabled={loading || !input.trim()} className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-400 text-slate-950 disabled:opacity-30"><Send size={16} /></button>
            </div>
          </form>
        </div>
      )}

      {!open && <button onClick={() => setOpen(true)} aria-label="Buka Macrro AI" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5"><MessageCircle size={19} /> Tanya Macrro AI</button>}
    </>
  );
}
