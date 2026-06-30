import { defineAppConfig } from '../../lib/app-config';

export default defineAppConfig({
  name: 'bestbuy',
  baseURL: process.env.BESTBUY_BASE_URL ?? 'https://www.bestbuy.com',
  ui: { browsers: ['chromium'] },
});
