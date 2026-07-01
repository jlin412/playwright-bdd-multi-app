# Project State — <app>

<!--
  Maintained by the QA workflow commands via .claude/agents/workflow-agent.md.
  Update through the commands, not by hand (except Open Items / Blockers).
  Status values: not-started · in-progress · done · approved · stale
-->

- App: `<app>`
- Mode: ui | api
- Target: <URL / spec / story>
- Current stage: not-started
- Last updated: <date> by <command>

## Stages

| # | Stage | Command | Input | Output artifact | Status | Updated |
|---|---|---|---|---|---|---|
| 1 | Planning | /plan-ui or /plan-api | target | docs/qa/<app>/TestPlan.md | not-started | |
| 2 | Manual Design | /manual-ui or /manual-api | TestPlan.md | docs/qa/<app>/TestCases.md + TestExecution.md | not-started | |
| 3 | Automation Planning | /auto-plan-ui or /auto-plan-api | TestCases.md | docs/qa/<app>/AutomationPlan.md | not-started | |
| 4 | Automation | /auto-ui or /auto-api | AutomationPlan.md | apps/<app>/ + docs/qa/<app>/AutomationReport.md | not-started | |

## History

| Date | Command | Summary |
|---|---|---|

## Open Items / Blockers
