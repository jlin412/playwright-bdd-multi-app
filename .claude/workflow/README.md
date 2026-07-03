# Workflow — the lifecycle definition

Defines the QA lifecycle the commands orchestrate and the skills execute. This layer is
**declarative**: it says *what the stages are, what they produce, and how they gate* —
it contains no QA expertise (that's Skills) and no coverage lists (that's Checklists).

- [pipeline.md](pipeline.md) — human narrative: the six lifecycle stages, the
  stage→skill→artifact map, and the **state-derivation rules**.
- [pipeline.yaml](pipeline.yaml) — machine-readable stage graph (keys, skills, commands,
  artifacts, `depends_on`, gates).

Workflow **state** is derived from the per-stage YAML sidecars in each
`artifacts/<feature>/` folder — see [pipeline.md](pipeline.md#workflow-state-derived-never-chat).
The `/status`, `/review`, `/approve`, `/revise`, and `/history` commands read and update
those artifacts; no state lives in chat.
