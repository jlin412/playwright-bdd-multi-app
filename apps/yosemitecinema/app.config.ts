import { defineAppConfig } from '../../lib/app-config';

export default defineAppConfig({
  name: 'yosemitecinema',
  baseURL: process.env.YOSEMITECINEMA_BASE_URL ?? 'https://www.yosemitecinema.com',
  ui: { browsers: ['chromium'] },
  api: true,
});
