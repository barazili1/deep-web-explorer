import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Minus, Play, Plus, RotateCcw } from "lucide-react";
import gem from "@/assets/gem-diamond.png";
import { DragonMark, Particles, TopBar } from "@/components/vip/Chrome";
import { WinnersFeed } from "@/components/vip/WinnersFeed";
import { getPlatform, getUserId, PLATFORMS } from "@/lib/session";

export const Route = createFileRoute("/mines")({
  head: () => ({
    meta: [
      { title: "كاشف Gems Mines — DARK WEB" },
      { name: "description", content: "اكشف أماكن الألماس الآمنة في لعبة Gems Mines." },
      { property: "og:title", content: "كاشف Gems Mines — DARK WEB" },
      { property: "og:description", content: "شبكة 5×5 لكشف الألماس الآمن." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MinesPage,
});

const TOTAL = 25;

function MinesPage() {
  const [userId, setUserId] = useState("");
  const [platform, setPlatform] = useState("");
  const [count, setCount] = useState(3);
  const [picked, setPicked] = useState<number[]>([]);

  useEffect(() => {
    setUserId(getUserId() || "GUEST");
    setPlatform(PLATFORMS[getPlatform()].name);
  }, []);

  const start = () => {
    const pool = Array.from({ length: TOTAL }, (_, i) => i);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j]!, pool[i]!];
    }
    setPicked(pool.slice(0, count));
  };

  return (
    <main className="page-bg screen-frame relative min-h-screen pb-10">
      <Particles />
      <div className="relative z-10">
        <TopBar
          title="كاشف Gems Mines"
          right={
            <span className="block truncate rounded-lg border border-border bg-secondary/60 px-2 py-1 text-[9px] text-muted-foreground">
              ID: {userId}
            </span>
          }
        />

        <div className="flex flex-col items-center px-4 pt-[50px]">
          <DragonMark size={68} className="animate-glow-pulse" />
          <h1 className="neon-text mt-2 text-xl font-extrabold">
            Gems Mines <span className="text-primary">×</span> {platform}
          </h1>

          {/* Grid 5x5 */}
          <div className="glass mt-5 rounded-3xl p-3">
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: TOTAL }, (_, i) => {
                const on = picked.includes(i);
                return (
                  <div
                    key={i}
                    style={{ width: 55, height: 55, borderRadius: 20 }}
                    className={`flex items-center justify-center border transition-all duration-500 ${
                      on
                        ? "animate-fade-up border-primary bg-primary/15 shadow-[var(--glow-sm)]"
                        : "border-border bg-background/60"
                    }`}
                  >
                    {on ? (
                      <img
                        src={gem}
                        alt="Gem"
                        loading="lazy"
                        width={768}
                        height={768}
                        className="h-11 w-11 object-contain drop-shadow-[0_0_10px_var(--primary-glow)]"
                      />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Counter */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/60 bg-secondary/60 text-primary transition-colors hover:bg-primary/15"
              aria-label="ناقص"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div
              style={{ width: 120 }}
              className="glass neon-border rounded-2xl py-2.5 text-center text-lg font-extrabold text-primary"
            >
              {count}
            </div>
            <button
              onClick={() => setCount((c) => Math.min(TOTAL, c + 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/60 bg-secondary/60 text-primary transition-colors hover:bg-primary/15"
              aria-label="زائد"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Controls */}
          <div className="mt-4 grid w-full grid-cols-2 gap-3">
            <button
              onClick={start}
              className="gradient-primary flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold text-primary-foreground shadow-[var(--glow-lg)] transition-transform hover:scale-[1.03] active:scale-95"
            >
              <Play className="h-4 w-4" /> بدأ
            </button>
            <button
              onClick={() => setPicked([])}
              className="flex items-center justify-center gap-2 rounded-2xl border border-primary/60 bg-secondary/60 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
            >
              <RotateCcw className="h-4 w-4" /> إعادة بدأ
            </button>
          </div>

          <div className="mt-10 w-full">
            <WinnersFeed title="أرباح Gems Mines — مباشر" />
          </div>
        </div>
      </div>
    </main>
  );
}
