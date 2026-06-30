import { defineAppConfig } from '../../lib/app-config';

// Template app config. Prefer the /new-api-app or /new-ui-app slash command
// (engine: scripts/new-app.mjs), which copies this folder, fills the values
// below, prunes the unused dimension, and registers the app in config/apps.ts.
export default defineAppConfig({
  name: '__APP_NAME__',
  baseURL: process.env.__ENV_VAR__ ?? '__BASE_URL__',
  ui: { browsers: ['chromium'] },
  api: true,
});
