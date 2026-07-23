# nm-ai-brain-station-matcher

## Description
Match `.ai-brain` department specs with existing `namaweb/public/js/*-station.js` modules and identify gaps where a station exists but no brain docs, or brain docs exist but no station.

## When to use
- User asks "what is missing in the app?", "which departments have stations?", or before building new station.js files.

## Inputs
- List of `*-station.js` files in `namaweb/public/js/`.
- List of `.ai-brain/<group>/<department>/brain.md` files.
- `NAV_ITEMS` and `FACILITY_ALLOWED` from `namaweb/public/js/app.js`.

## Output format
A markdown table:
| Department | brain.md | station.js | app.js route | Status |
|------------|----------|------------|--------------|--------|
| Cardiology | ✅ | ✅ | ✅ | Complete |
| Neurosurgery | ✅ | ❌ | ✅ | Needs station.js |
| ... | ... | ... | ... | ... |

## Rules
- Do not modify files; only report.
- Use workspace-relative paths.
- Mark status as: Complete, Needs station.js, Needs brain docs, Needs both, or Hidden route only.
