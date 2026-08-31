import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bomb, Play, RotateCcw, Sparkles, Target } from "lucide-react";
import appleArt from "@/assets/game-apple.png";
import { Particles, TopBar } from "@/components/vip/Chrome";
import { WinnersFeed } from "@/components/vip/WinnersFeed";
import { getPlatform, getUserId, PLATFORMS } from "@/lib/session";
import { buildMatrix, fetchAppleMatrix, isVip, resetAppleMatrix, type Matrix } from "@/lib/firebase";

export const Route = createFileRoute("/apple")({
  head: () => ({
    meta: [
      { title: "كاشف لعبة التفاحة — DARK WEB" },
      { name: "description", content: "شبكة كشف الخانات الآمنة في لعبة التفاحة بأسلوب VIP." },
      { property: "og:title", content: "كاشف لعبة التفاحة — DARK WEB" },
      { property: "og:description", content: "اكشف الخانات الآمنة في لعبة التفاحة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApplePage,
});

const ROWS = 10;
const COLS = 5;
// index 0 = أول صف من تحت (1.23x) ... index 9 = أعلى صف (349.68x)
const COEF = [1.23, 1.54, 1.93, 2.41, 4.02, 6.71, 11.18, 27.97, 69.93, 349.68];


function ApplePage() {
  const [userId, setUserId] = useState("");
  const [platform, setPlatform] = useState("");
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
    const p = getPlatform();
    setPlatform(p ? PLATFORMS[p].name : "");
    return clear;
  }, [clear]);

  const start = async () => {
    if (running) return;
    clear();
    const vip = isVip(getUserId());
    // الـ VIP المحدد فقط يقرأ من Firebase؛ كل ID آخر يحصل على شبكة محلية عشوائية.
    const matrix = vip ? (await fetchAppleMatrix()) ?? buildMatrix() : buildMatrix();
    setGrid(matrix);
    setRevealed(0);
    setRunning(true);
    for (let i = 1; i <= ROWS; i++) {
      timers.current.push(
        setTimeout(() => {
          setRevealed(i);
          if (i === ROWS) setRunning(false);
        }, i * 320),
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

  // نعرض من أعلى (349.68x) إلى أسفل (1.23x) والكشف يبدأ من تحت
  const order = Array.from({ length: ROWS }, (_, i) => ROWS - 1 - i);

  return (
    <main className="page-bg screen-frame relative min-h-screen pb-10">
      <Particles />
      <div className="relative z-10">
        <TopBar
          title="كاشف لعبة التفاحة"
          right={
            <span className="block truncate rounded-lg border border-border bg-secondary/60 px-2 py-1 text-[9px] text-muted-foreground">
              ID: {userId}
            </span>
          }
        />

        <div className="px-4 pt-[50px]">
          {/* Hero header */}
          <div className="glass animate-fade-up relative mb-4 overflow-hidden rounded-3xl p-4">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/25 blur-3xl"
            />
            <div className="relative flex items-center gap-3">
              <img
                src={appleArt}
                alt="لعبة التفاحة"
                loading="lazy"
                width={816}
                height={816}
                className="h-14 w-14 shrink-0 object-contain drop-shadow-[0_0_16px_var(--primary-glow)]"
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Predictor
                </p>
                <h1 className="neon-text mt-0.5 truncate text-2xl font-extrabold">Apple of Fortune</h1>
              </div>
              {platform && (
                <span className="shrink-0 rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
                  {platform}
                </span>
              )}
            </div>
            <div className="relative mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
              <span className="text-[9px] text-muted-foreground">
                الدقة <b className="block text-[11px] text-primary">97%</b>
              </span>
              <span className="text-[9px] text-muted-foreground">
                الصفوف <b className="block text-[11px] text-primary">{revealed}/10</b>
              </span>
              <span className="text-[9px] text-muted-foreground">
                الحالة
                <b className={`block text-[11px] ${running ? "text-gold" : "text-success"}`}>
                  {running ? "جارٍ الكشف" : "جاهز"}
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
            <div dir="ltr" className="space-y-1.5">
              {order.map((r) => {
                const open = revealed > r;
                const active = running && revealed === r;
                return (
                  <div
                    key={r}
                    dir="ltr"
                    className={`flex items-center gap-1.5 rounded-xl px-1 py-1 transition-all duration-300 ${
                      active ? "bg-primary/10 shadow-[var(--glow-sm)]" : ""
                    }`}
                  >
                    <span
                      className={`w-[52px] shrink-0 rounded-lg border py-1 text-center text-[10px] font-extrabold transition-colors ${
                        open
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-border bg-background/50 text-muted-foreground"
                      }`}
                    >
                      {COEF[r]?.toFixed(2)}x
                    </span>
                    <div dir="ltr" className="grid min-w-0 flex-1 grid-cols-5 gap-1">
                      {Array.from({ length: COLS }).map((_, c) => {
                        const firebaseKey = `m${r * COLS + c + 1}`;
                        const rotten = grid?.[r]?.[c] === true;
                        const isSafe = open && !rotten;
                        return (
                          <div
                            key={firebaseKey}
                            aria-label={firebaseKey}
                            className={`flex h-10 w-full min-w-0 max-w-[60px] items-center justify-center rounded-lg border transition-all duration-500 ${
                              isSafe
                                ? "border-primary bg-primary/15 shadow-[var(--glow-sm)]"
                                : open
                                  ? "border-border/60 bg-muted/40 opacity-60"
                                  : active
                                    ? "animate-glow-pulse border-primary/70 bg-primary/15"
                                    : "border-border bg-background/60"
                            }`}
                          >
                            {open ? (
                              isSafe ? (
                                <img
                                  src={appleArt}
                                  alt="آمنة"
                                  loading="lazy"
                                  className="h-6 w-6 object-contain drop-shadow-[0_0_8px_var(--primary-glow)]"
                                />
                              ) : (
                                <Bomb className="h-4 w-4 text-muted-foreground/70" />
                              )
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
              <Target className="h-3 w-3 text-primary" /> يبدأ الكشف من 1.23x للأعلى
            </p>
          </div>


          {/* Controls */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => void start()}
              disabled={running}
              className="gradient-primary flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold text-primary-foreground shadow-[var(--glow-lg)] transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-50"
            >
              <Play className="h-4 w-4" /> Start
            </button>
            <button
              onClick={restart}
              className="flex items-center justify-center gap-2 rounded-2xl border border-primary/60 bg-secondary/60 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
            >
              <RotateCcw className="h-4 w-4" /> Restart
            </button>
          </div>

          <div className="mt-28">
            <WinnersFeed title="أرباح لعبة التفاحة — مباشر" appleOnly />
          </div>
        </div>
      </div>
    </main>
  );
}
