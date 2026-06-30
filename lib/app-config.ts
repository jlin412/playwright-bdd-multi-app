/**
 * App-under-test descriptor.
 *
 * Each app lives in `apps/<name>/` and exports one of these as the default
 * export of `apps/<name>/app.config.ts`. The descriptors are aggregated in
 * `config/apps.ts` and drive both Playwright configs (spec + BDD): one app
 * entry generates its spec/BDD projects automatically, so adding a new app is
 * "drop a folder + register one import".
 *
 * The base URL flows into each generated project's `use.baseURL`, so page
 * objects and service objects keep using *relative* navigation
 * (`page.goto('/')`, `request.get('/path')`).
 */
export type Browser = 'chromium' | 'firefox' | 'webkit';

export type AppDescriptor = {
  /** Folder name under `apps/` and project-name prefix. Keep it fs-friendly. */
  name: string;
  /** Base URL for this app. Used as each generated project's `use.baseURL`. */
  baseURL: string;
  /** Present for apps with UI coverage. Emits `ui-<name>-<browser>` (spec) and `bdd-ui-<name>-<browser>` (BDD) projects. */
  ui?: { browsers: Browser[] };
  /** True for apps with API coverage. Emits an `api-<name>` spec project (and `bdd-api-<name>` when the app has no UI). */
  api?: boolean;
};

/** Identity helper that gives editors full type-checking on each `app.config.ts`. */
export const defineAppConfig = (config: AppDescriptor): AppDescriptor => config;

/** Playwright device preset key for a browser engine. */
export const deviceKey = (browser: Browser): string =>
  browser === 'firefox'
    ? 'Desktop Firefox'
    : browser === 'webkit'
      ? 'Desktop Safari'
      : 'Desktop Chrome';
