# /plan-api

Launch the **Planning** phase in **API mode**.

Input `$ARGUMENTS`: a Swagger/OpenAPI URL, `openapi.json`, `swagger.yaml`, backend
routes/controllers, or API requirements (plus any supplied context).

1. Resolve `<feature>` (an `apps/<name>/` folder name, or a slug for a new target).
2. Run the **qa-planning** skill in **API mode**. It runs the qa-workflow START/FINISH
   protocol, reads the API checklists (`core-api`, `security`, `performance`), and writes
   `artifacts/<feature>/plan.md` + `plan.yaml`. Design from the spec — do not call the
   live API (execution happens in `/manual-api`).

Then review: `/review <feature>` → `/approve <feature>` before `/manual-api`.
