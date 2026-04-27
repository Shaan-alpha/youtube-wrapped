import { api } from "@/lib/api";
import { Reveal } from "@/components/Reveal";
import { OverviewCard } from "@/components/cards/OverviewCard";
import { MainCharacterCard } from "@/components/cards/MainCharacterCard";
import { TopArtistsCard } from "@/components/cards/TopArtistsCard";
import { GenreSplitCard } from "@/components/cards/GenreSplitCard";
import { ListeningRhythmCard } from "@/components/cards/ListeningRhythmCard";
import { BingeCard } from "@/components/cards/BingeCard";
import { LoyalArtistsCard } from "@/components/cards/LoyalArtistsCard";
import { TopGenresCard } from "@/components/cards/TopGenresCard";

export default async function Home() {
  const [
    overview,
    mainCharacter,
    topArtists,
    genreSplit,
    byHour,
    nightOwl,
    binges,
    loyal,
    topGenres,
  ] = await Promise.all([
    api.overview(),
    api.mainCharacter(),
    api.topArtists(10),
    api.genreSplit(),
    api.byHour(),
    api.nightOwlScore(),
    api.bingeSessions(3),
    api.loyalArtists(5),
    api.topGenres(10),
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Ambient gradient backdrop — Apple-style soft radial glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-purple-600/25 blur-[120px]" />
        <div className="absolute top-1/3 -right-20 h-[400px] w-[400px] rounded-full bg-pink-500/20 blur-[100px]" />
        <div className="absolute bottom-0 -left-20 h-[400px] w-[400px] rounded-full bg-orange-500/15 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        {/* Hero */}
        <header className="text-center mb-16 sm:mb-24 space-y-5">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-purple-300/70 font-medium">
              {overview.days_of_history} days · decoded
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-[-0.03em] bg-gradient-to-br from-white via-purple-100 to-pink-200 bg-clip-text text-transparent">
              Your YouTube
              <br />
              Wrapped.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto max-w-md text-base sm:text-lg text-slate-400 leading-relaxed">
              A personal year-in-review of what you watched, when you watched it, and who you couldn&apos;t stop listening to.
            </p>
          </Reveal>
        </header>

        {/* Card grid: single column on mobile, 12-col grid on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          <Reveal className="lg:col-span-12">
            <OverviewCard data={overview} />
          </Reveal>

          <Reveal className="lg:col-span-7">
            <MainCharacterCard data={mainCharacter} />
          </Reveal>

          <Reveal className="lg:col-span-5">
            <BingeCard data={binges} />
          </Reveal>

          <Reveal className="lg:col-span-7">
            <TopArtistsCard data={topArtists} />
          </Reveal>

          <Reveal className="lg:col-span-5">
            <GenreSplitCard data={genreSplit} />
          </Reveal>

          <Reveal className="lg:col-span-12">
            <ListeningRhythmCard byHour={byHour} nightOwl={nightOwl} />
          </Reveal>

          <Reveal className="lg:col-span-6">
            <TopGenresCard data={topGenres} />
          </Reveal>

          <Reveal className="lg:col-span-6">
            <LoyalArtistsCard data={loyal} />
          </Reveal>
        </div>

        <footer className="mt-20 sm:mt-28 text-center text-sm text-slate-500">
          Built by Shaan ·{" "}
          <a
            href="https://github.com/Shaan-alpha/youtube-wrapped"
            className="text-purple-300 transition-colors hover:text-purple-200"
          >
            View on GitHub
          </a>
        </footer>
      </div>
    </main>
  );
}
