import { defineAppConfig } from '../../lib/app-config';

export default defineAppConfig({
  name: 'petstore',
  // Origin only — the /v2 base path lives on the SOM endpoints, because a
  // leading-slash request path resolves against the origin (new URL() drops
  // a base-URL path segment), which is the natural Playwright convention.
  baseURL: process.env.PETSTORE_BASE_URL ?? 'https://petstore.swagger.io',
  api: true,
});
