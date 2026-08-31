const NAMES = ["User***k", "Player***9", "Ahmed***3", "Mo***7z", "Sara***1", "Khaled***5", "Vip***x"];
const GAMES = ["التفاحة", "Aviator", "Mines", "التفاحة"];
const AMOUNTS = ["$150", "500 EGP", "$1,240", "2,300 EGP", "$85", "9,700 EGP"];

function row(i: number, appleOnly: boolean) {
  return {
    name: NAMES[i % NAMES.length]!,
    amount: AMOUNTS[i % AMOUNTS.length]!,
    game: appleOnly ? "التفاحة" : GAMES[i % GAMES.length]!,
    time: `منذ ${(i % 9) + 3} ثانية`,
  };
}

export function WinnersFeed({
  title = "مباشر: أحدث السحوبات",
  appleOnly = false,
}: {
  title?: string;
  appleOnly?: boolean;
}) {
  const rows = Array.from({ length: 8 }, (_, i) => row(i, appleOnly));
  const doubled = [...rows, ...rows];

  return (
    <section className="glass overflow-hidden rounded-2xl p-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="animate-glow-pulse inline-block h-2 w-2 rounded-full bg-destructive shadow-[0_0_10px_var(--destructive)]" />
        <h2 className="text-xs font-bold tracking-wide">{title}</h2>
      </div>
      <div className="relative h-44 overflow-hidden [mask-image:linear-gradient(180deg,transparent,#000_18%,#000_82%,transparent)]">
        <ul className="animate-feed space-y-2">
          {doubled.map((r, i) => (
            <li
              key={i}
              className="flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-2.5 py-2"
            >
              <span className="gradient-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-primary-foreground">
                {r.name.slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold">{r.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  لعبة {r.game} · {r.time}
                </p>
              </div>
              <span className="shrink-0 text-[11px] font-bold text-success">+{r.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
