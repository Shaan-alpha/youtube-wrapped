import { MainCharacter } from "@/lib/api";
import { Card, CardEyebrow } from "./Card";

export function MainCharacterCard({ data }: { data: MainCharacter }) {
  // peak_month is "yyyy-MM"; render as "January 2026"
  const peakMonthLabel = (() => {
    const parsed = new Date(`${data.peak_month}-01T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) return data.peak_month;
    return parsed.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  })();

  return (
    <Card className="h-full bg-gradient-to-br from-pink-600/15 via-purple-600/10 to-transparent border-pink-500/25">
      <CardEyebrow>The main character</CardEyebrow>
      <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] mb-5 bg-gradient-to-br from-white to-pink-200 bg-clip-text text-transparent break-words">
        {data.artist_name}
      </h2>
      <p className="text-slate-300 leading-relaxed text-base sm:text-lg">
        You played them{" "}
        <span className="tabular font-semibold text-white">
          {data.total_plays}
        </span>{" "}
        times. Of those,{" "}
        <span className="tabular font-semibold text-pink-300">
          {data.peak_month_pct_of_artist}%
        </span>{" "}
        happened in{" "}
        <span className="font-semibold text-white">{peakMonthLabel}</span>{" "}
        alone.
      </p>
    </Card>
  );
}
