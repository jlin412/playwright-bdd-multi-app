# /manual-ui

Launch the **Manual Testing** phase in **UI mode** — live recon with the Playwright MCP
browser (`.vscode/mcp.json`).

Input: `artifacts/<feature>/plan.md` (planning must be `approved`).

1. Resolve `<feature>`.
2. Run the **qa-manual-design** skill in **UI mode**. It runs qa-workflow (requires
   planning `approved`), expands the plan into detailed cases, executes the safe,
   reachable ones live (including safe negatives), and writes `artifacts/<feature>/manual.md`
   + `execution.md` (+ `bugs.md` for `fail` cases, tagged `@triage`).

Then review: `/review <feature>` → `/approve <feature>` before `/auto-plan-ui`.
