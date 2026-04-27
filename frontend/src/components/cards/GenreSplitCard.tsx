import { GenreSplit } from "@/lib/api";
import { Card, CardEyebrow, CardHeading } from "./Card";

const COLOR_BG: Record<string, string> = {
  desi: "bg-gradient-to-br from-orange-400 to-orange-600",
  western: "bg-gradient-to-br from-purple-400 to-purple-600",
  untagged: "bg-gradient-to-br from-slate-500 to-slate-700",
};

const COLOR_DOT: Record<string, string> = {
  desi: "bg-orange-500",
  western: "bg-purple-500",
  untagged: "bg-slate-500",
};

export function GenreSplitCard({ data }: { data: GenreSplit[] }) {
  return (
    <Card className="h-full">
      <CardEyebrow>Two musical worlds</CardEyebrow>
      <CardHeading>Genre split</CardHeading>

      <div className="flex h-12 rounded-2xl overflow-hidden gap-1 mb-5 bg-white/5 p-1">
        {data.map((g) => (
          <div
            key={g.music_category}
            className={`${COLOR_BG[g.music_category] ?? "bg-slate-600"} rounded-xl flex items-center justify-center text-xs font-semibold text-white/95 tabular transition-all`}
            // minimum width so a 1% slice is still visible
            style={{ width: `max(2.5%, ${g.pct}%)` }}
            title={`${g.music_category}: ${g.pct}%`}
          >
            {g.pct >= 10 ? `${g.pct}%` : ""}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {data.map((g) => (
          <div
            key={g.music_category}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2 h-2 rounded-full ${COLOR_DOT[g.music_category] ?? "bg-slate-500"}`}
              />
              <span className="capitalize text-slate-200">
                {g.music_category}
              </span>
            </div>
            <span className="tabular text-slate-400">
              {g.plays.toLocaleString()}{" "}
              <span className="text-slate-500">plays</span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
