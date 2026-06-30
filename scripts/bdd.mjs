#!/usr/bin/env node
// Flexible BDD runner: scope a run by app, by feature file, and/or by a tag
// expression (full cucumber tag expressions — "and", "or", "not", parens).
//
// Usage:
//   node scripts/bdd.mjs [app] [--feature <name>] [--tags "<expr>"] [-- <playwright args>]
//
// Examples:
//   node scripts/bdd.mjs petstore
//   node scripts/bdd.mjs petstore --feature pet
//   node scripts/bdd.mjs petstore --tags "@smoke and @api"
//   node scripts/bdd.mjs petstore --feature pet --tags "@api or @smoke"
//   node scripts/bdd.mjs --tags "@ui and not @regression"        # all apps
//   node scripts/bdd.mjs saucedemo --feature checkout --headed     # extra args pass through
//
// Tag generation rules (what bddgen compiles):
//   --tags given        -> that expression
//   --feature, no --tags-> "not @tracefail"            (so any feature is available)
//   neither             -> "@smoke and not @tracefail" (the default smoke set)
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = 'playwright.bdd.config.ts';

function parse(argv) {
  const out = { app: undefined, feature: undefined, tags: undefined, passthrough: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--feature' || a === '-f') out.feature = argv[++i];
    else if (a === '--tags' || a === '-t') out.tags = argv[++i];
    else if (a === '--app') out.app = argv[++i];
    else if (a.startsWith('--feature=')) out.feature = a.slice('--feature='.length);
    else if (a.startsWith('--tags=')) out.tags = a.slice('--tags='.length);
    else if (a.startsWith('--app=')) out.app = a.slice('--app='.length);
    else if (!a.startsWith('-') && out.app === undefined) out.app = a;
    else out.passthrough.push(a);
  }
  return out;
}

function run(cmd, args) {
  console.log(`$ ${cmd} ${args.map((a) => (a.includes(' ') ? `"${a}"` : a)).join(' ')}`);
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: false, cwd: root });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const { app, feature, tags, passthrough } = parse(process.argv.slice(2));

const genTags = tags ?? (feature ? 'not @tracefail' : '@smoke and not @tracefail');

const featureName = feature ? feature.replace(/\.feature$/, '') : undefined;
const filters = [];
if (app && featureName) filters.push(`apps/${app}/features/${featureName}`);
else if (app) filters.push(`apps/${app}`);
else if (featureName) filters.push(`features/${featureName}`);

run('npx', ['bddgen', '-c', CONFIG, '--tags', genTags]);
run('npx', ['playwright', 'test', '-c', CONFIG, ...filters, ...passthrough]);
