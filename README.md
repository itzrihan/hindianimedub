# HindiAnimeDub — Hindi Anime Streaming Website

A full-featured Hindi anime streaming website built with React + Vite, powered by the Hindi Anime API.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to https://vercel.com and click "New Project"
3. Import your GitHub repo
4. Framework preset: **Vite**
5. Build command: `npm run build`
6. Output directory: `dist`
7. Click Deploy ✅

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Sticky nav with search + genre dropdown
│   ├── Footer.jsx
│   ├── AnimeCard.jsx     # Individual anime card
│   ├── AnimeGrid.jsx     # Responsive grid with skeleton loaders
│   └── SectionHeader.jsx
├── pages/
│   ├── Home.jsx          # Hero + latest + trending + genre links
│   ├── Browse.jsx        # Paginated anime list
│   ├── Search.jsx        # Search with results
│   ├── Genre.jsx         # Filter by genre
│   ├── Top.jsx           # Top anime list
│   ├── AnimeDetail.jsx   # Anime info + episode list
│   └── Watch.jsx         # Video player with server selection
├── hooks/
│   └── useFetch.js       # Generic data fetching hook
└── utils/
    └── api.js            # API client for hindi-anime-api
```

## 🎨 Design

- **Dark cinematic theme** inspired by anime aesthetics
- **Hindi UI** — all labels and navigation in Hindi
- **Responsive** — works on mobile, tablet, desktop
- **Smooth animations** — fade-ins, hover effects, skeleton loaders

## 🔌 API

All data comes from: `https://hindi-anime-api-neon.vercel.app/api`

Endpoints used:
- `GET /home` — Home page data
- `GET /anime?page=N` — Browse list
- `GET /anime/top` — Top anime
- `GET /anime/search?q=query` — Search
- `GET /anime/genre/:genre` — By genre
- `GET /anime/:id` — Anime detail + episodes
- `GET /episode/:id` — Episode servers
- `GET /video?url=...` — Extract video embed
