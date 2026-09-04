"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  Gamepad2,
  Gem,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
  Cog,
} from "lucide-react";

export default function MaintenancePage() {
  const [message, setMessage] = useState(
    "Website sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi."
  );

  useEffect(() => {
    fetch("/api/admin/settings?maintenance_page=1&t=" + Date.now(), {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.maintenanceMessage) {
          setMessage(data.settings.maintenanceMessage);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020914] text-white selection:bg-blue-500/30">

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Main blue atmosphere */}
        <div className="absolute left-1/2 top-[5%] h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px]" />

        <div className="absolute bottom-[-260px] left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-blue-700/10 blur-[140px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(30,144,255,.32) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,.32) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "linear-gradient(to bottom, transparent 8%, black 38%, black 76%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 8%, black 38%, black 76%, transparent 100%)",
          }}
        />

        {/* Horizon glow */}
        <div className="absolute left-0 right-0 top-[39%] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        {/* Tiny lights */}
        <div className="absolute left-[8%] top-[28%] h-1 w-1 rounded-full bg-blue-400 shadow-[0_0_12px_#1683ff]" />
        <div className="absolute left-[13%] top-[34%] h-1 w-1 rounded-full bg-blue-400 shadow-[0_0_12px_#1683ff]" />
        <div className="absolute right-[10%] top-[31%] h-1 w-1 rounded-full bg-blue-400 shadow-[0_0_12px_#1683ff]" />
        <div className="absolute right-[14%] top-[37%] h-1 w-1 rounded-full bg-blue-400 shadow-[0_0_12px_#1683ff]" />

        {/* Left futuristic frame */}
        <div className="absolute -left-20 top-[17%] hidden h-[650px] w-[280px] -skew-y-[8deg] border-r border-blue-500/20 sm:block">
          <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-500/60 to-transparent" />
          <div className="absolute right-0 top-[18%] h-px w-32 bg-blue-500/60 shadow-[0_0_14px_#1683ff]" />
          <div className="absolute right-0 top-[70%] h-px w-40 bg-blue-500/40" />
        </div>

        {/* Right futuristic frame */}
        <div className="absolute -right-20 top-[17%] hidden h-[650px] w-[280px] skew-y-[8deg] border-l border-blue-500/20 sm:block">
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-500/60 to-transparent" />
          <div className="absolute left-0 top-[18%] h-px w-32 bg-blue-500/60 shadow-[0_0_14px_#1683ff]" />
          <div className="absolute left-0 top-[70%] h-px w-40 bg-blue-500/40" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1536px] flex-col px-6 py-6 sm:px-10 sm:py-7 lg:px-14">

        {/* HEADER */}
        <header className="flex items-start justify-between">

          <div>
            <div className="text-[25px] font-black tracking-[-0.04em] sm:text-[30px]">
              MACRRO{" "}
              <span className="text-blue-500 drop-shadow-[0_0_18px_rgba(37,99,235,.35)]">
                ONLINE
              </span>
            </div>

            <div className="mt-0.5 text-[9px] font-medium tracking-[0.34em] text-blue-200/70 sm:text-[11px]">
              TOOLS FOR A SMARTER GAME
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-blue-500/60 bg-[#061426]/80 px-5 py-3 shadow-[0_0_30px_rgba(0,119,255,.08)] backdrop-blur-xl">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
            </span>

            <span className="text-xs font-medium text-slate-100 sm:text-sm">
              Sistem Dalam Pemeliharaan
            </span>
          </div>
        </header>

        {/* MAIN */}
        <section className="flex flex-1 flex-col items-center pt-7 sm:pt-8">

          {/* HERO VISUAL */}
          <div className="relative h-[335px] w-full max-w-[1050px] sm:h-[380px]">

            {/* Side status cards */}
            <StatusCard
              className="left-[1%] top-[30px] hidden sm:block"
              icon={<CheckCircle2 />}
              title="System Check"
              value="Running..."
            />

            <StatusCard
              className="left-[1%] bottom-[28px] hidden sm:block"
              icon={<BarChart3 />}
              title="Performance"
              value="Optimizing..."
            />

            <StatusCard
              className="right-[1%] top-[30px] hidden sm:block"
              icon={<Database />}
              title="Database"
              value="Updating..."
            />

            <StatusCard
              className="right-[1%] bottom-[28px] hidden sm:block"
              icon={<ShieldCheck />}
              title="Security"
              value="Enhancing..."
            />

            {/* Central aura */}
            <div className="absolute left-1/2 top-[43%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[75px]" />

            {/* Outer circular reactor */}
            <div className="absolute left-1/2 top-[42%] h-[275px] w-[275px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/20 bg-blue-950/10 shadow-[0_0_70px_rgba(0,119,255,.12)] sm:h-[320px] sm:w-[320px]">

              <div className="absolute inset-8 rounded-full border border-blue-500/20" />

              <div className="absolute inset-[27px] rounded-full border border-dashed border-blue-400/15 animate-[spin_30s_linear_infinite]" />

            </div>

            {/* Gear */}
            <div className="absolute left-1/2 top-[41%] -translate-x-1/2 -translate-y-1/2">

              <div className="relative flex h-[205px] w-[205px] items-center justify-center sm:h-[240px] sm:w-[240px]">

                {/* rotating ring */}
                <div className="absolute inset-0 rounded-full border-[5px] border-slate-800 border-t-blue-400 border-r-blue-600 shadow-[0_0_28px_rgba(0,119,255,.55)] animate-[spin_8s_linear_infinite]" />

                {/* Gear body */}
                <div className="relative flex h-[175px] w-[175px] items-center justify-center sm:h-[205px] sm:w-[205px]">

                  <Cog
                    className="absolute h-[185px] w-[185px] fill-[#17283c] text-blue-300 drop-shadow-[0_0_18px_rgba(0,119,255,.65)] sm:h-[215px] sm:w-[215px]"
                    strokeWidth={1.15}
                  />

                  {/* Inner reactor */}
                  <div className="relative z-10 flex h-[105px] w-[105px] items-center justify-center rounded-full border border-blue-400/60 bg-[#031225] shadow-[inset_0_0_30px_rgba(0,119,255,.35),0_0_25px_rgba(0,119,255,.25)] sm:h-[120px] sm:w-[120px]">

                    <div className="absolute inset-2 rounded-full border border-blue-400/20" />

                    <Wrench
                      className="h-12 w-12 -rotate-12 text-cyan-400 drop-shadow-[0_0_16px_rgba(34,211,238,.9)] sm:h-14 sm:w-14"
                      strokeWidth={2.3}
                    />
                  </div>
                </div>
              </div>

              {/* Platform */}
              <div className="absolute left-1/2 top-[92%] h-[24px] w-[280px] -translate-x-1/2 rounded-[50%] border-2 border-blue-400 bg-blue-500/10 shadow-[0_0_25px_rgba(0,119,255,.8)] sm:w-[340px]" />

              <div className="absolute left-1/2 top-[98%] h-[25px] w-[220px] -translate-x-1/2 rounded-[50%] bg-blue-500/20 blur-xl sm:w-[300px]" />
            </div>

            {/* Decorative connection lines */}
            <div className="absolute left-[25%] top-[38%] hidden h-px w-[130px] bg-gradient-to-r from-blue-500/50 to-transparent sm:block" />
            <div className="absolute right-[25%] top-[38%] hidden h-px w-[130px] bg-gradient-to-l from-blue-500/50 to-transparent sm:block" />

          </div>

          {/* HEADING */}
          <div className="relative z-20 -mt-1 w-full max-w-[1000px] text-center">

            <div className="mb-3 flex items-center justify-center gap-5 text-[11px] font-bold uppercase tracking-[0.55em] text-cyan-400 sm:text-sm">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-blue-500/70" />
              <Sparkles className="h-4 w-4" />
              MOHON MAAF
              <Sparkles className="h-4 w-4" />
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-blue-500/70" />
            </div>

            <h1 className="text-[42px] font-black leading-[0.98] tracking-[-0.045em] sm:text-[62px] lg:text-[72px]">
              Sistem Kami Sedang
              <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Ada{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Perbaikan
                </span>
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-[850px] text-sm leading-6 text-blue-100/75 sm:text-lg">
              {message}
            </p>
          </div>

          {/* BENEFITS */}
          <div className="mt-8 w-full max-w-[1110px] rounded-[22px] border border-blue-500/45 bg-[#061426]/75 p-3 shadow-[0_0_45px_rgba(0,119,255,.07)] backdrop-blur-xl sm:p-4">

            <div className="grid sm:grid-cols-3 sm:divide-x sm:divide-blue-500/40">

              <Benefit
                icon={<ShieldCheck />}
                title="Layanan Lebih Stabil"
                text="Performa lebih baik"
              />

              <Benefit
                icon={<Zap />}
                title="Keamanan Lebih Kuat"
                text="Data lebih aman"
              />

              <Benefit
                icon={<Gem />}
                title="Pengalaman Lebih Baik"
                text="Fitur semakin lengkap"
              />

            </div>
          </div>

          {/* RETRY BUTTON */}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="group mt-7 flex min-w-[290px] items-center justify-center gap-3 rounded-full border border-cyan-400/80 bg-blue-500/10 px-8 py-3.5 text-base font-bold text-white shadow-[0_0_30px_rgba(0,119,255,.28),inset_0_0_18px_rgba(0,119,255,.08)] transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500/20 hover:shadow-[0_0_45px_rgba(0,119,255,.45)]"
          >
            <RefreshCw className="h-5 w-5 text-cyan-400 transition-transform duration-500 group-hover:rotate-180" />
            Silakan Coba Lagi Nanti
            <ChevronRight className="h-5 w-5 text-cyan-400" />
          </button>

          {/* QUOTE */}
          <p className="mt-6 text-center text-sm italic text-slate-400 sm:text-base">
            “Terima kasih atas kesabaran dan dukungan Anda.”
          </p>

          <p className="mt-2 text-xs text-slate-500">
            — Macrro Online Team —
          </p>

        </section>

        {/* FOOTER */}
        <footer className="mt-5 flex items-end justify-between border-t border-blue-500/10 pt-5">

          <div className="flex items-center gap-3 text-slate-400">
            <Gamepad2 className="h-8 w-8 text-blue-400 drop-shadow-[0_0_10px_rgba(37,99,235,.55)]" />

            <div className="text-[10px] leading-4 sm:text-xs">
              <div>Play Smarter</div>
              <div className="text-slate-500">With Macrro Online</div>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <div className="text-[10px] font-semibold tracking-[0.42em] text-slate-400">
              STAY TUNED
            </div>

            <div className="mt-1 text-[9px] tracking-[0.2em] text-slate-600">
              FOR A BETTER EXPERIENCE
            </div>

            <div className="mt-2 ml-auto h-1.5 w-28 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-1/2 rounded-full bg-blue-500 shadow-[0_0_12px_#1683ff]" />
            </div>
          </div>

        </footer>
      </div>
    </main>
  );
}

function StatusCard({
  icon,
  title,
  value,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute z-20 w-[235px] rounded-[15px] border border-blue-500/45 bg-[#07192d]/80 p-4 shadow-[0_0_30px_rgba(0,119,255,.08)] backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 shadow-[inset_0_0_18px_rgba(0,119,255,.08)]">
          {icon}
        </div>

        <div>
          <div className="text-[15px] font-medium text-cyan-400">
            {title}
          </div>

          <div className="mt-1 text-sm text-slate-200">
            {value}
          </div>
        </div>

      </div>
    </div>
  );
}

function Benefit({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 lg:px-8">

      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-cyan-400 shadow-[inset_0_0_18px_rgba(0,119,255,.08)]">
        {icon}
      </div>

      <div className="text-left">
        <div className="text-sm font-bold text-white sm:text-base">
          {title}
        </div>

        <div className="mt-1 text-xs text-blue-100/55 sm:text-sm">
          {text}
        </div>
      </div>

    </div>
  );
}
