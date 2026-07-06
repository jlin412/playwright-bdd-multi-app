import { defineConfig, devices, type Project } from '@playwright/test';
import './lib/load-env';
import { defineBddConfig } from 'playwright-bdd';
import { apps } from './config/apps';
import { deviceKey } from './lib/app-config';

const smokeOnly = process.env.SMOKE_ONLY === '1';

// BDD is a UI-only concern: one BDD config per UI app, each with its own
// generated output dir and an app-scoped `steps` glob. That isolation is what
// lets every app keep its own `steps/fixtures.ts` (one `test` instance + one
// decorated class set per glob). The `som/**` glob is kept so service objects
// can still back UI BDD steps (setup/teardown/regular steps). API coverage is
// spec-only (`api-<name>` projects in playwright.config.ts) — no BDD projects.
const bddByApp = Object.fromEntries(
  apps
    .filter((app) => app.ui)
    .map((app) => [
      app.name,
      defineBddConfig({
        outputDir: `.features-gen/${app.name}`,
        features: `apps/${app.name}/features/**/*.feature`,
        steps: [
          `apps/${app.name}/steps/**/*.ts`,
          `apps/${app.name}/pom/**/*.ts`,
          `apps/${app.name}/som/**/*.ts`,
        ],
      }),
    ]),
);

// An app with UI runs its BDD suite as browser projects. Pure-API apps have no
// BDD projects — their API surface is exercised by spec `api-<name>` projects.
const projects: Project[] = apps.flatMap((app) => {
  if (!app.ui) return [];

  const testDir = bddByApp[app.name];
  return app.ui.browsers.map((browser) => ({
    name: `bdd-ui-${app.name}-${browser}`,
    testDir,
    use: { ...devices[deviceKey(browser)], baseURL: app.baseURL },
  }));
});

export default defineConfig({
  grepInvert: smokeOnly ? /@tracefail|@fail|@triage/ : undefined,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 150_000, // live external sites: member/checkout backgrounds can take 70–80s
  workers: 2, // cap at 2 — running against live external sites
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['./bdd/cucumber-reporter.cjs', {
      outputFile: 'cucumber-report/index.html',
      externalAttachments: true,
    }],
    // Per-test JSON (incl. flaky-vs-failed retry outcomes) for the /testops-ci loop.
    ...(process.env.CI ? ([['json', { outputFile: 'pw-report/results.json' }]] as const) : []),
  ],
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects,
});
