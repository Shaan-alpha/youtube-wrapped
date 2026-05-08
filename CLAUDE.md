# CLAUDE.md — instructions for AI assistants in this repo

## Read these before doing anything

1. **`CONTEXT.md`** — stable project context (architecture, stack, decisions). Always relevant.
2. **`WORKLOG.md`** — rolling log of recent work. Read **the two most recent entries** to know where things stand.

If either file disagrees with the code you see, trust the code and propose updating the file.

## After doing meaningful work

Append a **new entry at the top** of `WORKLOG.md`. Don't edit older entries. Use this template:

```markdown
## YYYY-MM-DD — short title

### Done
- bullet points, link commits/PRs instead of explaining diffs

### Next
- ordered list of next steps

### Open questions / blockers
- only what actually needs a decision

### Commits / PRs
- short refs

---
```

Keep entries terse — `WORKLOG.md` is a handoff log, not a diary.

## Cross-tool handoff (Claude Code ↔ claude.ai)

This repo is designed to be worked on from both Claude Code (CLI/IDE) and claude.ai. There is no shared session memory — `WORKLOG.md` is the bridge. When the user switches tools mid-task, they bring the worklog along (via the GitHub connector on claude.ai, or by pasting the file).

If the user asks "where did we leave off?" or "what did we decide about X?", read `WORKLOG.md` first, then answer.

## Project-specific rules

- **Frontend uses Next.js 16.** Do not assume App Router conventions from older versions; check `frontend/AGENTS.md` and the installed Next docs before writing code.
- **API queries must use bind params** (`text("... :limit")`). No f-string interpolation into SQL.
- **Personal data stays out of git.** `*.json`, `*.csv`, `*.parquet`, `Takeout/`, `data/` are gitignored — confirm before adding any data file.
- **Do not commit anything unless the user explicitly asks.**
