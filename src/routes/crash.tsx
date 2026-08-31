import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Activity, Gauge, Play, Radar, RotateCcw, ShieldCheck, Timer, TrendingUp } from "lucide-react";
import { Particles, TopBar } from "@/components/vip/Chrome";
import { getUserId, PLATFORM } from "@/lib/session";
import { fetchCrashOdd, isVip } from "@/lib/firebase";
import planeArt from "@/assets/logo-crash-game.png";

export const Route = createFileRoute("/crash")({
  head: () => ({
    meta: [
      { title: "كاشف لعبة الطيارة — ثغرات التطبيقات" },
      { name: "description", content: "توقع أودد لعبة الطيارة Crash على Xparibet مباشرة." },
      { property: "og:title", content: "كاشف لعبة الطيارة — ثغرات التطبيقات" },
      { property: "og:description", content: "توقع الأودد قبل الانفجار في لعبة الطيارة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CrashPage,
});

function CrashPage() {
  const [userId, setUserId] = useState("");
  const [odd, setOdd] = useState(1);
  const [target, setTarget] = useState(0);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const raf = useRef<number | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [tip, setTip] = useState({ x: 0, y: 100 });

  useEffect(() => {
    setUserId(getUserId() || "GUEST");
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const start = async () => {
    if (running) return;
    const vip = isVip(getUserId());
    const remote = vip ? await fetchCrashOdd() : null;
    const randomOdd = Math.round((1.01 + Math.random() * 4.99) * 100) / 100;
    const t = vip && remote !== null ? remote : randomOdd;
    setTarget(t);
    setOdd(1);
    setRunning(true);
    const t0 = performance.now();
    const dur = 2600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setOdd(1 + (t - 1) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else {
        setRunning(false);
        setHistory((h) => [t, ...h].slice(0, 8));
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  const restart = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setRunning(false);
    setOdd(1);
    setTarget(0);
  };

  const progress = target > 1 ? Math.min(1, (odd - 1) / (target - 1)) : 0;
  const done = !running && target > 1;
  const avg = history.length
    ? (history.reduce((a, b) => a + b, 0) / history.length).toFixed(2)
    : "0.00";

  return (
    <main className="page-bg screen-frame relative min-h-screen pb-12">
      <Particles />
      <div className="relative z-10">
        <TopBar
          title="كاشف الطيارة"
          right={
            <span className="block truncate rounded-lg border border-border bg-secondary/60 px-2 py-1 text-[9px] text-muted-foreground">
              ID: {userId}
            </span>
          }
        />

        <div className="px-4 pt-5">
          {/* Hero */}
          <section className="card-elite animate-rise relative mb-4 overflow-hidden rounded-[28px] p-4">
            <span
              aria-hidden
              className="animate-breathe pointer-events-none absolute -left-14 -top-16 h-48 w-48 rounded-full bg-primary/25 blur-3xl"
            />
            <span
              aria-hidden
              className="animate-scan pointer-events-none absolute inset-x-0 h-14 opacity-30"
              style={{
                background:
                  "linear-gradient(180deg,transparent,oklch(0.65 0.24 25 / 40%),transparent)",
              }}
            />
            <div className="relative flex items-center gap-3">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                <span className="ring-conic animate-spin-slow absolute inset-0 rounded-full opacity-70" />
                <img
                  src={planeArt}
                  alt="لعبة الطيارة"
                  width={768}
                  height={768}
                  className="animate-breathe relative h-12 w-12 object-contain drop-shadow-[0_0_18px_var(--primary-glow)]"
                />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <p className="flex items-center justify-end gap-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  Crash Signal <Radar className="h-3.5 w-3.5" />
                </p>
                <h1 className="neon-text mt-0.5 truncate text-xl font-extrabold">لعبة الطيارة</h1>
                <p className="text-[10px] text-muted-foreground">Aviator · Crash Predictor</p>
              </div>
              <span className="shrink-0 rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
                {PLATFORM.name}
              </span>
            </div>

            <div className="relative mt-3.5 grid grid-cols-4 gap-2 border-t border-border pt-3 text-center">
              {[
                { icon: Gauge, k: "الدقة", v: "96%" },
                { icon: Timer, k: "الجولات", v: `${history.length}` },
                { icon: TrendingUp, k: "المتوسط", v: `x${avg}` },
                { icon: Activity, k: "الحالة", v: running ? "تحليل" : "جاهز" },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="rounded-2xl border border-primary/20 bg-primary/5 py-2">
                  <Icon className="mx-auto h-3.5 w-3.5 text-primary" />
                  <b className="mt-1 block text-[11px] font-extrabold text-foreground">{v}</b>
                  <span className="text-[8.5px] text-muted-foreground">{k}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Board */}
          <section
            className="glass animate-rise relative mx-auto overflow-hidden rounded-[28px] border border-primary/25"
            style={{ height: 270 }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(oklch(0.62 0.24 25/30%) 1px,transparent 1px),linear-gradient(90deg,oklch(0.62 0.24 25/30%) 1px,transparent 1px)",
                backgroundSize: "26px 26px",
              }}
            />
            {/* axis labels */}
            <div
              dir="ltr"
              className="pointer-events-none absolute inset-y-3 left-2 flex flex-col justify-between text-[8px] text-muted-foreground/50"
            >
              {["x5", "x4", "x3", "x2", "x1"].map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient id="crashline" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="oklch(0.45 0.2 25)" />
                  <stop offset="100%" stopColor="oklch(0.78 0.2 85)" />
                </linearGradient>
                <linearGradient id="crashfill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.24 25/45%)" />
                  <stop offset="100%" stopColor="oklch(0.62 0.24 25/0%)" />
                </linearGradient>
              </defs>
              <path
                d={`M0,100 C ${55 * progress},100 ${88 * progress},${100 - 32 * progress} ${100 * progress},${100 - 96 * progress} L ${100 * progress},100 Z`}
                fill="url(#crashfill)"
              />
              {/* line draws itself from bottom-left to top-right */}
              <path
                d="M0,100 C 55,100 88,68 100,4"
                fill="none"
                stroke="url(#crashline)"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={100 - progress * 100}
                style={{ filter: "drop-shadow(0 0 10px oklch(0.62 0.24 25))" }}
              />
            </svg>

            <span
              aria-hidden
              className="absolute h-3.5 w-3.5 rounded-full bg-primary shadow-[0_0_18px_var(--primary-glow)] transition-opacity"
              style={{
                left: `calc(${progress * 100}% - 7px)`,
                bottom: `calc(${progress * 96}% - 7px)`,
                opacity: target > 1 ? 1 : 0,
              }}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`neon-text text-[3.2rem] font-extrabold leading-none tabular-nums ${running ? "text-primary" : done ? "text-gold" : "text-foreground"}`}
              >
                x{odd.toFixed(2)}
              </span>
              <span className="mt-2 rounded-full border border-primary/30 bg-background/50 px-3 py-1 text-[9.5px] tracking-[0.3em] text-muted-foreground">
                {running ? "TRACKING..." : done ? "CASH OUT" : "READY"}
              </span>
            </div>
          </section>

          {/* History */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="flex shrink-0 items-center gap-1 text-[9px] text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-primary" /> آخر النتائج
            </span>
            {history.length === 0 && (
              <span className="text-[9px] text-muted-foreground/60">لا توجد جولات بعد</span>
            )}
            {history.map((h, i) => (
              <span
                key={i}
                className={`animate-fade-up shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                  h >= 2
                    ? "border-success/50 bg-success/10 text-success"
                    : "border-primary/50 bg-primary/10 text-primary"
                }`}
              >
                x{h.toFixed(2)}
              </span>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => void start()}
              disabled={running}
              className="gradient-primary sheen-on-hover flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold text-primary-foreground shadow-[var(--glow-lg)] transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-50"
            >
              <Play className="h-4 w-4" /> بدأ الكشف
            </button>
            <button
              onClick={restart}
              className="flex items-center justify-center gap-2 rounded-2xl border border-primary/60 bg-transparent py-3.5 text-sm font-bold text-primary shadow-[var(--glow-sm)] transition-colors hover:bg-primary/10"
            >
              <RotateCcw className="h-4 w-4" /> إعادة
            </button>
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[9.5px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-primary" /> إشارة مشفرة من سيرفر الكشف
          </p>
        </div>
      </div>
    </main>
  );
}
