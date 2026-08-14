# Explorer 1 Survey Report: Weather Tool & Codebase Structure

## 1. Observation

### 1.1 Tech Stack & Codebase Identification
- **Framework & Runtime**: Next.js 16.3.0 App Router (`src/app/[locale]`), React 18.3.0, Node.js runtime (`package.json:29,34-35`).
- **Language**: JavaScript (ES Modules, JSX, Node.js).
- **ORM & Database**: PostgreSQL with Prisma ORM 5.22.0 (`prisma/schema.prisma`, `src/lib/prisma.js`).
- **Styling & UI**: Tailwind CSS 3.4.19 (`tailwind.config.js`), Lucide React icons (`lucide-react`).
- **i18n**: `next-intl` 4.13.4 (`src/i18n/`, `messages/` supporting AZ default, EN, RU).
- **Testing Framework**: Jest 30.4.2 (`jest.config.js`, `jest.setup.js`), `@testing-library/react` 16.3.2.
- **Integrations**: Meta WhatsApp Business Cloud API (`src/lib/whatsapp.js`), Google Gemini REST API (`src/lib/gemini.js`), Vercel Blob (`src/lib/blobUpload.js`).

### 1.2 Existing Weather Artifacts Observed
1. **API Endpoint (`src/app/api/weather/route.js:1-54`)**:
   - `GET /api/weather?city=...` currently uses `https://wttr.in/${encodeURIComponent(city)}?format=j1`.
   - Comment at line 4-5 specifically notes: `// If wttr.in is ever unreliable at scale, swap for OpenWeatherMap's free tier (requires OPENWEATHER_API_KEY).`
2. **UI Component (`src/components/home/WeatherWidget.js:1-48`)**:
   - Client component fetching live weather from Open-Meteo (`https://api.open-meteo.com/v1/forecast?...`).
   - Positioned in header (`src/components/Header.js:331`).
3. **Module Toggle System (`src/components/admin/ModuleToggleSystem.js:59-61`, `src/components/dashboard/AdminPanel.js:1803`)**:
   - Valid module key `WEATHER_WIDGET` registered in system settings.
4. **AI Agronomist Module (`src/app/api/ai/agronomist/route.js:1-161`, `src/app/[locale]/agronom/page.js:1-120`)**:
   - Uses Gemini AI (`src/lib/gemini.js`) to generate plant disease diagnosis, treatment recommendations, and spray timing suggestions.
   - References weather conditions in `AgronomCard.js:12` ("Hava Proqnozu").

### 1.3 Environment Variables
- `env.example:51-52` defines `GEMINI_API_KEY`.
- `OWM_API_KEY` is specified in `ORIGINAL_REQUEST.md:115` as the required environment variable for OpenWeatherMap integration.

---

## 2. Logic Chain

1. **Requirement Verification**: `ORIGINAL_REQUEST.md` (lines 107-130) specifies developing a weather tool function `get_weather(location: str) -> str` using OpenWeatherMap API with `OWM_API_KEY` that returns JSON output format: `{"date":"YYYY-MM-DD","temperature":"XX°C","humidity":"YY%"}` or error JSON with `is_error:true`.
2. **Directory & Structure Selection**: The project structure currently maintains server/utility logic under `src/lib/` (e.g. `gemini.js`, `whatsapp.js`, `apiClient.js`). However, `ORIGINAL_REQUEST.md` references `src/utils/weather.ts` / `src/utils/weather.py`. Creating `src/utils/weather.js` (or `src/lib/weather.js` with an export at `src/utils/weather.js`) directly satisfies the specified integration path contract while fitting cleanly into Next.js App Router conventions.
3. **OpenWeatherMap Integration Pattern**:
   - Endpoint: `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`
   - API Key Retrieval: Read from `process.env.OWM_API_KEY` (or fallback to `process.env.OPENWEATHER_API_KEY` or DB `Setting` table key `owmApiKey`).
   - Parsing:
     - `date`: Extract current date formatted as `YYYY-MM-DD` (e.g. `new Date().toISOString().split("T")[0]`).
     - `temperature`: Extract `Math.round(data.main.temp)` + `"°C"`.
     - `humidity`: Extract `data.main.humidity` + `"%"`.
4. **Error Handling Logic**:
   - HTTP 404 / City not found -> `{"is_error":true, "error":"not_found", "message":"Şəhər tapılmadı"}`
   - HTTP 429 / Rate limit -> `{"is_error":true, "error":"rate_limit", "message":"Sorğu limiti aşıldı"}`
   - Missing API Key / Network Failure -> `{"is_error":true, "error":"network_error", "message": "Hava məlumatı alına bilmədi"}`
5. **UI & Module Dependencies**:
   - `Header.js` (line 331) renders `WeatherWidget.js` in a fixed flex header bar.
   - `WeatherWidget.js` styling requires compact text rendering (`text-xs font-bold text-blue-900`).
   - Updating `/api/weather/route.js` to call `get_weather(city)` bridges the server utility with existing HTTP endpoints.
   - `src/app/api/ai/agronomist/route.js` can consume `get_weather` to pass weather context to Gemini when giving farming advice.

---

## 3. Caveats

- **API Key Availability**: During local test execution without a live `OWM_API_KEY`, the function must gracefully simulate responses or handle missing key state by returning the structured `is_error: true` JSON payload.
- **Language / Runtime**: Project is JavaScript (Node.js/Next.js), not Python. The function signature requested in pythonic syntax `get_weather(location: str) -> str` translates to `export async function get_weather(location)` returning a stringified JSON in JS.
- **Current Header Widget**: `WeatherWidget.js` uses client-side geolocation to call Open-Meteo. Refactoring `WeatherWidget` to call `/api/weather?city=...` will unify weather data fetching across the app.

---

## 4. Conclusion

1. **Tech Stack**: Next.js 16.3.0 (App Router), React 18, Tailwind CSS, Prisma 5.22, Jest.
2. **Integration Path**: `src/utils/weather.js` exporting `get_weather(location: string) -> Promise<string>`.
3. **Route Integration**: `src/app/api/weather/route.js` will delegate city queries to `src/utils/weather.js`.
4. **Contract Specifications**:
   - Input: `location` string (e.g., `"Şamaxı"`, `"Baku"`).
   - Environment Variable: `OWM_API_KEY`.
   - Success output: `JSON.stringify({ date: "YYYY-MM-DD", temperature: "XX°C", humidity: "YY%" })`
   - Error output: `JSON.stringify({ is_error: true, error: "<reason>", message: "<description>" })`
5. **UI Boundaries**: Header top bar (`src/components/Header.js:320-340`), `WeatherWidget.js`, and `AgronomCard.js`.

---

## 5. Verification Method

To verify the survey and future implementation:
1. **File Inspection**:
   - Verify `src/app/api/weather/route.js` exists.
   - Check `src/components/home/WeatherWidget.js` and `src/components/Header.js`.
2. **Test Command Execution**:
   - Run `npm test` or `npx jest __tests__/panels/admin.test.js` to confirm existing test execution environment.
   - New unit tests for weather utility should be created under `__tests__/weather.test.js` or `src/tests/weather.test.js`.
3. **Build Command**:
   - Run `npm run lint` and `npx next build` (or `npm run dev`) to verify build readiness without broken imports.
