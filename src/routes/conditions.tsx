import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  Copy,
  Gamepad2,
  Lock,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Wallet,
} from "lucide-react";
import imgDownload from "@/assets/step-download.png";
import imgRegister from "@/assets/step-register.png";
import imgPromo from "@/assets/step-promo.png";
import imgDeposit from "@/assets/step-deposit.png";
import imgId from "@/assets/step-id.png";
import imgGame from "@/assets/step-game.png";
import logoCrash from "@/assets/logo-crash-game.png";
import logoApple from "@/assets/logo-apple-game.png";
import casinoBg from "@/assets/casino-bg.jpg";
import xpLogo from "@/assets/xparibet-logo.jpg";
import { OnlineUsers, Particles, TopBar } from "@/components/vip/Chrome";
import { BRAND, PLATFORM, saveUserId } from "@/lib/session";

export const Route = createFileRoute("/conditions")({
  head: () => ({
    meta: [
      { title: "شروط التفعيل VIP — ثغرات التطبيقات" },
      {
        name: "description",
        content:
          "أكمل شروط التفعيل على منصة Xparibet بالبروموكود FM333 واختر لعبتك: الطيارة أو التفاحة.",
      },
      { property: "og:title", content: "شروط التفعيل VIP — ثغرات التطبيقات" },
      { property: "og:description", content: "خطوات تفعيل حساب VIP على Xparibet واختيار اللعبة." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/conditions" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/conditions" }],
  }),
  component: ConditionsPage,
});

type GameId = "crash" | "apple";

const GAMES: { id: GameId; name: string; sub: string; img: string; to: "/crash" | "/apple" }[] = [
  {
    id: "crash",
    name: "لعبة الطيارة",
    sub: "كاشف الأودد قبل الانفجار",
    img: logoCrash,
    to: "/crash",
  },
  { id: "apple", name: "لعبة التفاحة", sub: "كاشف الخانات الآمنة", img: logoApple, to: "/apple" },
];

function Step({
  n,
  image,
  title,
  desc,
  children,
  delay,
  done,
  last,
}: {
  n: number;
  image: string;
  title: string;
  desc: string;
  children?: React.ReactNode;
  delay: number;
  done?: boolean;
  last?: boolean;
}) {
  return (
    <li className="animate-rise relative flex gap-3" style={{ animationDelay: `${delay}ms` }}>
      {/* timeline rail */}
      <div className="relative order-2 flex w-8 shrink-0 flex-col items-center">
        <span
          className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-black transition-colors ${
            done
              ? "border-success/70 bg-success/15 text-success shadow-[0_0_16px_oklch(0.72_0.19_150/45%)]"
              : "border-primary/50 bg-background text-primary shadow-[var(--glow-sm)]"
          }`}
        >
          {done ? <Check className="h-4 w-4" /> : n}
        </span>
        {!last && (
          <span
            aria-hidden
            className="absolute top-8 h-[calc(100%-0.5rem)] w-px"
            style={{
              background: "linear-gradient(180deg,var(--primary),transparent)",
              opacity: 0.35,
            }}
          />
        )}
      </div>

      <div className="card-elite order-1 mb-3.5 min-w-0 flex-1 overflow-hidden rounded-[24px] p-3.5 text-right transition-all duration-500 hover:-translate-y-0.5 hover:border-primary/60">
        <div className="flex items-start gap-3">
          <div className="relative order-2 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-[var(--glow-sm)]">
            <span className="animate-breathe absolute inset-3 rounded-full bg-primary/25 blur-md" />
            <img
              src={image}
              alt={title}
              loading="lazy"
              width={512}
              height={512}
              className="relative h-11 w-11 object-contain drop-shadow-[0_0_14px_var(--primary-glow)]"
            />
          </div>
          <div className="order-1 min-w-0 flex-1">
            <h2 className="text-[13.5px] font-extrabold text-foreground">{title}</h2>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{desc}</p>
          </div>
        </div>
        {children && (
          <>
            <span className="hairline my-3 block w-full" />
            {children}
          </>
        )}
      </div>
    </li>
  );
}

function ConditionsPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [id, setId] = useState("");
  const [game, setGame] = useState<GameId | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading || !game) return undefined;
    const to = GAMES.find((g) => g.id === game)!.to;
    const t = setTimeout(() => navigate({ to }), 4000);
    return () => clearTimeout(t);
  }, [loading, game, navigate]);

  const total = 6;
  const doneCount = 3 + (copied ? 1 : 0) + (id.trim() ? 1 : 0) + (game ? 1 : 0);
  const progress = Math.round((doneCount / total) * 100);
  const ready = !!id.trim() && !!game;

  const copy = () => {
    navigator.clipboard?.writeText(PLATFORM.promo);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="page-bg relative min-h-screen pb-28">
      <Particles />
      <div className="relative z-10">
        <TopBar title="شروط التفعيل" right={<OnlineUsers />} />

        {/* Hero */}
        <section className="animate-rise relative mx-4 mt-4 overflow-hidden rounded-[28px] border border-primary/25">
          <img
            src={casinoBg}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.07 0.02 25 / 55%), oklch(0.07 0.02 25 / 92%))",
            }}
          />
          <span
            aria-hidden
            className="animate-scan pointer-events-none absolute inset-x-0 h-16 opacity-40"
            style={{
              background: "linear-gradient(180deg,transparent,oklch(0.65 0.24 25 / 35%),transparent)",
            }}
          />
          <div className="relative flex flex-col items-center px-5 py-7 text-center">
            <div className="relative flex h-[96px] w-[96px] items-center justify-center">
              <span className="ring-conic animate-spin-slow absolute inset-0 rounded-full" />
              <span className="absolute inset-3 rounded-full border border-dashed border-primary/25" />
              <img
                src={xpLogo}
                alt="Xparibet"
                width={447}
                height={447}
                className="animate-breathe relative h-16 w-16 rounded-full object-cover ring-2 ring-primary/60 shadow-[var(--glow-md)]"
              />
            </div>
            <h1 className="text-shimmer mt-4 text-[1.5rem] font-black leading-tight">خطوات التفعيل</h1>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              أكمل الشروط بالترتيب لتفعيل أداة {BRAND} على منصة{" "}
              <b className="text-primary">{PLATFORM.name}</b>
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
              {[
                { icon: ShieldCheck, t: "اتصال مشفّر" },
                { icon: Sparkles, t: "دقة 98%" },
                { icon: BadgeCheck, t: "تفعيل فوري" },
              ].map(({ icon: Icon, t }) => (
                <span
                  key={t}
                  className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[9.5px] text-muted-foreground"
                >
                  <Icon className="h-3 w-3 text-primary" /> {t}
                </span>
              ))}
            </div>

            {/* progress */}
            <div className="mt-5 w-full">
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundImage: "var(--gradient-primary)",
                    boxShadow: "var(--glow-sm)",
                  }}
                />
              </div>
              <div dir="ltr" className="mt-2 flex items-center justify-between">
                <span className="text-[9px] tracking-[0.35em] text-muted-foreground/60">PROGRESS</span>
                <span className="text-[10px] font-bold tabular-nums text-primary">
                  {doneCount}/{total} · {progress}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="mt-6 px-4">
          <ul className="flex flex-col">
            <Step
              n={1}
              delay={0}
              image={imgDownload}
              title={`تحميل تطبيق ${PLATFORM.name}`}
              desc={`حمّل وثبّت التطبيق الرسمي لمنصة ${PLATFORM.name} على هاتفك.`}
              done
            >
              <a
                href={PLATFORM.download}
                target="_blank"
                rel="noreferrer"
                className="gradient-primary sheen-on-hover flex items-center justify-center gap-1.5 rounded-2xl py-3 text-xs font-extrabold text-primary-foreground shadow-[var(--glow-md)] transition-transform hover:scale-[1.02]"
              >
                تحميل التطبيق <ChevronLeft className="h-3.5 w-3.5" />
              </a>
            </Step>

            <Step
              n={2}
              delay={70}
              image={imgRegister}
              title="إنشاء حساب جديد"
              desc="سجّل حساباً جديداً من الرابط الخاص بنا حتى يتم ربط حسابك بالأداة."
              done
            >
              <a
                href={PLATFORM.register}
                target="_blank"
                rel="noreferrer"
                className="sheen-on-hover flex items-center justify-center gap-1.5 rounded-2xl border border-primary/45 py-3 text-xs font-extrabold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[var(--glow-md)]"
              >
                <UserPlus className="h-3.5 w-3.5" /> التسجيل الآن
              </a>
            </Step>

            <Step
              n={3}
              delay={140}
              image={imgPromo}
              title="البروموكود"
              desc="استخدم البروموكود عند التسجيل للحصول على البونص الكامل:"
              done={copied}
            >
              <button
                onClick={copy}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-dashed border-primary/50 px-4 py-3 transition-colors hover:bg-primary/10"
              >
                <span className="neon-text text-xl font-extrabold tracking-[0.3em] text-primary">
                  {PLATFORM.promo}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  {copied ? "تم النسخ" : "نسخ الكود"}
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </span>
              </button>
            </Step>

            <Step
              n={4}
              delay={210}
              image={imgDeposit}
              title="الإيداع"
              desc="قم بأول إيداع في حسابك حتى يعمل الكاشف بأعلى دقة."
              done
            >
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3">
                <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Wallet className="h-4 w-4 text-primary" /> الحد الأدنى
                </span>
                <span className="text-[13px] font-extrabold text-primary">{PLATFORM.deposit}</span>
              </div>
            </Step>

            <Step
              n={5}
              delay={280}
              image={imgId}
              title="الـ ID الخاص بك"
              desc="أدخل الـ ID الخاص بك في المنصة للتأكد من التفعيل."
              done={!!id.trim()}
            >
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                inputMode="numeric"
                placeholder="مثال: 1029384756"
                className="w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-right text-sm tracking-[0.15em] outline-none transition-shadow placeholder:tracking-normal placeholder:text-muted-foreground/60 focus:border-primary focus:shadow-[var(--glow-sm)]"
              />
            </Step>

            <Step
              n={6}
              delay={350}
              last
              image={imgGame}
              title="اختر اللعبة"
              desc="لازم تختار لعبة واحدة لتشغيل الكاشف الخاص بها."
              done={!!game}
            >
              <div className="grid grid-cols-2 gap-2.5">
                {GAMES.map((g) => {
                  const active = game === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setGame(g.id)}
                      className={`sheen-on-hover relative overflow-hidden rounded-[20px] border p-3 text-center transition-all duration-300 ${
                        active
                          ? "-translate-y-0.5 border-primary bg-primary/10 shadow-[var(--glow-md)]"
                          : "border-primary/25 hover:border-primary/55"
                      }`}
                    >
                      <span
                        className={`absolute left-2 top-2 flex h-4 w-4 items-center justify-center rounded-full border ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-primary/40"
                        }`}
                      >
                        {active && <Check className="h-2.5 w-2.5" />}
                      </span>
                      <img
                        src={g.img}
                        alt={g.name}
                        loading="lazy"
                        width={768}
                        height={768}
                        className={`mx-auto h-14 w-14 object-contain drop-shadow-[0_0_14px_var(--primary-glow)] transition-transform duration-300 ${
                          active ? "scale-110" : ""
                        }`}
                      />
                      <span
                        className={`mt-1.5 block text-[12px] font-extrabold ${active ? "text-primary" : "text-foreground"}`}
                      >
                        {g.name}
                      </span>
                      <span className="mt-0.5 block text-[9.5px] leading-tight text-muted-foreground">
                        {g.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Step>
          </ul>
        </section>
      </div>

      {/* sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-primary/20 bg-background/70 px-4 pb-4 pt-3 backdrop-blur-xl">
        <button
          onClick={() => {
            if (!ready) return;
            saveUserId(id.trim());
            setLoading(true);
          }}
          disabled={!ready}
          className="gradient-primary sheen-on-hover flex w-full items-center justify-center gap-2 rounded-[22px] py-3.5 text-sm font-extrabold tracking-wide text-primary-foreground shadow-[var(--glow-lg)] transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-40 disabled:shadow-none"
        >
          {ready ? <BadgeCheck className="h-4 w-4" /> : <Gamepad2 className="h-4 w-4" />}
          {ready ? "أكملت الشروط، ابدأ الربح" : "أكمل الـ ID واختر لعبة"}
        </button>
        {!ready && (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-[9.5px] text-muted-foreground">
            <Lock className="h-3 w-3" /> الزر يتفعل بعد إدخال الـ ID واختيار اللعبة
          </p>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-background/85 backdrop-blur-xl">
          <div className="relative flex h-40 w-40 items-center justify-center">
            <span className="ring-conic animate-spin-slow absolute inset-0 rounded-full" />
            <span className="ring-conic absolute inset-6 rounded-full [animation:spin-slow_9s_linear_infinite_reverse]" />
            <img
              src={xpLogo}
              alt="Xparibet"
              width={447}
              height={447}
              className="animate-breathe h-20 w-20 rounded-full object-cover ring-2 ring-primary/60"
            />
          </div>
          <p className="text-shimmer text-sm font-extrabold">{BRAND}</p>
          <p className="text-xs tracking-widest text-muted-foreground">جارٍ تفعيل الحساب VIP...</p>
        </div>
      )}
    </main>
  );
}
