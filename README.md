# Six Rivers Community Intelligence Platform

A community-centered intelligence platform for **Six Rivers Africa**, supporting field teams working with villages adjacent to protected areas in southern Tanzania.

## Overview

Six Rivers Africa protects ~33,400 km² across the Usangu Game Reserve and Nyerere National Park. This platform serves the **community team** — field officers, project officers, and impact managers — who work *outside* the parks with farming communities in the **Psolo Sector** (Kilombero District) and **Usangu Basin** (Mbarali District).

### What It Does

| Module | Purpose |
|--------|---------|
| **Operational Map** | Interactive map with real administrative boundaries (regions, districts, wards, villages) from Tanzania shapefiles. Satellite/hybrid basemaps, cascading filters. |
| **Farming Tracker** | Farmer registration, seedling distribution logging, survival checks, crop cycle tracking, agroforestry plot management. |
| **Tree Nurseries** | Nursery registry, batch tracking (germination → ready → distributed), production vs distribution flow. |
| **Cattle Pressure** | Incident logging with GPS, type/severity classification, pressure heatmap for Usangu Basin. |
| **Micro-Climate** | Ward-level weather data, drought risk alerts, rainfall & temperature trends. |
| **Field Collection** | Mobile-first forms with GPS capture, offline queue for areas with poor connectivity. |
| **Impact Dashboard** | Auto-calculated KPIs, quarterly reporting, data export for donors. |

### Companion Product

This platform complements the existing [Landscape Health Intelligence Dashboard](https://six-rivers-africa-dashboard.vercel.app/) which monitors satellite-derived indicators (NDVI, fire, water, deforestation) *inside* protected areas.

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **Maps**: MapLibre GL JS + Tanzania Admin Shapefiles (converted to GeoJSON)
- **Charts**: Recharts
- **Database**: PostgreSQL + PostGIS via Supabase *(planned)*
- **Auth**: NextAuth.js v5 *(planned)*
- **Offline**: PWA with next-pwa *(planned)*

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ernestmoyo/six_rivers_community.git
cd six_rivers_community

# Install dependencies
cd app
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the platform.

### Shapefile Setup (Optional)

The repository includes pre-generated GeoJSON files in `app/public/geo/`. To regenerate from source shapefiles:

1. Download [Tanzania Admin Shapefiles](https://data.humdata.org/) and place in `data/shapefiles/`
2. Run the conversion script:

```bash
cd app
node scripts/convert-shapefiles.mjs
```

This filters to operational areas (Mbarali + Kilombero districts) and outputs GeoJSON to `app/public/geo/`.

## Project Structure

```
six_rivers_community/
├── app/                          # Next.js application
│   ├── public/
│   │   └── geo/                  # Generated GeoJSON boundary files
│   ├── scripts/
│   │   └── convert-shapefiles.mjs  # Shapefile → GeoJSON converter
│   └── src/
│       ├── app/(main)/           # Route pages
│       │   ├── dashboard/        # Overview KPIs & activity
│       │   ├── map/              # MapLibre GL operational map
│       │   ├── villages/         # Village directory & detail
│       │   ├── farming/          # Farmers, distributions, crops, agroforestry
│       │   ├── nurseries/        # Nursery management
│       │   ├── cattle/           # Cattle pressure module
│       │   ├── field/            # Mobile field collection
│       │   ├── impact/           # Impact dashboards & export
│       │   ├── climate/          # Micro-climate monitor
│       │   └── settings/         # Team & config
│       ├── components/           # Shared UI components
│       ├── lib/                  # Utilities, constants, demo data
│       └── types/                # TypeScript interfaces
├── data/
│   ├── shapefiles/               # Tanzania admin boundary files (not in git)
│   ├── population/               # Census data CSVs
│   └── locations/                # Tanzania location DB setup
└── docs/
    └── SOP-Community-Intelligence-Platform.md
```

## Operational Areas

- **Psolo Sector** — 81 villages in Kilombero District, Morogoro Region. Adjacent to Nyerere National Park.
- **Usangu Basin** — 196 villages in Mbarali District, Mbeya Region. Near Usangu Game Reserve & Ruaha NP.

## Data Sources

| Dataset | Source | Coverage |
|---------|--------|----------|
| Village boundaries | Tanzania NBS Shapefiles | 15,183 villages nationwide, filtered to 277 operational |
| Ward boundaries | Tanzania NBS Shapefiles | 4,344 wards, filtered to 55 |
| District boundaries | Tanzania NBS Shapefiles | 195 districts, filtered to 32 (context region) |
| Population | Tanzania Census 1988–2022 | Ward & district level |
| Weather | Open-Meteo API | Per ward centroid *(planned)* |

## Team

- **Ernest Moyo** — Developer ([7Square Inc.](https://7squareinc.com))
- **Six Rivers Africa** — Conservation NGO, southern Tanzania

## License

This project is proprietary to Six Rivers Africa and 7Square Inc.
