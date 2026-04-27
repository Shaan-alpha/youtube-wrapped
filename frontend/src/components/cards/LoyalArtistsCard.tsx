import { LoyalArtist } from "@/lib/api";
import { Card, CardEyebrow, CardHeading } from "./Card";

export function LoyalArtistsCard({ data }: { data: LoyalArtist[] }) {
  return (
    <Card className="h-full">
      <CardEyebrow>The relationships</CardEyebrow>
      <CardHeading>Most loyal listens</CardHeading>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
        Artists you&apos;ve kept coming back to over the longest stretches.
      </p>
      <ul className="space-y-1">
        {data.map((artist, i) => (
          <li
            key={artist.artist_name}
            className={`flex items-center justify-between gap-3 py-3 ${
              i !== data.length - 1 ? "border-b border-white/[0.06]" : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="font-medium text-white truncate">
                {artist.artist_name}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 tabular">
                {artist.total_plays} plays · {artist.distinct_listening_days} days
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="tabular font-semibold text-purple-300">
                {artist.loyalty_span_days}
                <span className="text-slate-500 font-normal text-sm ml-0.5">d</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
                span
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
