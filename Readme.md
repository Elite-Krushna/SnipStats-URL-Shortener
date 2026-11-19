# SnipStats: URL Shortener + Analytics Dashboard

A full-stack URL shortener with a click-analytics dashboard, built as a Cloud Computing college project. It runs entirely on your own computer and uses no cloud services.

## What it does

- Turns a long URL into a short link such as `http://localhost:3000/aB3xYz`
- Validates URLs and blocks unsafe schemes (`javascript:`, `data:`, `file:` and others)
- Redirects short links to the original URL and records every click with a timestamp
- Shows a dashboard with total links, total clicks, clicks per day (chart) and a table of links with copy and open actions

## Technology stack

| Part | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite (JavaScript) | User interface and dev server |
| Styling | Plain CSS | Dark purple theme, responsive layout |
| Routing | React Router | Landing page and dashboard pages |
| Charts | Recharts | Clicks-per-day chart |
| Icons | Lucide React | Icons |
| Animations | GSAP | Light animations (respects reduced-motion settings) |
| Backend | Node.js + Express | REST API and redirects |
| Database | SQLite (built-in `node:sqlite`) | Local file database |
| Config | dotenv | Environment variables |

## Folder structure

```
c/
├── README.md
├── frontend/
│   ├── package.json
│   └── src/
│       ├── components/    Navbar, Hero, Features, Footer, StatCard,
│       │                  LinksTable, ActivityChart, ToastProvider, ScrollManager
│       ├── pages/         LandingPage, DashboardPage, NotFoundPage
│       ├── services/      api.js (all calls to the backend)
│       ├── styles/        global.css
│       ├── App.jsx
│       └── main.jsx
└── backend/
    ├── package.json
    ├── .env.example       template for your own .env
    ├── data/              app.db is created here (not committed)
    └── src/
        ├── config/        env.js (reads .env)
        ├── db/            database.js (opens SQLite, creates tables)
        ├── repositories/  urlRepository.js (the only code that runs SQL)
        ├── services/      urlService.js (validation, short codes, business rules)
        ├── controllers/   urlController.js (request in, response out)
        ├── routes/        urlRoutes.js (URL paths)
        └── server.js      starts Express
```

A request travels like this: **Route → Controller → Service → Repository → SQLite**.

## Prerequisites

- **Node.js 22.13 or newer** (developed on v24). The built-in `node:sqlite` module needs a recent Node.
- **npm** (installed with Node.js)
- A modern browser (Chrome, Edge or Firefox)
- Windows, macOS or Linux. The commands below are for Windows PowerShell.

Check your versions:

```powershell
node --version
npm --version
```

## Installation

Open the project folder in VS Code, then use **two terminals**.

**Terminal 1: backend**

```powershell
cd backend
npm install
copy .env.example .env
```

**Terminal 2: frontend**

```powershell
cd frontend
npm install
```

On macOS or Linux, use `cp .env.example .env` instead of `copy`.

## Environment configuration

The backend reads `backend/.env`. The `.env.example` file lists every setting:

| Variable | Default | Meaning |
|---|---|---|
| `PORT` | `3000` | Port the backend listens on |
| `BASE_URL` | `http://localhost:3000` | Address used when building short links |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | The only website allowed to call the API (CORS) |
| `DB_PATH` | `data/app.db` | SQLite file, relative to the `backend` folder |

The frontend finds the backend through the `API_URL` constant at the top of `frontend/src/services/api.js` (currently `http://localhost:3000`). If you change `PORT`, change it there too.

## Database

- SQLite stores everything in one file: `backend/data/app.db`. It is created automatically on first start.
- The file lives outside the frontend folder, so it is never served to the browser.
- Data survives restarts. To start fresh, stop the backend and delete the `data` folder.

| Table | Columns |
|---|---|
| `links` | `code` (primary key), `original_url`, `created_at`, `click_count` |
| `click_events` | `id`, `code` (references `links`), `clicked_at` |

Indexes exist on `links.created_at`, `click_events.code` and `click_events.clicked_at`. All queries are parameterized.

## Running the app

Start the backend first (Terminal 1, inside `backend`):

```powershell
npm run dev
```

Expected: `Backend running at http://localhost:3000`

Then the frontend (Terminal 2, inside `frontend`):

```powershell
npm run dev
```

Expected: `Local: http://localhost:5173/`

To stop either server, click in its terminal and press **Ctrl + C**.

## Local URLs

| What | URL |
|---|---|
| Website | http://localhost:5173/ |
| Dashboard | http://localhost:5173/dashboard |
| API health check | http://localhost:3000/api/health |
| A short link | http://localhost:3000/`<code>` |

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Confirms the server is running |
| POST | `/api/shorten` | Body `{ "url": "..." }`. Returns `201` with `{ code, shortUrl, originalUrl }`, or `400` with `{ error }` |
| GET | `/api/links?limit=10` | Recent links, newest first, with click counts (limit 1 to 100) |
| GET | `/api/links/:code` | Details of one link, or `404` |
| GET | `/api/stats` | `{ totalLinks, totalClicks }` |
| GET | `/api/stats/activity?days=7` | Clicks per day for the last N days (1 to 90), in UTC |
| GET | `/:code` | Redirects (`302`) to the original URL and records a click, or `404` |

Unknown API paths return `{ "error": "Route not found." }`.

Quick test in PowerShell:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/shorten -ContentType "application/json" -Body '{"url":"https://www.wikipedia.org"}'
```

## Troubleshooting

| Problem | Fix |
|---|---|
| `EADDRINUSE: address already in use :::3000` | An old backend is still running. Press Ctrl + C in the other terminal, or change `PORT` in `.env` |
| Page says "Cannot reach the server" | Start the backend and check http://localhost:3000/api/health |
| Red CORS error in the browser console | The frontend must run on the address in `FRONTEND_ORIGIN`. Restart the backend after editing `.env` |
| `No such built-in module: node:sqlite` | Your Node.js is too old. Install the latest LTS from nodejs.org |
| `Cannot find module` | Run `npm install` inside both `backend` and `frontend` |
| Dashboard looks empty after a fresh clone | Normal: the database starts empty. Shorten a URL on the home page first |
| "ExperimentalWarning: SQLite" in the backend terminal | Harmless notice |
| Red `400` lines in the browser console | Expected when you submit an invalid URL. The server is rejecting it correctly |
| Backend shows empty data after an earlier test | Check that the `DB_PATH` environment variable is not set in your terminal (`Remove-Item Env:DB_PATH`) |

## Current limitations

- No user accounts: anyone who can open the site sees all links and statistics.
- The dashboard's **Open** button counts as a real click.
- Chart days use UTC, so they may differ from your local date.
- Only one frontend origin is allowed by CORS, and the API address is hard-coded in `api.js`.
- No rate limiting, no link deletion or editing, and no custom short codes.
- Shortening the same URL twice creates two different links.
- `node:sqlite` is marked experimental in Node.js and may change in future versions.
- There are no automated tests, only the manual checks used during development.
- Short links only work while the backend runs on your own computer.