import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Loads environment variables for every config run, in this order (earliest
// wins; real process.env / CI vars always win because dotenv defaults to
// override: false):
//   1. root .env          — shared / fallback variables
//   2. apps/<name>/.env   — per-app variables (gitignored)
//
// Keys are NOT transformed: put the exact variable names the app's code reads
// (e.g. SAUCEDEMO_BASE_URL, SAUCE_USERNAME) in its apps/<name>/.env. Because
// Playwright runs every app in one process, keep keys app-unique (prefixed) so
// they don't collide across apps. See each app's .env.example for the keys.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

dotenv.config({ path: path.join(root, '.env') });

const appsDir = path.join(root, 'apps');
if (fs.existsSync(appsDir)) {
  for (const entry of fs.readdirSync(appsDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const envPath = path.join(appsDir, entry.name, '.env');
    if (fs.existsSync(envPath)) dotenv.config({ path: envPath });
  }
}
