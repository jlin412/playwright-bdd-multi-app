import { defineConfig, devices, type Project } from '@playwright/test';
import './lib/load-env';
import { apps } from './config/apps';
import { deviceKey } from './lib/app-config';

const smokeOnly = process.env.SMOKE_ONLY === '1';

// Spec-style projects are generated from the app registry (config/apps.ts).
// Per-app base URL flows through use.baseURL; POM/SOM keep relative navigation.
const projects: Project[] = apps.flatMap((app) => {
  const apiProject: Project[] = app.api
    ? [
        {
          name: `api-${app.name}`,
          testMatch: new RegExp(`apps/${app.name}/specs/api/.*\\.spec\\.ts`),
          use: { baseURL: app.baseURL },
        },
      ]
    : [];

  const uiProjects: Project[] = app.ui
    ? app.ui.browsers.map((browser) => ({
        name: `ui-${app.name}-${browser}`,
        testMatch: new RegExp(`apps/${app.name}/specs/e2e/.*\\.spec\\.ts`),
        use: { ...devices[deviceKey(browser)], baseURL: app.baseURL },
      }))
    : [];

  return [...apiProject, ...uiProjects];
});

export default defineConfig({
  testDir: '.',
  // Smoke runs exclude long multi-step workflow specs, intentional-fail specs,
  // and the copyable template skeleton.
  testIgnore: [
    /apps\/_template\/.*/,
    ...(smokeOnly
      ? [/apps\/.*\/specs\/e2e\/workflows\/.*\.spec\.ts/, /apps\/.*\/specs\/.*\/trace-fail\.spec\.ts/]
      : []),
  ],
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects,
});
