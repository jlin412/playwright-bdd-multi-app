---
name: qa-review
description: The shared interactive review protocol every v4 workflow command runs after generating its deliverable — open the file, present an Executive Summary and Review Checklist, ask review questions ONE at a time (each with recommendation, reasoning, expected impact), then loop on open feedback until the user has none. Used by /test-plan, /manual-qa, /auto-qa, /testops. Never advances to the next workflow stage.
---

# QA Review skill — the interactive review protocol

In v4 the command **owns the complete review experience**. There is no separate review
or approval command — running the *next* workflow command implicitly accepts this stage.
This skill is the single definition of Steps 2–6 that every workflow command runs after
its specialist agent generates the deliverable (Step 1).

Run this protocol **in the main conversation** — it is a dialogue with the user and must
never be delegated to a subagent.

## Step 2 — Open the deliverable

The user must never have to locate or open the file themselves:

- Open it in the editor: `code <absolute path to the deliverable>`.
- Also print a clickable markdown link to it in chat.

## Step 3 — Executive Summary

Present a short summary in chat — only the information a reviewer needs to judge the
work, not a restatement of the document. Typical content per stage: scenario counts,
top risks, coverage, files changed, tests generated, execution results. Mirror the same
summary into the deliverable's **Executive Summary** section.

## Step 4 — Review Checklist

Evaluate the deliverable against the stage's checklist in `.claude/checklists/`
(`review-test-plan.md` · `review-manual-qa.md` · `review-auto-qa.md` ·
`review-testops.md`) and display the result in chat, one line per item:

```
✓ Scope reviewed
✓ Coverage complete
✗ Risks identified — rate limiting not yet assessed
```

An `✗` is not a blocker — it is either fixed immediately or becomes a review question in
Step 5. Mirror the final state into the deliverable's **Review Checklist** section.

## Step 5 — Interactive review (one question at a time)

Select **3–7 questions** from the genuine judgment calls made while producing the
deliverable — risk ratings, scope boundaries, prioritization, cases not automated,
flake verdicts, checklist `✗` items. Do not pad with filler questions; if only two real
decisions need the user, ask two.

Ask **one question per turn** and wait for the answer. Every question includes a
recommendation, the reasoning, and the expected impact:

```
**Question 2 of 5 — Rate limiting risk**

I recommend treating rate limiting as High Risk because authentication endpoints are
security-sensitive and the plan currently has no abuse-case coverage.

Impact: adds 2 negative scenarios to the inventory and one risk row.

Do you agree?
```

The user responds naturally (agree, disagree, redirect, partial). Apply their decision
to the deliverable **immediately** — edit the file before asking the next question — and
record it in **Review History**. If they disagree, their direction wins; record what
changed and why.

## Step 6 — Feedback loop

After the last question, ask:

> Do you have any additional feedback?

Apply each piece of feedback to the deliverable (and, where it targets repository files
such as Gherkin or code, to those files) immediately, record it in **Review History**,
then ask again:

> Any additional feedback?

Repeat until the user says there is none. Then **stop**.

Do **not** continue to the next workflow stage, suggest running it for the user, or
start its work. Name the next command once ("when you're ready: `/auto-qa <feature>`")
and end the turn.

## Review History (audit trail)

Every deliverable ends with a **Review History** section — the audit trail that replaces
v3's approval metadata. Append one row per question and per piece of feedback:

| Date | Type | Question / Feedback | Decision / Resolution |
|---|---|---|---|

`Type`: `question` (Step 5) or `feedback` (Step 6). Keep rows one line each — this is a
ledger, not a transcript. Re-running a stage command appends to the existing history,
never erases it.
