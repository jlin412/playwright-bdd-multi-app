# /manual-api

Launch the **Manual Testing** phase in **API mode** — live recon with real HTTP calls to
the target.

Input: `artifacts/<feature>/plan.md` (planning must be `approved`).

1. Resolve `<feature>`.
2. Run the **qa-manual-design** skill in **API mode**. It runs qa-workflow (requires
   planning `approved`), expands the plan into detailed cases (endpoint, method, headers,
   request data, intended status/response), executes the safe, reachable ones live
   (including safe negatives like invalid auth / bad payloads), and writes
   `artifacts/<feature>/manual.md` + `execution.md` (+ `bugs.md` for `fail` cases).

Then review: `/review <feature>` → `/approve <feature>` before `/auto-plan-api`.
