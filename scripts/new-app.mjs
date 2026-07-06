#!/usr/bin/env node
// Generator engine for a complete app testing setup. The entry points are the
// Claude Code slash commands /new-api-app and /new-ui-app (see .claude/commands/);
// they invoke this script. You can also run it directly:
//
//   node scripts/new-app.mjs                       # interactive prompts
//   node scripts/new-app.mjs <name> --kind ui|api|both --url <baseURL> \
//     [--username <u> --password <p>] [--swagger <specUrl>] [--yes]
//
// It generates apps/<name>/ with app.config.ts, POM/SOM, spec + BDD fixtures,
// example specs/features, registers the app in config/apps.ts, adds npm scripts,
// writes credentials to .env (gitignored), and — when a Swagger/OpenAPI URL is
// given — scaffolds a Service Object with methods for the spec's safe GET
// endpoints (saving the spec to apps/<name>/openapi.json).
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLACEHOLDER_URL = 'https://example.com';

// ── arg parsing ──────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = { kind: undefined, url: undefined, name: undefined, username: undefined, password: undefined, swagger: undefined, yes: false, interactive: false };
  const positional = [];
  const take = (a, key, i) => {
    if (a === `--${key}`) { args[key] = argv[i + 1]; return 2; }
    if (a.startsWith(`--${key}=`)) { args[key] = a.slice(key.length + 3); return 1; }
    return 0;
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--yes' || a === '-y') { args.yes = true; continue; }
    if (a === '--interactive' || a === '-i') { args.interactive = true; continue; }
    let n = 0;
    for (const key of ['kind', 'url', 'username', 'password', 'swagger']) {
      n = take(a, key, i);
      if (n) { i += n - 1; break; }
    }
    if (!n && !a.startsWith('-')) positional.push(a);
  }
  args.name = positional[0];
  return args;
}

// ── prompting ────────────────────────────────────────────────────────────────
async function gatherInteractive(initial) {
  const rl = readline.createInterface({ input: stdin });
  const it = rl[Symbol.asyncIterator](); // robust line reading for TTY and pipes
  const ask = async (q, def) => {
    stdout.write(`${q}${def ? ` (${def})` : ''}: `);
    const { value, done } = await it.next();
    return ((done ? '' : value) || '').trim() || def || '';
  };
  try {
    let name = initial.name;
    while (!name || !/^[a-z0-9-]+$/.test(name) || name === '_template') {
      name = (await ask('App name (lowercase-hyphen)')).toLowerCase();
      if (!/^[a-z0-9-]+$/.test(name) || name === '_template') {
        console.log('  ! use lowercase letters, digits and hyphens (not "_template")');
        name = '';
      }
    }
    let kind = initial.kind;
    while (!['ui', 'api', 'both'].includes(kind)) {
      kind = (await ask('Kind [ui/api/both]', 'both')).toLowerCase();
    }
    const url = initial.url ?? (await ask('Base / test URL', PLACEHOLDER_URL));

    let username = initial.username;
    let password = initial.password;
    if (kind !== 'api') {
      username = username ?? ((await ask('Test username (blank to skip)')) || undefined);
      if (username) password = password ?? ((await ask('Test password (blank to skip)')) || undefined);
    }

    let swagger = initial.swagger;
    if (kind !== 'ui') {
      swagger = swagger ?? ((await ask('Swagger/OpenAPI spec URL (blank to skip)')) || undefined);
    }
    return { name, kind, url, username, password, swagger };
  } finally {
    rl.close();
  }
}

// ── fs helpers ───────────────────────────────────────────────────────────────
async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await fs.copyFile(s, d);
  }
}
const rmDir = (p) => fs.rm(p, { recursive: true, force: true });
const rmFile = (p) => fs.rm(p, { force: true });
const exists = (p) => fs.stat(p).then(() => true).catch(() => false);

// ── case helpers ─────────────────────────────────────────────────────────────
const pascal = (s) => s.split(/[^a-zA-Z0-9]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('') || 'App';
const camel = (s) => { const p = pascal(s); return p[0].toLowerCase() + p.slice(1); };
const envPrefix = (name) => name.toUpperCase().replace(/[^A-Z0-9]/g, '_');

// ── swagger / openapi ────────────────────────────────────────────────────────
async function loadSwagger(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
  return res.json();
}

// Returns { origin, basePath, title, ops: [{ method, fullPath, summary }] }.
// Only GET operations with no required parameters are emitted (safe to call
// without test data); the SOM is a starting point you extend by hand.
function deriveApi(spec) {
  let origin = '';
  let basePath = '';
  if (spec.servers?.[0]?.url) {
    try {
      const u = new URL(spec.servers[0].url);
      origin = u.origin;
      basePath = u.pathname.replace(/\/$/, '');
    } catch {
      basePath = spec.servers[0].url.replace(/\/$/, '');
    }
  } else if (spec.host) {
    const scheme = spec.schemes?.[0] ?? 'https';
    origin = `${scheme}://${spec.host}`;
    basePath = (spec.basePath ?? '').replace(/\/$/, '');
  }

  const used = new Set();
  const ops = [];
  for (const [p, item] of Object.entries(spec.paths ?? {})) {
    const op = item?.get;
    if (!op) continue;
    const params = [...(item.parameters ?? []), ...(op.parameters ?? [])];
    const needsInput = params.some((pr) => pr.in === 'path' || (pr.required && (pr.in === 'query' || pr.in === 'header')));
    if (needsInput) continue;

    let method = camel(op.operationId || `get ${p}`);
    if (!/^[a-zA-Z]/.test(method)) method = `get${pascal(method)}`;
    let unique = method;
    let n = 2;
    while (used.has(unique)) unique = `${method}${n++}`;
    used.add(unique);

    const fullPath = `${basePath}${p}`.replace(/\/{2,}/g, '/');
    ops.push({ method: unique, fullPath, summary: op.summary || '' });
    if (ops.length >= 6) break;
  }
  return { origin, basePath, title: spec.info?.title || 'API', ops };
}

// ── file builders ────────────────────────────────────────────────────────────
function buildAppConfig(name, envVar, baseURL, kind) {
  const lines = [
    "import { defineAppConfig } from '../../lib/app-config';",
    '',
    'export default defineAppConfig({',
    `  name: '${name}',`,
    `  baseURL: process.env.${envVar} ?? '${baseURL}',`,
  ];
  if (kind !== 'api') lines.push("  ui: { browsers: ['chromium'] },");
  if (kind !== 'ui') lines.push('  api: true,');
  lines.push('});', '');
  return lines.join('\n');
}

function buildFixtures(style, classes) {
  const header = style === 'spec'
    ? "import { test as base, expect } from '@playwright/test';"
    : "import { test as base } from 'playwright-bdd';\nimport { expect } from '@playwright/test';";
  const imports = classes.map((c) => `import { ${c.className} } from '${c.importPath}';`).join('\n');
  const fields = classes.map((c) => `  ${c.fixture}: ${c.className};`).join('\n');
  const wiring = classes.map((c) => `  ${c.fixture}: async ({ ${c.ctor} }, use) => { await use(new ${c.className}(${c.ctor})); },`).join('\n');
  return style === 'spec'
    ? `${header}\n\n${imports}\n\ntype Fixtures = {\n${fields}\n};\n\nexport const test = base.extend<Fixtures>({\n${wiring}\n});\n\nexport { expect };\n`
    : `${header}\n\n${imports}\n\nexport const test = base.extend<{\n${fields}\n}>({\n${wiring}\n});\n\nexport { expect };\n`;
}

const homePom = () => `import { expect, type Locator, type Page } from '@playwright/test';
import { Fixture, Given, Then } from 'playwright-bdd/decorators';
import type { test } from '../steps/fixtures';

@Fixture<typeof test>('homePage')
export class HomePage {
  readonly body: Locator;

  constructor(readonly page: Page) {
    this.body = page.locator('body');
  }

  async goto() { await this.page.goto('/'); }
  async expectLoaded() { await expect(this.body).toBeVisible(); }

  @Given('I open the home page')
  async open() { await this.goto(); }

  @Then('the home page should load')
  async checkLoaded() { await this.expectLoaded(); }
}
`;

const homeSpec = (title) => `import { test } from '../fixtures';

test.describe('${title} home', () => {
  test('home page loads', async ({ homePage }) => {
    await homePage.goto();
    await homePage.expectLoaded();
  });
});
`;

const homeFeature = (title) => `@smoke @ui
Feature: ${title} home

    Scenario: Home page loads
        Given I open the home page
        Then the home page should load
`;

const loginPom = (envUser, envPass) => `import { expect, type Locator, type Page } from '@playwright/test';
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators';
import type { test } from '../steps/fixtures';

// Credentials come from .env (gitignored): ${envUser} / ${envPass}.
const USERNAME = process.env.${envUser} ?? '';
const PASSWORD = process.env.${envPass} ?? '';

@Fixture<typeof test>('loginPage')
export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(readonly page: Page) {
    // TODO: replace these placeholder locators with the real ones for your app.
    this.usernameInput = page.getByLabel(/user|email/i).first();
    this.passwordInput = page.getByLabel(/password/i).first();
    this.submitButton = page.getByRole('button', { name: /log ?in|sign ?in/i });
  }

  async goto() { await this.page.goto('/'); }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginAsTestUser() { await this.login(USERNAME, PASSWORD); }

  async expectLoggedIn() {
    // TODO: assert a post-login element unique to your app.
    await expect(this.submitButton).toBeHidden();
  }

  @Given('I am on the login page')
  async open() { await this.goto(); }

  @When('I log in as the test user')
  async loginStep() { await this.loginAsTestUser(); }

  @Then('I should be logged in')
  async checkLoggedIn() { await this.expectLoggedIn(); }
}
`;

const loginSpec = (title) => `import { test } from '../fixtures';

test.describe('${title} login', () => {
  // TODO: set real selectors in pom/login.page.ts, then remove .fixme.
  test.fixme('test user can log in', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsTestUser();
    await loginPage.expectLoggedIn();
  });
});
`;

const loginFeature = (title) => `@wip @ui
Feature: ${title} login

    # TODO: set real selectors in pom/login.page.ts, then re-tag this @smoke.
    Scenario: Test user can log in
        Given I am on the login page
        When I log in as the test user
        Then I should be logged in
`;

const healthSom = () => `import { expect, type APIRequestContext } from '@playwright/test';
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators';
import type { test } from '../steps/fixtures';

@Fixture<typeof test>('healthApi')
export class HealthApi {
  private lastStatus = 0;

  constructor(readonly request: APIRequestContext) {}

  async waitUntilReady() {
    await expect
      .poll(async () => {
        try { return (await this.request.get('/')).status(); } catch { return 0; }
      }, { timeout: 15_000, intervals: [500, 1000, 2000], message: 'Waiting for API root' })
      .toBeLessThan(500);
  }

  @Given('the API is reachable')
  async apiReady() { await this.waitUntilReady(); }

  @When('I request the root path')
  async requestRoot() { this.lastStatus = (await this.request.get('/')).status(); }

  @Then('the response should be returned without a server error')
  async checkOk() { expect(this.lastStatus).toBeLessThan(500); }
}
`;

const healthSpec = (title) => `import { expect, test } from '../fixtures';

test.describe('${title} API', () => {
  test('root path is reachable', async ({ healthApi }) => {
    await healthApi.waitUntilReady();
    const res = await healthApi.request.get('/');
    expect(res.status()).toBeLessThan(500);
  });
});
`;

function swaggerSom(name, api, swaggerUrl) {
  const cls = `${pascal(name)}Api`;
  const fix = `${camel(name)}Api`;
  const ops = api.ops.length ? api.ops : [{ method: 'getRoot', fullPath: api.basePath || '/', summary: 'API root' }];
  const methods = ops
    .map((o) => `  // ${o.summary || o.fullPath}\n  async ${o.method}(): Promise<APIResponse> {\n    return this.request.get('${o.fullPath}');\n  }`)
    .join('\n\n');
  return `import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators';
import type { test } from '../steps/fixtures';

// Generated from ${swaggerUrl}
// ${api.title} — methods cover the spec's no-parameter GET endpoints.
// Extend with the endpoints (and request bodies) your tests need.
@Fixture<typeof test>('${fix}')
export class ${cls} {
  private lastResponse?: APIResponse;

  constructor(readonly request: APIRequestContext) {}

  async waitUntilReady() {
    await expect
      .poll(async () => {
        try { return (await this.request.get('${ops[0].fullPath}')).status(); } catch { return 0; }
      }, { timeout: 30_000, intervals: [500, 1000, 2000], message: 'Waiting for ${api.title}' })
      .toBeLessThan(500);
  }

${methods}

  @Given('the API is reachable')
  async apiReady() { await this.waitUntilReady(); }

  @When('I request the primary endpoint')
  async requestFirst() { this.lastResponse = await this.${ops[0].method}(); }

  @Then('the response should be returned without a server error')
  async checkResponse() {
    expect(this.lastResponse, 'a request must be made first').toBeTruthy();
    expect(this.lastResponse!.status()).toBeLessThan(500);
  }
}
`;
}

function swaggerSpec(name, api) {
  const fix = `${camel(name)}Api`;
  const ops = api.ops.length ? api.ops : [{ method: 'getRoot', fullPath: api.basePath || '/' }];
  const cases = ops
    .map((o) => `  test('GET ${o.fullPath} responds', async ({ ${fix} }) => {\n    const res = await ${fix}.${o.method}();\n    expect(res.status()).toBeLessThan(500);\n  });`)
    .join('\n\n');
  return `import { expect, test } from '../fixtures';

test.describe('${api.title} API', () => {
  test('API is reachable', async ({ ${fix} }) => {
    await ${fix}.waitUntilReady();
  });

${cases}
});
`;
}

const hooks = (name) => `import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { Before, After } = createBdd(test);

Before(async () => { console.log('[${name}][Before] Starting scenario...'); });
After(async () => { console.log('[${name}][After] Scenario completed.'); });
`;

// ── registry + scripts + env ──────────────────────────────────────────────────
async function registerInRegistry(name) {
  const registryPath = path.join(root, 'config', 'apps.ts');
  let src = await fs.readFile(registryPath, 'utf8');
  if (src.includes(`/apps/${name}/app.config`)) return;
  const importLine = `import ${camel(name)} from '../apps/${name}/app.config';`;
  const importRe = /^import .* from '\.\.\/apps\/.*\/app\.config';$/gm;
  let last;
  for (const m of src.matchAll(importRe)) last = m;
  if (last) src = src.slice(0, last.index + last[0].length) + '\n' + importLine + src.slice(last.index + last[0].length);
  src = src.replace(/(export const apps: AppDescriptor\[\] = \[)([^\]]*)\]/, (_, open, inner) => {
    const trimmed = inner.trim().replace(/,\s*$/, '');
    return `${open}${trimmed}, ${camel(name)}]`;
  });
  await fs.writeFile(registryPath, src);
}

async function addPackageScripts(name, kind) {
  const pkgPath = path.join(root, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
  pkg.scripts ??= {};
  pkg.scripts[`test:${name}`] = `SMOKE_ONLY=1 playwright test apps/${name}`;
  // BDD is UI-only; pure-API apps have no BDD project to run.
  if (kind !== 'api') pkg.scripts[`test:bdd:${name}`] = `node scripts/bdd.mjs ${name}`;
  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

// Writes apps/<name>/.env (gitignored, real values) and .env.example (committed,
// blank values). Keys are app-prefixed so they don't collide across apps in the
// shared Playwright process. lib/load-env.ts loads every apps/<name>/.env.
async function writeAppEnv(appDir, ENV, baseURL, username, password) {
  const real = [`${ENV}_BASE_URL=${baseURL}`];
  const example = [`${ENV}_BASE_URL=${baseURL}`];
  if (username !== undefined) {
    real.push(`${ENV}_USERNAME=${username}`, `${ENV}_PASSWORD=${password ?? ''}`);
    example.push(`${ENV}_USERNAME=`, `${ENV}_PASSWORD=`);
  }
  await fs.writeFile(path.join(appDir, '.env'), real.join('\n') + '\n');
  await fs.writeFile(path.join(appDir, '.env.example'), example.join('\n') + '\n');
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const nonInteractive = flags.yes || (!flags.interactive && !stdin.isTTY);

  let cfg;
  if (nonInteractive) {
    cfg = {
      name: flags.name,
      kind: flags.kind ?? 'both',
      url: flags.url ?? PLACEHOLDER_URL,
      username: flags.username,
      password: flags.password,
      swagger: flags.swagger,
    };
  } else {
    cfg = await gatherInteractive(flags);
  }

  const { name, kind, username, password, swagger } = cfg;
  let { url } = cfg;

  if (!name || !/^[a-z0-9-]+$/.test(name) || name === '_template') {
    console.error(`Error: invalid or missing app name "${name ?? ''}". Use lowercase letters, digits and hyphens.`);
    process.exit(1);
  }
  if (!['ui', 'api', 'both'].includes(kind)) {
    console.error(`Error: --kind must be ui, api or both (got "${kind}").`);
    process.exit(1);
  }
  const appDir = path.join(root, 'apps', name);
  if (await exists(appDir)) {
    console.error(`Error: apps/${name} already exists.`);
    process.exit(1);
  }

  // Fetch the swagger spec up front (so a bad URL fails before we create files).
  let api;
  if (kind !== 'ui' && swagger) {
    try {
      const spec = await loadSwagger(swagger);
      api = deriveApi(spec);
      api._spec = spec;
      if (api.origin && (url === PLACEHOLDER_URL || !url)) url = api.origin;
      else if (api.origin && url !== api.origin) {
        console.warn(`! note: spec origin ${api.origin} differs from base URL ${url}; API paths include basePath "${api.basePath}".`);
      }
    } catch (err) {
      console.warn(`! could not load swagger (${err.message}); falling back to a generic API health check.`);
    }
  }

  const ENV = envPrefix(name);
  const envVar = `${ENV}_BASE_URL`;

  // Scaffold structure from the template, then prune + replace example files.
  await copyDir(path.join(root, 'apps', '_template'), appDir);
  if (kind === 'ui') { await rmDir(path.join(appDir, 'som')); await rmDir(path.join(appDir, 'specs', 'api')); }
  else if (kind === 'api') { await rmDir(path.join(appDir, 'pom')); await rmDir(path.join(appDir, 'specs', 'e2e')); await rmDir(path.join(appDir, 'features')); }
  for (const f of ['pom/example.page.ts', 'som/example.api.ts', 'specs/e2e/example.spec.ts', 'specs/api/example.spec.ts', 'features/example.feature']) {
    await rmFile(path.join(appDir, f));
  }

  const title = pascal(name);
  const classes = [];

  // UI side
  if (kind !== 'api') {
    await fs.writeFile(path.join(appDir, 'pom', 'home.page.ts'), homePom());
    await fs.writeFile(path.join(appDir, 'specs', 'e2e', 'home.spec.ts'), homeSpec(title));
    await fs.writeFile(path.join(appDir, 'features', 'home.feature'), homeFeature(title));
    classes.push({ fixture: 'homePage', className: 'HomePage', importPath: '../pom/home.page', ctor: 'page' });

    if (username) {
      await fs.writeFile(path.join(appDir, 'pom', 'login.page.ts'), loginPom(`${ENV}_USERNAME`, `${ENV}_PASSWORD`));
      await fs.writeFile(path.join(appDir, 'specs', 'e2e', 'login.spec.ts'), loginSpec(title));
      await fs.writeFile(path.join(appDir, 'features', 'login.feature'), loginFeature(title));
      classes.push({ fixture: 'loginPage', className: 'LoginPage', importPath: '../pom/login.page', ctor: 'page' });
    }
  }

  // API side — spec-only (no feature files). SOMs keep their dual-style
  // decorators so they can back UI BDD steps when the app also has a UI.
  if (kind !== 'ui') {
    if (api) {
      await fs.writeFile(path.join(appDir, 'som', `${name}.api.ts`), swaggerSom(name, api, swagger));
      await fs.writeFile(path.join(appDir, 'specs', 'api', `${name}.spec.ts`), swaggerSpec(name, api));
      await fs.writeFile(path.join(appDir, 'openapi.json'), JSON.stringify(api._spec, null, 2) + '\n');
      classes.push({ fixture: `${camel(name)}Api`, className: `${pascal(name)}Api`, importPath: `../som/${name}.api`, ctor: 'request' });
    } else {
      await fs.writeFile(path.join(appDir, 'som', 'health.api.ts'), healthSom());
      await fs.writeFile(path.join(appDir, 'specs', 'api', 'health.spec.ts'), healthSpec(title));
      classes.push({ fixture: 'healthApi', className: 'HealthApi', importPath: '../som/health.api', ctor: 'request' });
    }
  }

  // Generated wiring + config + hooks.
  await fs.writeFile(path.join(appDir, 'app.config.ts'), buildAppConfig(name, envVar, url, kind));
  await fs.writeFile(path.join(appDir, 'specs', 'fixtures.ts'), buildFixtures('spec', classes));
  await fs.writeFile(path.join(appDir, 'steps', 'fixtures.ts'), buildFixtures('bdd', classes));
  await fs.writeFile(path.join(appDir, 'steps', 'hooks.ts'), hooks(name));

  await writeAppEnv(appDir, ENV, url, username, password);

  await registerInRegistry(name);
  await addPackageScripts(name, kind);

  console.log('');
  console.log(`✓ Created apps/${name} (kind: ${kind}, baseURL: ${url})`);
  console.log(`✓ Registered "${name}" in config/apps.ts`);
  console.log(`✓ Added npm scripts: test:${name}${kind === 'api' ? '' : `, test:bdd:${name}`}`);
  if (api) console.log(`✓ Swagger: ${api.ops.length} GET endpoint(s) -> som/${name}.api.ts (+ openapi.json)`);
  console.log(`✓ Wrote apps/${name}/.env (gitignored) + .env.example${username ? ' with credentials' : ''}`);
  console.log('');
  console.log('Next steps:');
  console.log(`  1. Edit apps/${name}/${kind === 'api' ? 'som/* and specs/api' : 'pom/* and specs/features'} for your app.`);
  if (username) console.log('  2. Fill in real login selectors, then remove .fixme / re-tag the login feature @smoke.');
  console.log(`  ${username ? 3 : 2}. Run it:  npm run test:${name}${kind === 'api' ? '' : `   (BDD: npm run test:bdd:${name})`}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
