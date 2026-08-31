import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DragonMark, Particles } from "@/components/vip/Chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DARK WEB — أداة كشف لعبة التفاحة" },
      {
        name: "description",
        content: "منصة DARK WEB لكشف مربعات لعبة التفاحة على 1XBET و GREENBET بتفعيل VIP.",
      },
      { property: "og:title", content: "DARK WEB" },
      { property: "og:description", content: "تفعيل VIP وكشف لعبة التفاحة بأناقة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Splash,
});

const PHASES = [
  "تهيئة النظام الآمن",
  "تشفير الاتصال بالسيرفر",
  "تحميل خوارزمية الكشف",
  "جاهز للانطلاق",
];

const WORD = "DARK".split("");

function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : Math.min(100, p + Math.random() * 6 + 2)));
    }, 95);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setLeaving(true);
      const t = setTimeout(() => navigate({ to: "/platforms" }), 700);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [progress, navigate]);

  const phase = PHASES[Math.min(PHASES.length - 1, Math.floor(progress / 26))]!;
  const R = 78;
  const C = 2 * Math.PI * R;

  return (
    <main
      className={`page-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 transition-all duration-700 ${
        leaving ? "scale-[1.08] opacity-0 blur-md" : "opacity-100"
      }`}
    >
      <Particles />

      {/* corner brackets */}
      {[
        "left-5 top-5 border-l border-t",
        "right-5 top-5 border-r border-t",
        "left-5 bottom-5 border-b border-l",
        "right-5 bottom-5 border-b border-r",
      ].map((c) => (
        <span
          key={c}
          aria-hidden
          className={`pointer-events-none absolute h-10 w-10 rounded-[6px] border-primary/45 ${c}`}
        />
      ))}

      {/* emblem + ring gauge */}
      <div className="relative z-10 flex flex-col items-center">
        <span className="animate-breathe pointer-events-none absolute h-72 w-72 rounded-full bg-primary/25 blur-[120px]" />

        <div className="relative flex h-[196px] w-[196px] items-center justify-center">
          <svg viewBox="0 0 196 196" className="absolute inset-0 h-full w-full -rotate-90">
            <defs>
              <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.55 0.26 25)" />
                <stop offset="100%" stopColor="oklch(0.78 0.2 25)" />
              </linearGradient>
            </defs>
            <circle
              cx="98"
              cy="98"
              r={R}
              fill="none"
              stroke="oklch(0.7 0.2 25 / 12%)"
              strokeWidth="2"
            />
            <circle
              cx="98"
              cy="98"
              r={R}
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C - (C * progress) / 100}
              style={{
                transition: "stroke-dashoffset 200ms linear",
                filter: "drop-shadow(0 0 8px oklch(0.7 0.26 25 / 80%))",
              }}
            />
          </svg>

          {/* orbiting satellite */}
          <span className="animate-orbit absolute inset-0">
            <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary-glow shadow-[var(--glow-md)]" />
          </span>
          <span className="absolute inset-8 rounded-full border border-dashed border-primary/20" />

          <DragonMark size={104} className="relative animate-rise" />
        </div>

        {/* wordmark */}
        <div dir="ltr" className="mt-10 flex items-end gap-[3px]" style={{ perspective: 600 }}>
          {WORD.map((ch, i) => (
            <span
              key={`${ch}-${i}`}
              className="animate-letter text-[1.45rem] font-extrabold leading-none text-foreground drop-shadow-[0_0_14px_var(--primary-glow)]"
              style={{ animationDelay: `${120 + i * 55}ms` }}
            >
              {ch}
            </span>
          ))}
        </div>
        <div className="mt-3.5 flex w-full max-w-[240px] items-center gap-3">
          <span className="hairline flex-1" />
          <span className="text-[10px] font-bold tracking-[0.55em] text-primary">WEB</span>
          <span className="hairline flex-1" />
        </div>
      </div>

      {/* bottom status */}
      <div className="absolute inset-x-0 bottom-12 z-10 flex flex-col items-center gap-3 px-10">
        <p
          key={phase}
          className="animate-fade-up text-[11px] tracking-[0.18em] text-muted-foreground"
        >
          {phase}
        </p>
        <div className="relative h-px w-full max-w-[260px] overflow-hidden bg-primary/15">
          <div
            className="h-full transition-[width] duration-200 ease-out"
            style={{
              width: `${progress}%`,
              backgroundImage: "var(--gradient-primary)",
              boxShadow: "var(--glow-md)",
            }}
          />
        </div>
        <p className="text-[9px] tracking-[0.45em] text-primary/80">{Math.floor(progress)}%</p>
        <p className="mt-1 text-[8px] tracking-[0.5em] text-muted-foreground/50">
          SECURE · ENCRYPTED · VIP
        </p>
      </div>
    </main>
  );
}
