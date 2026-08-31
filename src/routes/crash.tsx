import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Play, Radar, RotateCcw, ShieldCheck, TrendingUp } from "lucide-react";
import { DragonMark, Particles, TopBar } from "@/components/vip/Chrome";
import { WinnersFeed } from "@/components/vip/WinnersFeed";
import { getUserId, PLATFORM } from "@/lib/session";
import { fetchCrashOdd, isVip } from "@/lib/firebase";
import planeArt from "@/assets/art-plane.png";

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
        setHistory((h) => [t, ...h].slice(0, 6));
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

  return (
    <main className="page-bg screen-frame relative min-h-screen pb-10">
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
          <div className="card-elite animate-rise relative mb-4 overflow-hidden rounded-[28px] p-4">
            <span
              aria-hidden
              className="animate-breathe pointer-events-none absolute -left-12 -top-14 h-44 w-44 rounded-full bg-primary/25 blur-3xl"
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
                <p className="text-[10px] text-muted-foreground">Aviator · Crash</p>
              </div>
              <span className="shrink-0 rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
                {PLATFORM.name}
              </span>
            </div>
            <div className="relative mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
              <span className="text-[9px] text-muted-foreground">
                الدقة <b className="block text-[11px] text-primary">96%</b>
              </span>
              <span className="text-[9px] text-muted-foreground">
                الجولات <b className="block text-[11px] text-primary">{history.length}</b>
              </span>
              <span className="text-[9px] text-muted-foreground">
                الحالة
                <b className={`block text-[11px] ${running ? "text-gold" : "text-success"}`}>
                  {running ? "جارٍ التحليل" : "جاهز"}
                </b>
              </span>
            </div>
          </div>

          {/* Board */}
          <div
            className="glass relative mx-auto overflow-hidden rounded-3xl"
            style={{ height: 240 }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "linear-gradient(oklch(0.62 0.24 25/30%) 1px,transparent 1px),linear-gradient(90deg,oklch(0.62 0.24 25/30%) 1px,transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient id="crashline" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="oklch(0.45 0.2 25)" />
                  <stop offset="100%" stopColor="oklch(0.72 0.24 27)" />
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
              <path
                d={`M0,100 C ${55 * progress},100 ${88 * progress},${100 - 32 * progress} ${100 * progress},${100 - 96 * progress}`}
                fill="none"
                stroke="url(#crashline)"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 8px oklch(0.62 0.24 25))" }}
              />
            </svg>
            <span
              aria-hidden
              className="absolute h-3 w-3 rounded-full bg-primary shadow-[0_0_16px_var(--primary-glow)] transition-opacity"
              style={{
                left: `calc(${progress * 100}% - 6px)`,
                bottom: `calc(${progress * 96}% - 6px)`,
                opacity: target > 1 ? 1 : 0,
              }}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`neon-text text-5xl font-extrabold tabular-nums ${running ? "text-primary" : done ? "text-gold" : "text-foreground"}`}
              >
                x{odd.toFixed(2)}
              </span>
              <span className="mt-1 text-[10px] tracking-[0.3em] text-muted-foreground">
                {running ? "TRACKING..." : done ? "CASH OUT" : "READY"}
              </span>
            </div>
          </div>

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
                className="animate-fade-up shrink-0 rounded-full border border-primary/50 bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary"
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
              <Play className="h-4 w-4" /> بدأ
            </button>
            <button
              onClick={restart}
              className="flex items-center justify-center gap-2 rounded-2xl border border-primary/60 bg-transparent py-3.5 text-sm font-bold text-primary shadow-[var(--glow-sm)] transition-colors hover:bg-primary/10"
            >
              <RotateCcw className="h-4 w-4" /> إعادة بدأ
            </button>
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[9.5px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-primary" /> إشارة مشفرة من سيرفر الكشف
          </p>

          <div className="mt-8 flex flex-col items-center">
            <DragonMark size={34} className="animate-breathe opacity-70" />
          </div>

          <div className="mt-6 w-full">
            <WinnersFeed title="أرباح لعبة الطيارة — مباشر" />
          </div>
        </div>
      </div>
    </main>
  );
}
