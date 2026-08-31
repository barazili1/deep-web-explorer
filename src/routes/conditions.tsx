import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  Copy,
  Gamepad2,
  Lock,
  Send,
  UserPlus,
  Wallet,
} from "lucide-react";
import imgDownload from "@/assets/cond-download.png";
import imgTelegram from "@/assets/cond-telegram.png";
import imgPromo from "@/assets/cond-promo.png";
import imgDeposit from "@/assets/cond-deposit.png";
import imgId from "@/assets/cond-id.png";
import artPlane from "@/assets/art-plane.png";
import artApple from "@/assets/art-apple.png";
import { DragonMark, OnlineUsers, Particles, TopBar } from "@/components/vip/Chrome";
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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConditionsPage,
});

type GameId = "crash" | "apple";

const GAMES: { id: GameId; name: string; sub: string; img: string; to: "/crash" | "/apple" }[] = [
  {
    id: "crash",
    name: "لعبة الطيارة",
    sub: "كاشف الأودد قبل الانفجار",
    img: artPlane,
    to: "/crash",
  },
  {
    id: "apple",
    name: "لعبة التفاحة",
    sub: "كاشف الخانات الآمنة",
    img: artApple,
    to: "/apple",
  },
];

function Condition({
  n,
  image,
  title,
  desc,
  children,
  delay,
  done,
}: {
  n: number;
  image: string;
  title: string;
  desc: string;
  children?: React.ReactNode;
  delay: number;
  done?: boolean;
}) {
  return (
    <li
      className="card-elite animate-rise group relative overflow-hidden rounded-[28px] p-4 text-right transition-all duration-500 hover:-translate-y-1 hover:border-primary/70 hover:shadow-[var(--glow-md)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-2 -top-5 select-none text-[76px] font-black leading-none text-primary/[0.07]"
      >
        {n}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-0 h-px"
        style={{
          background: "linear-gradient(90deg,transparent,var(--primary),transparent)",
          opacity: 0.6,
        }}
      />

      <div className="relative flex items-start gap-3.5">
        <div className="relative order-2 flex h-[62px] w-[62px] shrink-0 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-primary/30" />
          <span className="animate-breathe absolute inset-2 rounded-full bg-primary/15 blur-md" />
          <img
            src={image}
            alt={title}
            loading="lazy"
            width={512}
            height={512}
            className="relative h-11 w-11 object-contain drop-shadow-[0_0_16px_var(--primary-glow)] transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div className="order-1 min-w-0 flex-1">
          <div className="flex items-center justify-end gap-2">
            <h2 className="truncate text-[14px] font-extrabold text-foreground">{title}</h2>
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px] font-extrabold ${
                done
                  ? "border-success/60 bg-success/15 text-success"
                  : "border-primary/45 text-primary"
              }`}
            >
              {done ? <Check className="h-3 w-3" /> : n}
            </span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{desc}</p>
        </div>
      </div>

      {children && (
        <>
          <span className="hairline my-3.5 block w-full" />
          <div className="relative">{children}</div>
        </>
      )}
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

  const total = 7;
  const doneCount = 4 + (copied ? 1 : 0) + (id.trim() ? 1 : 0) + (game ? 1 : 0);
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
        <section className="animate-rise px-5 pt-8 text-center">
          <div className="relative mx-auto flex h-[92px] w-[92px] items-center justify-center">
            <span className="ring-conic animate-spin-slow absolute inset-0 rounded-full" />
            <span className="absolute inset-3 rounded-full border border-dashed border-primary/25" />
            <DragonMark size={52} className="relative animate-breathe" />
          </div>
          <h1 className="text-shimmer mt-4 text-[1.55rem] font-extrabold leading-tight">
            خطوات التفعيل
          </h1>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            أكمل الشروط بالترتيب لتفعيل أداة {BRAND} على منصة{" "}
            <b className="text-primary">{PLATFORM.name}</b>
          </p>

          <div className="mt-4 flex items-center justify-center gap-1.5" dir="ltr">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className="h-[3px] w-7 rounded-full transition-all duration-500"
                style={
                  i < doneCount
                    ? { backgroundImage: "var(--gradient-primary)", boxShadow: "var(--glow-sm)" }
                    : { background: "oklch(0.7 0.2 25 / 15%)" }
                }
              />
            ))}
          </div>
          <p className="mt-2 text-[9px] tracking-[0.4em] text-primary/80">{progress}%</p>
        </section>

        {/* Conditions */}
        <section className="mt-6 px-4">
          <ul className="flex flex-col gap-3.5">
            <Condition
              n={1}
              delay={0}
              image={imgDownload}
              title={`تحميل تطبيق ${PLATFORM.name}`}
              desc={`قم بتحميل وتثبيت التطبيق الرسمي لمنصة ${PLATFORM.name} على هاتفك.`}
            >
              <a
                href={PLATFORM.download}
                target="_blank"
                rel="noreferrer"
                className="gradient-primary sheen-on-hover flex items-center justify-center gap-1.5 rounded-2xl py-3 text-xs font-extrabold text-primary-foreground shadow-[var(--glow-md)] transition-transform hover:scale-[1.02]"
              >
                تحميل التطبيق <ChevronLeft className="h-3.5 w-3.5" />
              </a>
            </Condition>

            <Condition
              n={2}
              delay={70}
              image={imgId}
              title="إنشاء حساب جديد"
              desc="سجّل حساباً جديداً من الرابط الخاص بنا حتى يتم ربط حسابك بالأداة."
            >
              <a
                href={PLATFORM.register}
                target="_blank"
                rel="noreferrer"
                className="sheen-on-hover flex items-center justify-center gap-1.5 rounded-2xl border border-primary/45 py-3 text-xs font-extrabold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[var(--glow-md)]"
              >
                <UserPlus className="h-3.5 w-3.5" /> التسجيل الآن
              </a>
            </Condition>

            <Condition
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
                <span className="neon-text text-xl font-extrabold tracking-[0.35em] text-primary">
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
            </Condition>

            <Condition
              n={4}
              delay={210}
              image={imgDeposit}
              title="الإيداع"
              desc="قم بأول إيداع في حسابك حتى يعمل الكاشف بأعلى دقة."
            >
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3">
                <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Wallet className="h-4 w-4 text-primary" /> الحد الأدنى
                </span>
                <span className="text-[13px] font-extrabold text-primary">{PLATFORM.deposit}</span>
              </div>
            </Condition>

            <Condition
              n={5}
              delay={280}
              image={imgTelegram}
              title="قناة التلجرام"
              desc="انضم لقناتنا الحصرية للحصول على التحديثات والإشارات اليومية."
            >
              <a
                href={PLATFORM.telegram}
                target="_blank"
                rel="noreferrer"
                className="sheen-on-hover flex items-center justify-center gap-1.5 rounded-2xl border border-primary/45 py-3 text-xs font-extrabold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[var(--glow-md)]"
              >
                <Send className="h-3.5 w-3.5" /> انضمام الآن
              </a>
            </Condition>

            <Condition
              n={6}
              delay={350}
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
            </Condition>

            {/* Game selection */}
            <li
              className="card-elite animate-rise relative overflow-hidden rounded-[28px] p-4"
              style={{ animationDelay: "420ms" }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -left-2 -top-5 select-none text-[76px] font-black leading-none text-primary/[0.07]"
              >
                7
              </span>
              <div className="relative flex items-center justify-end gap-2">
                <h2 className="text-[14px] font-extrabold text-foreground">اختر اللعبة</h2>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-extrabold ${
                    game
                      ? "border-success/60 bg-success/15 text-success"
                      : "border-primary/45 text-primary"
                  }`}
                >
                  {game ? <Check className="h-3 w-3" /> : <Gamepad2 className="h-3 w-3" />}
                </span>
              </div>
              <p className="relative mt-1.5 text-right text-[11px] text-muted-foreground">
                لازم تختار لعبة واحدة لتشغيل الكاشف الخاص بها.
              </p>

              <div className="relative mt-3.5 flex flex-col gap-2.5">
                {GAMES.map((g) => {
                  const active = game === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setGame(g.id)}
                      className={`sheen-on-hover flex items-center gap-3 rounded-[22px] border p-3 text-right transition-all duration-300 ${
                        active
                          ? "-translate-y-0.5 border-primary bg-primary/10 shadow-[var(--glow-md)]"
                          : "border-primary/25 hover:border-primary/55"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-primary/40"
                        }`}
                      >
                        {active && <Check className="h-3 w-3" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-[13px] font-extrabold ${active ? "text-primary" : "text-foreground"}`}
                        >
                          {g.name}
                        </span>
                        <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                          {g.sub}
                        </span>
                      </span>
                      <img
                        src={g.img}
                        alt={g.name}
                        loading="lazy"
                        width={768}
                        height={768}
                        className={`h-12 w-12 shrink-0 object-contain drop-shadow-[0_0_12px_var(--primary-glow)] transition-transform duration-300 ${active ? "scale-110" : ""}`}
                      />
                    </button>
                  );
                })}
              </div>
            </li>
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
          <BadgeCheck className="h-4 w-4" />
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
            <DragonMark size={78} className="animate-breathe" />
          </div>
          <p className="text-shimmer text-sm font-extrabold">{BRAND}</p>
          <p className="text-xs tracking-widest text-muted-foreground">جارٍ تفعيل الحساب VIP...</p>
        </div>
      )}
    </main>
  );
}
