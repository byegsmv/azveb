# Execution Plan — Project Orchestrator 3

## Overview
Orchestrate Weather Tool creation and AI Agronomist module bug fixes for fermermarket codebase.

## Milestones & Execution Strategy

### Milestone 1: Weather Tool Implementation (M1)
- **Target Files**: `src/utils/weather.js`, `src/app/api/weather/route.js`, `src/utils/weather.test.js`.
- **Workflow**: Iteration Loop (Explorer -> Worker -> Reviewer -> Challenger -> Auditor -> Gate).

### Milestone 2: AI Agronomist Backend Repair (M2)
- **Target Files**: `src/app/api/ai/agronomist/route.js`, `src/lib/gemini.js`, `src/app/api/ai/agronomist/route.test.js`.
- **Workflow**: Iteration Loop (Explorer -> Worker -> Reviewer -> Challenger -> Auditor -> Gate).

### Milestone 3: AI Agronomist Frontend Repair (M3)
- **Target Files**: `src/app/[locale]/agronom/page.js`.
- **Workflow**: Iteration Loop (Explorer -> Worker -> Reviewer -> Challenger -> Auditor -> Gate).

### Milestone 4: Final Integration & E2E Validation (M4)
- **Target Scope**: Verification across full project build (`npm run build`), lint (`npm run lint`), unit test suite (`npm test`), and final Forensic Audit.
