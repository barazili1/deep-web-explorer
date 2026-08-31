import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ChevronLeft, Loader2, ShieldCheck, Sparkles, TrendingUp, Zap } from "lucide-react";
import bg from "@/assets/casino-bg.jpg";
import logoFansport from "@/assets/logo-fansport.png";
import logoGreenbet from "@/assets/logo-greenbet.jpg";
import dragonLogo from "@/assets/darkweb-logo.png";
import { OnlineUsers, Particles, TopBar } from "@/components/vip/Chrome";
import { PLATFORMS, savePlatform, type PlatformId } from "@/lib/session";

const LOGOS: Record<string, string> = { fansport: logoFansport, greenbet: logoGreenbet };

export const Route = createFileRoute("/platforms")({
  head: () => ({
    meta: [
      { title: "اختيار المنصة — DARK WEB" },
      { name: "description", content: "اختر منصتك 1XBET أو GREENBET لبدء تفعيل حساب VIP." },
      { property: "og:title", content: "اختيار المنصة — DARK WEB" },
      { property: "og:description", content: "اختر منصتك لبدء تفعيل حساب VIP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlatformsPage,
});

const STEPS = [
  "جارٍ تحميل سيرفر المنصة...",
  "جارٍ استخراج أكواد الفوز...",
  "تم الاستخراج بنجاح!",
];

const STATS = [
  { label: "نسبة النجاح", value: "97%", icon: TrendingUp },
  { label: "لاعب نشط", value: "14.5K", icon: ShieldCheck },
  { label: "سحب اليوم", value: "$82K", icon: Zap },
];

function PlatformsPage() {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!connecting) return;
    if (step < STEPS.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 1100);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => navigate({ to: "/conditions" }), 900);
    return () => clearTimeout(t);
  }, [connecting, step, navigate]);

  const choose = (id: PlatformId) => {
    savePlatform(id);
    setStep(0);
    setConnecting(true);
  };

  return (
    <main className="page-bg relative min-h-screen pb-16">
      <img
        src={bg}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.07] blur-3xl"
      />
      <Particles />
      <div className="relative z-10">
        <TopBar title="اختيار المنصة" right={<OnlineUsers />} />

        {/* Hero */}
        <section className="animate-rise px-6 pb-2 pt-[62px] text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/35 px-3.5 py-1 text-[8.5px] font-bold tracking-[0.45em] text-primary/90">
            <Sparkles className="h-3 w-3" /> VIP
          </span>
          <h2 className="text-shimmer mt-4 text-[1.75rem] font-extrabold leading-tight">
            اختر منصتك
          </h2>
          <div className="mx-auto mt-3 flex w-40 items-center gap-2">
            <span className="hairline flex-1" />
            <span className="h-1 w-1 rotate-45 bg-primary shadow-[var(--glow-sm)]" />
            <span className="hairline flex-1" />
          </div>
          <p className="mx-auto mt-3 max-w-[260px] text-[11px] leading-relaxed text-muted-foreground">
            حدد المنصة التي تلعب عليها لتشغيل أداة الكشف الخاصة بك
          </p>
        </section>

        {/* Platform cards — stacked */}
        <section className="mt-7 flex flex-col gap-3.5 px-4">
          {(Object.keys(PLATFORMS) as PlatformId[]).map((id, i) => {
            const p = PLATFORMS[id];
            return (
              <button
                key={id}
                onClick={() => choose(id)}
                className="glass sheen-on-hover backdrop-blur-2xl bg-transparent animate-rise group relative flex items-center gap-4 rounded-[28px] p-4 text-right transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/70 hover:shadow-[var(--glow-lg)] active:scale-[0.98]"
                style={{ animationDelay: `${i * 130}ms` }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                  style={{ background: p.accent }}
                />

                {/* logo medallion */}
                <div className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full border"
                    style={{ borderColor: `${p.accent}66` }}
                  />
                  <span className="ring-conic absolute -inset-1 rounded-full opacity-0 transition-opacity duration-500 group-hover:animate-spin-slow group-hover:opacity-90" />
                  <span
                    aria-hidden
                    className="absolute inset-2 rounded-full blur-md"
                    style={{ background: `${p.accent}2e` }}
                  />
                  <img
                    src={LOGOS[id]}
                    alt={p.name}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="relative h-10 w-10 rounded-lg object-contain drop-shadow-[0_0_18px_var(--primary-glow)] transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* text block */}
                <div className="relative min-w-0 flex-1">
                  <div className="flex items-center justify-end gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[8px] font-extrabold tracking-[0.3em]"
                      style={{ color: p.accent, background: `${p.accent}1f` }}
                    >
                      {p.short}
                    </span>
                    <h3 className="truncate text-[18px] font-extrabold leading-none tracking-wide text-foreground">
                      {p.name}
                    </h3>
                  </div>
                  <p className="mt-1.5 truncate text-[10.5px] text-muted-foreground">
                    {p.tagline}
                  </p>
                  <span className="hairline my-2.5 block w-full" />
                  <span className="flex items-center justify-end gap-1 text-[9px] text-muted-foreground/80">
                    سحب فوري · موثوقة <ShieldCheck className="h-3 w-3 text-primary" />
                  </span>
                </div>

                {/* action */}
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/45 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[var(--glow-md)]">
                  <ChevronLeft className="h-4 w-4" />
                </span>
              </button>
            );
          })}

        </section>

        {/* Stats — elegant single strip */}
        <section
          className="card-elite animate-rise mx-4 mt-6 grid grid-cols-3 rounded-[26px] py-4"
          style={{ animationDelay: "340ms" }}
        >
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className={`flex flex-col items-center px-2 text-center ${
                  i < STATS.length - 1 ? "border-l border-primary/15" : ""
                }`}
              >
                <Icon className="mb-1.5 h-3.5 w-3.5 text-primary/80" />
                <p className="neon-text text-[17px] font-extrabold leading-none text-primary">
                  {s.value}
                </p>
                <p className="mt-1.5 text-[9px] tracking-wider text-muted-foreground">{s.label}</p>
              </div>
            );
          })}
        </section>

        <p className="mt-6 text-center text-[8px] tracking-[0.5em] text-muted-foreground/45">
          SECURE · ENCRYPTED · VIP
        </p>
      </div>

      {connecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 px-6 backdrop-blur-xl">
          <div className="card-elite animate-rise w-full max-w-sm rounded-[32px] p-7 shadow-[var(--glow-lg)]">
            <div className="mb-6 flex flex-col items-center">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <span className="ring-conic animate-spin-slow absolute inset-0 rounded-full" />
                <span className="absolute inset-3 rounded-full border border-dashed border-primary/25" />
                <img
                  src={dragonLogo}
                  alt="DARK WEB"
                  width={256}
                  height={256}
                  className="h-14 w-14 animate-breathe object-contain drop-shadow-[0_0_28px_var(--primary-glow)]"
                />
              </div>
              <p className="text-shimmer mt-3 text-[10.5px] font-extrabold tracking-[0.35em]">
                DARK WEB
              </p>
              <span className="hairline mt-3 w-24" />
            </div>
            <div className="space-y-2.5">
              {STEPS.slice(0, step + 1).map((s, i) => {
                const finished = i < step;
                return (
                  <p
                    key={s}
                    className={`animate-fade-up flex items-center gap-2.5 rounded-2xl border border-primary/20 px-3.5 py-2.5 text-[11px] ${
                      finished && i === STEPS.length - 1 ? "text-success" : "text-foreground"
                    }`}
                  >
                    {finished ? (
                      <Check className="h-4 w-4 shrink-0 text-success" />
                    ) : (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                    )}
                    {s}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
