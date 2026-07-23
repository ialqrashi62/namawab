# nm-ai-brain-index-manager

## Description
Maintain the master index of all `.ai-brain` department documentation. Use this skill when asked to create, update, or verify `.ai-brain/INDEX.md`.

## When to use
- After generating department files.
- When user asks for "index", "fihris", "map of .ai-brain", or "cross-reference all departments".

## Output format
`INDEX.md` must contain:
1. Header with project name, date, and status.
2. Table of major groups (Surgical, Internal Medicine, OBGYN/Peds, Diagnostics, Critical Care, Rehabilitation, Integrative Medicine, Support Services, Admin/Academic, Oncology Therapeutics, Rare Specialties).
3. For each group: sub-departments, files present (`brain.md`, `01-06`), and status (`complete`, `partial`, `missing`).
4. Cross-links to canonical reference docs at root level.
5. Last-updated timestamp.

## Rules
- Do not duplicate file contents; only list paths and brief descriptions.
- Use workspace-relative paths for links.
- Keep the index in Arabic with English path names.
