# Project: Weather Tool & AI Agronomist Repair

## Architecture
- **Framework**: Next.js 16.3.0 (App Router), React 18, Tailwind CSS, Prisma 5.22.
- **Modules**:
  - `src/utils/weather.js`: OpenWeatherMap integration library exporting `get_weather(location)`.
  - `src/app/api/weather/route.js`: API endpoint querying weather.
  - `src/lib/gemini.js`: Gemini AI integration service.
  - `src/app/api/ai/agronomist/route.js`: AI Agronomist backend API handler.
  - `src/app/[locale]/agronom/page.js`: AI Agronomist frontend user interface page.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Weather Tool Core (`get_weather`) | `src/utils/weather.js` exporting `get_weather(location)` returning formatted JSON string or `is_error` JSON | M1 | Survey / User Request |
| 2 | Weather API Endpoint | `src/app/api/weather/route.js` using `get_weather` for city queries | M1 | Survey / User Request |
| 3 | Weather Unit Tests | `src/utils/weather.test.js` validating success format, errors (not_found, rate_limit, missing key) | M1 | Survey / User Request |
| 4 | Agronomist Route RateLimit Fix | Fix `req || request` scope bug and move rate limiting inside `try...catch` in `src/app/api/ai/agronomist/route.js` | M2 | Survey / User Request |
| 5 | Gemini Config Fix | Fix `gemini-2.5-flash` to `gemini-1.5-flash` and remove `thinkingConfig` in `src/lib/gemini.js` | M2 | Survey / User Request |
| 6 | Agronomist Route Unit Tests | `src/app/api/ai/agronomist/route.test.js` testing rate limiting, module active, offline fallback, errors | M2 | Survey / User Request |
| 7 | Frontend Agronomist Error Handling | Clean error toasts and placeholder preservation on API errors in `src/app/[locale]/agronom/page.js` | M3 | Survey / User Request |
| 8 | UI Layout Preservation | Preserve existing HTML/CSS layouts across header, weather widget, and agronom page | M3 | Survey / User Request |
| 9 | E2E Build, Lint & Test Validation | 100% passing `npm test`, `npm run lint`, and `npm run build` | M4 | Survey / User Request |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Weather Tool Implementation | `src/utils/weather.js`, `src/app/api/weather/route.js`, `src/utils/weather.test.js` | none | PLANNED |
| 2 | M2: AI Agronomist Backend Repair | `src/app/api/ai/agronomist/route.js`, `src/lib/gemini.js`, `src/app/api/ai/agronomist/route.test.js` | none | PLANNED |
| 3 | M3: AI Agronomist Frontend Repair | `src/app/[locale]/agronom/page.js` | M2 | PLANNED |
| 4 | M4: Final Integration & E2E Validation | Build, Lint, Test, Audit verification | M1, M2, M3 | PLANNED |

## Interface Contracts
### Weather Tool (`src/utils/weather.js`)
- Function: `export async function get_weather(location: string): Promise<string>`
- Success format: `JSON.stringify({ date: "YYYY-MM-DD", temperature: "XX°C", humidity: "YY%" })`
- Error format: `JSON.stringify({ is_error: true, message: "<error message>" })`

### AI Agronomist Endpoint (`src/app/api/ai/agronomist/route.js`)
- Method: `POST`
- Request: FormData or JSON with `text` and optional `image` file
- Success response: `200 OK` JSON `{ disease, confidence, recommendation, sprayTime, products }`
- Error response: `403` / `429` / `500` JSON `{ error: "<error message>" }`

## Code Layout
- `src/utils/weather.js` — Weather utility
- `src/utils/weather.test.js` — Weather unit tests
- `src/app/api/weather/route.js` — Weather API route handler
- `src/lib/gemini.js` — Gemini API client service
- `src/app/api/ai/agronomist/route.js` — AI Agronomist API route handler
- `src/app/api/ai/agronomist/route.test.js` — AI Agronomist API unit tests
- `src/app/[locale]/agronom/page.js` — AI Agronomist page component
