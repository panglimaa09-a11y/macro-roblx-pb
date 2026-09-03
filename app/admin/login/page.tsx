"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, LockKeyhole, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      // 1. Login menggunakan Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (authError || !authData.user) {
        setError(
          authError?.message === "Invalid login credentials"
            ? "Email atau password salah."
            : authError?.message || "Login gagal."
        );
        return;
      }

      // 2. Verifikasi role admin melalui RPC Supabase
      const { data: isAdmin, error: adminError } =
        await supabase.rpc("check_admin");

      if (adminError) {
        console.error("Admin verification error:", adminError);

        await supabase.auth.signOut();

        setError(
          `Gagal memverifikasi admin: ${adminError.message}`
        );
        return;
      }

      // 3. User Auth valid tetapi bukan admin
      if (!isAdmin) {
        await supabase.auth.signOut();

        setError("Akun ini tidak memiliki akses administrator.");
        return;
      }

      // 4. Admin valid → dashboard
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="glass relative w-full max-w-md rounded-3xl p-7 sm:p-9">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xs text-white/35 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/5">
          <LockKeyhole className="h-5 w-5 text-cyan-300" />
        </div>

        <h1 className="font-outfit text-3xl font-semibold">
          Admin Access
        </h1>

        <p className="mt-2 text-sm text-white/35">
          Masuk ke kontrol pusat Macrro Online.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block text-xs text-white/40">
            Email

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              disabled={loading}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/40 disabled:opacity-50"
              placeholder="admin@macro.com"
            />
          </label>

          <label className="block text-xs text-white/40">
            Password

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              disabled={loading}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/40 disabled:opacity-50"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3">
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-2 text-[11px] text-white/25">
          <ShieldCheck className="h-4 w-4" />
          Secured by Supabase Authentication
        </div>
      </div>
    </main>
  );
}


