import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, TerminalSquare } from "lucide-react";
import { DragonMark, Particles } from "@/components/vip/Chrome";
import { BRAND } from "@/lib/session";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ثغرات التطبيقات — كاشف الألعاب" },
      {
        name: "description",
        content:
          "منصة ثغرات التطبيقات لكشف نتائج لعبة التفاحة ولعبة الطيارة على Xparibet بتفعيل VIP.",
      },
      { property: "og:title", content: "ثغرات التطبيقات" },
      { property: "og:description", content: "تفعيل VIP وكشف نتائج الألعاب بدقة عالية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Splash,
});

const LOGS = [
  "> بدء تشغيل النواة الآمنة",
  "> فحص ثغرات التطبيقات",
  "> تشفير الاتصال بالسيرفر",
  "> تحميل خوارزمية الكشف",
  "> الاتصال بمنصة Xparibet",
  "> النظام جاهز",
];

function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : Math.min(100, p + Math.random() * 5 + 2)));
    }, 95);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setLeaving(true);
      const t = setTimeout(() => navigate({ to: "/conditions" }), 650);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [progress, navigate]);

  const shown = Math.min(LOGS.length, Math.max(1, Math.ceil((progress / 100) * LOGS.length)));

  return (
    <main
      className={`page-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-7 transition-all duration-700 ${
        leaving ? "scale-[1.06] opacity-0 blur-md" : "opacity-100"
      }`}
    >
      <Particles />

      {/* scanning beam */}
      <span
        aria-hidden
        className="animate-scan pointer-events-none absolute inset-x-0 h-24 opacity-40"
        style={{
          background:
            "linear-gradient(180deg,transparent,oklch(0.65 0.24 25 / 35%),transparent)",
        }}
      />

      {/* grid backdrop */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.62 0.24 25) 1px,transparent 1px),linear-gradient(90deg,oklch(0.62 0.24 25) 1px,transparent 1px)",
          backgroundSize: "38px 38px",
          maskImage: "radial-gradient(circle at 50% 45%, black, transparent 72%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-[340px] flex-col items-center">
        <span className="animate-breathe pointer-events-none absolute -top-6 h-64 w-64 rounded-full bg-primary/25 blur-[120px]" />

        {/* hex emblem */}
        <div className="relative flex h-[170px] w-[170px] items-center justify-center">
          <span className="ring-conic animate-spin-slow absolute inset-0 rounded-full opacity-70" />
          <span className="absolute inset-5 rounded-full border border-dashed border-primary/25" />
          <span className="animate-orbit absolute inset-2">
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-primary-glow shadow-[var(--glow-md)]" />
          </span>
          <DragonMark size={104} className="relative animate-rise" />
        </div>

        <h1 className="text-shimmer animate-fade-up mt-6 text-center text-[1.7rem] font-black leading-tight">
          {BRAND}
        </h1>
        <p className="mt-2 flex items-center gap-2 text-[10px] tracking-[0.4em] text-primary/85">
          <ShieldCheck className="h-3.5 w-3.5" /> SECURE · VIP · 2026
        </p>

        {/* platform badge */}
        <div className="glass mt-6 flex items-center justify-center gap-2 rounded-2xl border border-primary/20 px-4 py-2.5">
          <img
            src={xpLogo}
            alt="Xparibet"
            width={447}
            height={447}
            className="h-7 w-7 rounded-full object-cover ring-1 ring-primary/40"
          />
          <span className="text-[11px] font-bold text-foreground">Xparibet</span>
          <span className="text-[10px] text-muted-foreground">· المنصة المعتمدة</span>
        </div>


        {/* progress */}
        <div className="mt-5 w-full">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full rounded-full transition-[width] duration-200 ease-out"
              style={{
                width: `${progress}%`,
                backgroundImage: "var(--gradient-primary)",
                boxShadow: "var(--glow-md)",
              }}
            />
          </div>
          <div dir="ltr" className="mt-2 flex items-center justify-between">
            <span className="text-[9px] tracking-[0.35em] text-muted-foreground/60">LOADING</span>
            <span className="text-[10px] font-bold tabular-nums text-primary">
              {Math.floor(progress)}%
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
