import { useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import logo from "@/assets/brand-mark.png";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/session";

export function DragonMark({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <img
      src={logo}
      alt={BRAND}
      width={size}
      height={size}
      className={cn("drop-shadow-[0_0_16px_oklch(0.7_0.26_25/90%)]", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
        else router.navigate({ to: "/conditions" });
      }}
      aria-label="رجوع"
      className={cn(
        "flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] text-foreground transition hover:bg-secondary",
        className,
      )}
    >
      <ChevronRight className="h-3.5 w-3.5" />
      <span>رجوع</span>
    </button>
  );
}

export function TopBar({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <header className="glass sticky top-0 z-40 flex items-center justify-between gap-2 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <BackButton />
        <DragonMark size={26} />
        <span className="neon-text hidden text-[11px] font-bold sm:inline">{BRAND}</span>
      </div>
      <h1 className="neon-text text-sm font-semibold">{title}</h1>
      <div className="min-w-[74px] text-left">{right}</div>
    </header>
  );
}

export function OnlineUsers() {
  const [count, setCount] = useState(1500);

  useEffect(() => {
    const tick = () => setCount(1000 + Math.floor(Math.random() * 1001));
    const id = setInterval(tick, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-2 py-1">
      <span className="animate-glow-pulse inline-block h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
      <span className="text-[10px] text-muted-foreground">{count.toLocaleString()}</span>
    </div>
  );
}

const COUNT = 70;

export function Particles() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      r: 0.8 + Math.random() * 1.6,
    }));

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]!;
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]!;
          const dx = (a.x - b.x) * w;
          const dy = (a.y - b.y) * h;
          const d = Math.hypot(dx, dy);
          if (d < 120) {
            ctx.strokeStyle = `rgba(255,45,45,${(1 - d / 120) * 0.28})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(255,60,60,0.9)";
      ctx.fillStyle = "rgba(255,90,80,0.9)";
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70"
    />
  );
}
