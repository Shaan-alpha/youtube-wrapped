import { TopArtist } from "@/lib/api";
import { Card, CardEyebrow, CardHeading } from "./Card";

export function TopArtistsCard({ data }: { data: TopArtist[] }) {
  const max = data[0]?.plays ?? 1;
  return (
    <Card className="h-full">
      <CardEyebrow>On heavy rotation</CardEyebrow>
      <CardHeading>Your top artists</CardHeading>
      <ol className="space-y-3">
        {data.map((artist, i) => (
          <li
            key={artist.artist_name}
            className="grid grid-cols-[1.5rem_minmax(0,1fr)_3.5rem] sm:grid-cols-[1.5rem_minmax(0,1fr)_minmax(40%,12rem)_3rem] items-center gap-3 sm:gap-4"
          >
            <span className="text-slate-500 font-mono text-xs tabular">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="truncate text-white text-sm sm:text-base">
              {artist.artist_name}
            </span>
            {/* progress bar — hidden on small to free space */}
            <div className="hidden sm:block h-[3px] bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-500"
                style={{ width: `${(artist.plays / max) * 100}%` }}
              />
            </div>
            <span className="tabular text-sm text-slate-400 text-right">
              {artist.plays}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
