import { defineAppConfig } from '../../lib/app-config';

// Template app config. Prefer `npm run new:app -- <name> --kind ui|api|both --url <baseURL>`
// which copies this folder, fills the values below, prunes the unused dimension,
// and registers the app in config/apps.ts.
export default defineAppConfig({
  name: '__APP_NAME__',
  baseURL: process.env.__ENV_VAR__ ?? '__BASE_URL__',
  ui: { browsers: ['chromium'] },
  api: true,
});
