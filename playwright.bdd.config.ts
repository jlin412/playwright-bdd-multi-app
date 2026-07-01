import { defineConfig, devices, type Project } from '@playwright/test';
import './lib/load-env';
import { defineBddConfig } from 'playwright-bdd';
import { apps } from './config/apps';
import { deviceKey } from './lib/app-config';

const smokeOnly = process.env.SMOKE_ONLY === '1';

// One BDD config per app: each gets its own generated output dir and an
// app-scoped `steps` glob. That isolation is what lets every app keep its own
// `steps/fixtures.ts` (one `test` instance + one decorated class set per glob).
const bddByApp = Object.fromEntries(
  apps.map((app) => [
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

// Routing rule: an app with UI runs its BDD suite as browser projects; a
// pure-API app runs it as an API project. (An app needing both UI and API BDD
// can split features into features/ui + features/api and add matching projects.)
const projects: Project[] = apps.flatMap((app) => {
  const testDir = bddByApp[app.name];

  if (app.ui) {
    return app.ui.browsers.map((browser) => ({
      name: `bdd-ui-${app.name}-${browser}`,
      testDir,
      use: { ...devices[deviceKey(browser)], baseURL: app.baseURL },
    }));
  }

  if (app.api) {
    return [{ name: `bdd-api-${app.name}`, testDir, use: { baseURL: app.baseURL } }];
  }

  return [];
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
  ],
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects,
});
