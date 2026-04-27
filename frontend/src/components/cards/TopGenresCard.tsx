import { TopGenre } from "@/lib/api";
import { Card, CardEyebrow, CardHeading } from "./Card";

export function TopGenresCard({ data }: { data: TopGenre[] }) {
  return (
    <Card className="h-full">
      <CardEyebrow>The vibe</CardEyebrow>
      <CardHeading>Your top genres</CardHeading>
      <div className="flex flex-wrap gap-2">
        {data.map((g, i) => {
          const tier =
            i < 3
              ? "text-xl sm:text-2xl px-4 py-1.5 bg-white/10 text-white"
              : i < 6
                ? "text-base px-3 py-1 bg-white/[0.07] text-slate-100"
                : "text-sm px-3 py-1 bg-white/[0.04] text-slate-300";
          return (
            <span
              key={g.genre}
              className={`${tier} rounded-full border border-white/10 capitalize backdrop-blur-sm transition-all hover:bg-white/[0.12] hover:scale-[1.03] cursor-default`}
              title={`${g.total_plays} plays · ${g.artists} artists`}
            >
              {g.genre}
            </span>
          );
        })}
      </div>
    </Card>
  );
}
