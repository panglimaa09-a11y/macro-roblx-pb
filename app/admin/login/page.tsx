"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    localStorage.setItem("macrro_admin_demo", "1");
    router.push("/admin/dashboard");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="glass relative w-full max-w-md rounded-3xl p-7 sm:p-9">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs text-white/35 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/5">
          <LockKeyhole className="h-5 w-5 text-cyan-300" />
        </div>
        <h1 className="font-outfit text-3xl font-semibold">Admin Access</h1>
        <p className="mt-2 text-sm text-white/35">Masuk ke kontrol pusat Macrro Online.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block text-xs text-white/40">
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm" placeholder="admin@example.com" />
          </label>
          <label className="block text-xs text-white/40">
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm" placeholder="••••••••" />
          </label>
          {error && <p className="text-xs text-red-300">{error}</p>}
          <button className="w-full rounded-2xl bg-cyan-300 py-3.5 text-sm font-bold text-slate-950 hover:bg-cyan-200">Login</button>
        </form>
        <div className="mt-6 flex items-center gap-2 text-[11px] text-white/25"><ShieldCheck className="h-4 w-4" /> Demo authentication — replace with Supabase Auth before production.</div>
      </div>
    </main>
  );
}