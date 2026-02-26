# Chubb Sample Test Automation Framework (TypeScript)

## Components Included

- API Utilities
- Kafka Utility
- DB Utility
- TestDataLoader Utility
- Logging
- Core Utilities
- Annotations
- Driver Factory
- Exceptions
- Reporter Facade
- Logger
- Json Utility
- Playwright Config + Fixtures + POM + Global Hooks

## Project Structure

```text
src
├─ annotations
├─ api
│  ├─ utils
├─ core
├─ db
├─ driver
├─ e2e
├─ exceptions
├─ fixtures
├─ globals
├─ kafka
├─ logging
├─ reporter
└─ testdata

## Playwright Capabilities Added

- Environment-aware execution via `NODE_ENV` and `dotenv` in `playwright.config.ts`
- Test grouping using folders/tags (`api`, `ui`, `e2e`, plus `@regression`, `@sanity`)
- Global setup/teardown under `src/globals`
- API data fixture under `src/fixtures/test-fixtures.ts`
- UI Page Object Model under `src/ui/pages`
- Sample API, UI, and E2E specs under `src/api`, `src/ui`, `src/e2e`

## Environment Files

Use:

- `environments/local.env`
- `environments/dev.env`
- `environments/qa.env`

Set values such as:

- `BASE_URL`
- `API_BASE_URL`
```

## Quick Start

1. Install dependencies:

```powershell
npm install
```

2. Type-check:

```powershell
npm run check
```

3. Build:

```powershell
npm run build
```

## Run Playwright

```powershell
npm run test:qa
npm run test:api:qa
npm run test:qa:api:regression
npm run test:showcase
npm run pw:list
npx playwright test src/core/utilities/JsonUtility.spec.ts
```

## Allure Report

1. Run tests to produce `allure-results`:

```powershell
npm run test:qa
```

2. Generate the HTML report:

```powershell
npm run allure:generate
```

3. Open the generated report:

```powershell
npm run allure:open
```

Optional (generate + open in one command):

```powershell
npm run allure:serve
```

## Showcase Tests

Feature-focused examples are in:

- `src/showcase/framework-components.spec.ts`
- `src/showcase/integrations.spec.ts`

They demonstrate:

- annotations + metadata
- test data loader + json utility
- reporter facade with custom reporter
- core utilities + framework exceptions
- API/DB/Kafka utility usage
- driver factory behavior (Playwright + fallback)
