import { defineAppConfig } from '../../lib/app-config';

export default defineAppConfig({
  name: 'saucedemo',
  baseURL: process.env.SAUCEDEMO_BASE_URL ?? 'https://www.saucedemo.com',
  ui: { browsers: ['chromium', 'firefox', 'webkit'] },
});
