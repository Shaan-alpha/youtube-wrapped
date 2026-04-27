import { BingeSession } from "@/lib/api";
import { Card, CardEyebrow } from "./Card";

export function BingeCard({ data }: { data: BingeSession[] }) {
  const longest = data[0];
  if (!longest) {
    return (
      <Card className="h-full">
        <CardEyebrow>The longest binge</CardEyebrow>
        <p className="text-slate-400">No binge sessions found.</p>
      </Card>
    );
  }

  const date = new Date(longest.session_start).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const hours = Math.floor(longest.duration_minutes / 60);
  const mins = Math.round(longest.duration_minutes % 60);

  return (
    <Card className="h-full bg-gradient-to-br from-orange-600/15 via-red-600/10 to-transparent border-orange-500/25">
      <CardEyebrow>The longest binge</CardEyebrow>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="tabular text-6xl sm:text-7xl font-bold tracking-[-0.03em] bg-gradient-to-br from-white to-orange-200 bg-clip-text text-transparent">
          {longest.videos_in_session}
        </span>
        <span className="text-slate-300 text-base sm:text-lg font-medium">
          videos
        </span>
      </div>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
        On <span className="font-semibold text-white">{date}</span>, you
        watched them in one sitting across{" "}
        <span className="tabular font-semibold text-orange-300">
          {hours}h {mins}m
        </span>
        .
      </p>
    </Card>
  );
}
