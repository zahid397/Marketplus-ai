# MarketPulse AI

Premium AI-powered pre-earnings financial intelligence SaaS. Dark fintech dashboard with live signals, AI assistant, competitor tracking, and full interactivity.

![Stack](https://img.shields.io/badge/Next.js-14-black) ![Stack](https://img.shields.io/badge/NestJS-10-red) ![Stack](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **Landing page** — hero, live preview card, popular tickers, early-access modal
- **Analyze page** — ticker input, analysis type selector, time range, recent searches (localStorage)
- **Dashboard** — 6 stat cards with circular gauges, 8 tabs, sentiment/radar/hiring charts
- **7-button command bar** — Compare, Generate Report, Export PDF, Watchlist, Create Alert, Refresh, AI Assistant — all functional
- **AI Assistant panel** — sliding chat with typing animation and mock responses
- **Signals page** — filterable live stream, expandable cards
- **Watchlist** — pin/remove/analyze, localStorage persistence, add-company modal
- **Companies** — searchable/filterable table with AI ranks
- **Reports** — preview modal, export buttons
- **News terminal** — sentiment filters, credibility scores
- **Settings** — profile, AI model selector, notification toggles, API testing
- **Backend** — NestJS API with 15-min cache, 30-min cron refresh, AI cascade, demo mode

## Tech Stack

**Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Recharts, lucide-react

**Backend:** NestJS, in-memory cache, @nestjs/schedule cron, class-validator

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Backend
```bash
cd backend
npm install
cp .env.example .env       # DEMO_MODE=true is already set
DEMO_MODE=true npm run start:dev
# → http://localhost:3001/api
# → http://localhost:3001/api/health
# → http://localhost:3001/api/analyze/NVDA
```

## Design Tokens

| Token | Value |
|---|---|
| bg-base | `#050B18` |
| bg-surface | `#0A1628` |
| bg-card | `#0D1B2E` |
| indigo | `#4F46E5` |
| blue | `#3B82F6` |
| green | `#22C55E` |
| red | `#EF4444` |
| purple | `#8B5CF6` |

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/analyze` | Analysis action center |
| `/dashboard/[ticker]` | Command center dashboard |
| `/signals` | Live signal feed |
| `/watchlist` | Saved companies |
| `/companies` | Company explorer |
| `/reports` | Report center |
| `/news` | AI news terminal |
| `/settings` | User settings |
| `/pricing` | Pricing plans |

## Backend API

| Endpoint | Description |
|---|---|
| `GET /api/health` | Health check + provider status + cache stats |
| `GET /api/analyze/:ticker` | Full intelligence analysis (cached 15 min) |

In demo mode (`DEMO_MODE=true`), the backend returns rich mock analysis instantly with no external API calls. Set `DEMO_MODE=false` and add API keys to enable the live AI cascade (Claude → Gemini → OpenAI → rule-based fallback) and Bright Data scraping.

## Connecting Frontend to Backend

The frontend works standalone using `lib/mockData.ts`. To wire it to the backend, fetch from `http://localhost:3001/api/analyze/:ticker` in the dashboard's data-loading effect and map the response to the `Company` shape.

## Supported Tickers (rich mock data)

NVDA, TSLA, META, PLTR, AMD — plus generic fallback for any other symbol.

## License

For demonstration purposes. Not financial advice.
