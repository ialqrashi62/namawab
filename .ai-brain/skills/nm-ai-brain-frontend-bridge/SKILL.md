# nm-ai-brain-frontend-bridge

## Description
Bridge `.ai-brain` department specs to actual `namaweb/public/js/*-station.js` implementation. Use this skill when the user wants to turn brain docs into working frontend modules.

## When to use
- User says "build the station for X", "create station.js", or "implement the UI".

## Inputs
- Department `brain.md` and `04_ux_ui_stitch.md`.
- Existing station pattern (e.g. `cardiology-station.js`).
- `app.js` integration point (NAV_ITEMS index, render function, tab routing).

## Output
- A new `namaweb/public/js/<department>-station.js` module.
- Notes on required `app.js` changes.
- Notes on required backend routes/schemas.

## Rules
- Follow existing station pattern: export `render<Department>Station(container, patientId)`.
- Use Stitch design tokens from `hospital-ui-blueprint-ar.md`.
- Never use `innerHTML = raw`; use `escapeHTML` / `SafeHtml`.
- Do not modify `app.js` unless explicitly asked.
