import { Overview } from "@/lib/api";
import { Card, CardEyebrow } from "./Card";

export function OverviewCard({ data }: { data: Overview }) {
  return (
    <Card>
      <CardEyebrow>The numbers</CardEyebrow>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-8">
        <Stat
          label="Total watches"
          value={data.total_watches.toLocaleString()}
        />
        <Stat label="Music" value={`${data.music_pct}%`} />
        <Stat
          label="Unique artists"
          value={data.unique_artists.toLocaleString()}
        />
        <Stat label="Days tracked" value={data.days_of_history.toString()} />
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="tabular text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-white">
        {value}
      </div>
      <div className="mt-1.5 text-xs uppercase tracking-wider text-slate-500">
        {label}
      </div>
    </div>
  );
}
