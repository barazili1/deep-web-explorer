import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Play, RotateCcw, ShieldCheck, Sparkles, Target, Zap } from "lucide-react";
import appleLogo from "@/assets/logo-apple-game.png";
import appleArt from "@/assets/art-apple.png";
import rottenArt from "@/assets/art-rotten.png";
import { DragonMark, Particles, TopBar } from "@/components/vip/Chrome";
import { WinnersFeed } from "@/components/vip/WinnersFeed";
import { getUserId, PLATFORM } from "@/lib/session";
import { buildMatrix, fetchAppleMatrix, isVip, resetAppleMatrix, type Matrix } from "@/lib/firebase";

export const Route = createFileRoute("/apple")({
  head: () => ({
    meta: [
      { title: "كاشف لعبة التفاحة — ثغرات التطبيقات" },
      { name: "description", content: "شبكة كشف الخانات الآمنة في لعبة التفاحة على Xparibet." },
      { property: "og:title", content: "كاشف لعبة التفاحة — ثغرات التطبيقات" },
      { property: "og:description", content: "اكشف الخانات الآمنة في لعبة التفاحة بدقة عالية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApplePage,
});

const ROWS = 10;
const COLS = 5;
const COEF = [1.23, 1.54, 1.93, 2.41, 4.02, 6.71, 11.18, 27.97, 69.93, 349.68];

function ApplePage() {
  const [userId, setUserId] = useState("");
  const [grid, setGrid] = useState<Matrix | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => {
    setUserId(getUserId() || "GUEST");
    return clear;
  }, [clear]);

  const start = async () => {
    if (running) return;
    clear();
    const vip = isVip(getUserId());
    const matrix = vip ? ((await fetchAppleMatrix()) ?? buildMatrix()) : buildMatrix();
    setGrid(matrix);
    setRevealed(0);
    setRunning(true);
    for (let i = 1; i <= ROWS; i++) {
      timers.current.push(
        setTimeout(() => {
          setRevealed(i);
          if (i === ROWS) setRunning(false);
        }, i * 300),
      );
    }
  };

  const restart = () => {
    clear();
    setRunning(false);
    setRevealed(0);
    setGrid(null);
    if (isVip(getUserId())) void resetAppleMatrix();
  };

  const order = Array.from({ length: ROWS }, (_, i) => ROWS - 1 - i);
  const progress = Math.round((revealed / ROWS) * 100);

  return (
    <main dir="ltr" className="page-bg screen-frame relative min-h-screen pb-10 text-left">
      <Particles />
      <div className="relative z-10">
        <TopBar
          title="Apple Predictor"
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
              className="animate-breathe pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-primary/25 blur-3xl"
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
                  src={appleLogo}
                  alt="Apple of Fortune"
                  width={768}
                  height={768}
                  className="animate-breathe relative h-12 w-12 object-contain drop-shadow-[0_0_18px_var(--primary-glow)]"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Predictor
                </p>
                <h1 className="neon-text mt-0.5 truncate text-xl font-extrabold">
                  Apple of Fortune
                </h1>
                <p className="text-[10px] text-muted-foreground">Safe cells detector</p>
              </div>
              <span className="shrink-0 rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
                {PLATFORM.name}
              </span>
            </div>

            {/* progress */}
            <div className="relative mt-4">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
                <div
                  className="h-full rounded-full transition-[width] duration-300"
                  style={{
                    width: `${progress}%`,
                    backgroundImage: "var(--gradient-primary)",
                    boxShadow: "var(--glow-sm)",
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[9px] tracking-[0.35em] text-muted-foreground/60">SCAN</span>
                <span className="text-[10px] font-bold tabular-nums text-primary">{progress}%</span>
              </div>
            </div>

            <div className="relative mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
              <span className="text-[9px] text-muted-foreground">
                Accuracy <b className="block text-[11px] text-primary">97%</b>
              </span>
              <span className="text-[9px] text-muted-foreground">
                Rows <b className="block text-[11px] text-primary">{revealed}/10</b>
              </span>
              <span className="text-[9px] text-muted-foreground">
                Status
                <b className={`block text-[11px] ${running ? "text-gold" : "text-success"}`}>
                  {running ? "SCANNING" : "READY"}
                </b>
              </span>
            </div>
          </div>

          {/* Grid */}
          <div className="glass relative space-y-1.5 rounded-3xl p-2.5">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            />
            <div className="space-y-1.5">
              {order.map((r) => {
                const open = revealed > r;
                const active = running && revealed === r;
                return (
                  <div
                    key={r}
                    className={`flex items-center gap-1.5 rounded-xl px-1 py-1 transition-all duration-300 ${
                      active ? "scale-[1.02] bg-primary/10 shadow-[var(--glow-sm)]" : ""
                    }`}
                  >
                    <span
                      className={`flex w-[54px] shrink-0 items-center justify-center gap-0.5 rounded-lg border py-1 text-center text-[10px] font-extrabold transition-colors ${
                        open
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-border bg-background/50 text-muted-foreground"
                      }`}
                    >
                      {active && <Zap className="h-2.5 w-2.5" />}
                      {COEF[r]?.toFixed(2)}x
                    </span>
                    <div className="grid min-w-0 flex-1 grid-cols-5 gap-1">
                      {Array.from({ length: COLS }).map((_, c) => {
                        const key = `m${r * COLS + c + 1}`;
                        const rotten = grid?.[r]?.[c] === true;
                        const isSafe = open && !rotten;
                        return (
                          <div
                            key={key}
                            aria-label={key}
                            className={`flex h-11 w-full min-w-0 max-w-[62px] items-center justify-center rounded-xl border transition-all duration-500 ${
                              isSafe
                                ? "animate-fade-up border-primary bg-primary/15 shadow-[var(--glow-sm)]"
                                : open
                                  ? "border-border/60 bg-muted/40 opacity-70"
                                  : active
                                    ? "animate-glow-pulse border-primary/70 bg-primary/15"
                                    : "border-border bg-background/60"
                            }`}
                          >
                            {open ? (
                              <img
                                src={isSafe ? appleArt : rottenArt}
                                alt={isSafe ? "safe" : "rotten"}
                                loading="lazy"
                                className={`h-7 w-7 object-contain ${
                                  isSafe
                                    ? "drop-shadow-[0_0_10px_var(--primary-glow)]"
                                    : "opacity-70 grayscale"
                                }`}
                              />
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="flex items-center justify-center gap-1.5 pt-1 text-[9px] tracking-widest text-muted-foreground">
              <Target className="h-3 w-3 text-primary" /> Scan starts at 1.23x upward
            </p>
          </div>

          {/* Controls */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => void start()}
              disabled={running}
              className="gradient-primary sheen-on-hover flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold text-primary-foreground shadow-[var(--glow-lg)] transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-50"
            >
              <Play className="h-4 w-4" /> START
            </button>
            <button
              onClick={restart}
              className="flex items-center justify-center gap-2 rounded-2xl border border-primary/60 bg-secondary/60 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
            >
              <RotateCcw className="h-4 w-4" /> RESTART
            </button>
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[9.5px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-primary" /> Encrypted link with the predictor
            server
          </p>

          <div className="mt-8 flex flex-col items-center">
            <DragonMark size={34} className="animate-breathe opacity-70" />
          </div>

          <div className="mt-6 w-full">
            <WinnersFeed title="Apple game live wins" />
          </div>
        </div>
      </div>
    </main>
  );
}
