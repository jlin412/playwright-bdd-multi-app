import type { AppDescriptor } from '../lib/app-config';

// ── App registry ────────────────────────────────────────────────────────────
// Register every app under test here. Each import is the default export of an
// `apps/<name>/app.config.ts`. Both Playwright configs (spec + BDD) map over
// this array to generate their projects, so adding an app is:
//   1. create apps/<name>/ (copy apps/_template, or run `npm run new:app`)
//   2. add one import + one array entry below
import yosemitecinema from '../apps/yosemitecinema/app.config';
import saucedemo from '../apps/saucedemo/app.config';
import petstore from '../apps/petstore/app.config';

export const apps: AppDescriptor[] = [yosemitecinema, saucedemo, petstore];
