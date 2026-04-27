"use client";

import dynamic from "next/dynamic";
import { HourlyListening, NightOwlScore } from "@/lib/api";
import { Card, CardEyebrow, CardHeading } from "./Card";

// Skip SSR to avoid recharts width=-1 warning during prerender.
// (ssr: false requires the parent to be a Client Component — hence "use client" above.)
const HourlyChart = dynamic(
  () => import("./HourlyChart").then((m) => m.HourlyChart),
  {
    ssr: false,
    loading: () => <div className="h-full w-full" />,
  },
);

function formatHour(h: number) {
  if (h === 0) return "12a";
  if (h < 12) return `${h}a`;
  if (h === 12) return "12p";
  return `${h - 12}p`;
}

function formatHourFull(h: number) {
  if (h === 0) return "midnight";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "noon";
  return `${h - 12} PM`;
}

export function ListeningRhythmCard({
  byHour,
  nightOwl,
}: {
  byHour: HourlyListening[];
  nightOwl: NightOwlScore;
}) {
  const data = byHour.map((h) => ({
    hour: formatHour(h.watch_hour),
    watches: h.watches,
  }));

  const peakHour = byHour.reduce(
    (max, h) => (h.watches > max.watches ? h : max),
    byHour[0],
  );

  return (
    <Card>
      <CardEyebrow>Your rhythm</CardEyebrow>
      <CardHeading>You watched most at {formatHourFull(peakHour.watch_hour)}</CardHeading>

      <div className="h-48 sm:h-56 -ml-2">
        <HourlyChart data={data} />
      </div>

      <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-4 text-center">
        <TimeBlock label="Night" sub="12a–5a" pct={nightOwl.night_owl_pct} />
        <TimeBlock label="Morning" sub="5a–12p" pct={nightOwl.morning_pct} />
        <TimeBlock label="Afternoon" sub="12p–6p" pct={nightOwl.afternoon_pct} />
        <TimeBlock label="Evening" sub="6p–12a" pct={nightOwl.evening_pct} />
      </div>
    </Card>
  );
}

function TimeBlock({
  label,
  sub,
  pct,
}: {
  label: string;
  sub: string;
  pct: number;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-3 sm:p-4 transition-colors hover:bg-white/[0.07]">
      <div className="tabular text-xl sm:text-2xl font-semibold text-white">
        {pct}%
      </div>
      <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1">
        {label}
      </div>
      <div className="text-[10px] text-slate-500 tabular hidden sm:block mt-0.5">
        {sub}
      </div>
    </div>
  );
}
