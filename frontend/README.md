# YouTube Wrapped Dashboard

A modern Next.js web application that visualizes your YouTube watch history analytics. Built with TypeScript, Tailwind CSS, and server-side rendering for optimal performance.

**Live Demo:** https://youtube-wrapped.vercel.app

## Features

- 📊 Interactive analytics dashboard with multiple visualization types
- 🎬 Top artists, channels, and genres breakdown
- 📈 Timeline visualization of your viewing history
- 🎯 Personalized insights (main character artist, night owl score, etc.)
- 📱 Fully responsive design
- 🚀 Server-side rendering with Next.js
- ♿ Accessible components

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS, PostCSS
- **API Client:** Fetch API with TypeScript types
- **Deployment:** Vercel

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── Reveal.tsx      # Reveal animation component
│   │   ├── cards/          # Dashboard cards
│   │   │   ├── Card.tsx    # Card wrapper
│   │   │   ├── OverviewCard.tsx
│   │   │   ├── TopArtistsCard.tsx
│   │   │   ├── TopGenresCard.tsx
│   │   │   ├── TopChannelsCard.tsx
│   │   │   ├── HourlyChart.tsx
│   │   │   ├── ListeningRhythmCard.tsx
│   │   │   ├── LoyalArtistsCard.tsx
│   │   │   ├── MainCharacterCard.tsx
│   │   │   ├── BingeCard.tsx
│   │   │   └── GenreSplitCard.tsx
│   │   └── [other components]
│   └── lib/
│       └── api.ts          # API client utilities
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Scripts

- `npm run dev` — Start development server with hot reload
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint
- `npm run type-check` — Run TypeScript type checking

## Components

### Card Components

Located in `src/components/cards/`, each card displays a specific analytics metric:

- **OverviewCard** — Summary statistics
- **TopArtistsCard** — Your top music artists
- **TopGenresCard** — Genre distribution
- **TopChannelsCard** — Most watched channels
- **HourlyChart** — Viewing distribution by hour
- **ListeningRhythmCard** — Daily/weekly patterns
- **LoyalArtistsCard** — Artist loyalty metrics
- **MainCharacterCard** — Your defining artist
- **BingeCard** — Longest viewing sessions
- **GenreSplitCard** — Detailed genre breakdown

### Utility Components

- **Card** — Base wrapper for dashboard cards
- **Reveal** — Reveal animation component for page entrance

## API Integration

The frontend communicates with the FastAPI backend at the endpoint specified in `NEXT_PUBLIC_API_URL`.

All API calls are made through `src/lib/api.ts` which provides TypeScript-typed utilities.

### Example API Call:

```typescript
import { getTopArtists } from '@/lib/api';

const artists = await getTopArtists();
```

## Styling

This project uses **Tailwind CSS** for utility-first styling:

- Global styles in `src/app/globals.css`
- Component-level Tailwind classes in JSX
- PostCSS for CSS processing

## Deployment

The frontend is automatically deployed to Vercel on every push to the `main` branch.

### Manual Deployment:

```bash
npm run build
vercel deploy --prod
```

## Performance Optimization

- **Server-Side Rendering (SSR)** for SEO and faster initial load
- **Image Optimization** with Next.js Image component
- **CSS Optimization** with Tailwind CSS
- **Code Splitting** - automatic with Next.js
- **Static Generation** where applicable

## Type Safety

All components and utilities are written in TypeScript for type safety and better IDE support.

Type definitions are generated from the FastAPI backend using OpenAPI schemas.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test locally (`npm run dev`)
4. Run linting (`npm run lint`)
5. Create a Pull Request

## License

MIT

---

**Status:** ✅ Production Ready

