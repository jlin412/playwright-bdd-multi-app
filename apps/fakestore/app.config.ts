import { defineAppConfig } from '../../lib/app-config';

export default defineAppConfig({
  name: 'fakestore',
  baseURL: process.env.FAKESTORE_BASE_URL ?? 'https://fakestoreapi.com',
  api: true,
});
