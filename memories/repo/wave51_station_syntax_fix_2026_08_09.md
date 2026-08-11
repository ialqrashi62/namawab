# Wave 51 — Station Syntax Fix + Power Recovery

**Date:** 2026-08-09
**Trigger:** Power blip during session + 50 station files had JS syntax errors due to `{{code_short_pascal}}` placeholder leak from PowerShell heredoc expansion.

## Root Cause

1. STATION_TEMPLATE in `nm-station-generator.py` contained `{{code_short_pascal}}` for JS placeholder
2. Python f-string/format() couldn't substitute it correctly because the file had multi-level nested braces from JS code (`{{key: 'val'}}`)
3. PowerShell heredoc with backticks corrupted the content into `{{`/`}}` artifacts
4. Generator was using `.format()` which choked on `{{...}}` for JS object literals (treating them as literal `{...}` but leaving the doubled braces as-is)

## Fix Chain (Loop Engineering)

| Script | Strategy | Result |
|---|---|---|
| v3 | Regex non-greedy | Failed on nested braces |
| v4 | Iterative collapse | Failed on quote chars |
| v5 | Manual balanced-brace walk | Succeeded on most cases |
| v6 | Final `{PascalCase}Station` regex | **All 60 stations valid** |

## Final Counts

- Engines: 102 ✅
- Stations: 60 ✅ (was 30/60 valid before)
- Routers: 63 ✅
- Tests: 325 ✅
- Migrations: 513 ✅
- Blueprints: 122 ✅
- Grafana dashboards: 4 ✅ (new)
- ERD diagrams: 2 ✅ (new)
- HIPAA doc: 1 ✅ (new)

## Lessons Learned

1. **PowerShell + Python .format() = bad combination** for embedded code templates
2. **Use string concat** in Python generators with embedded code (not .format())
3. **Use UTF-8 wrappers** for Windows stdout (emojis, Arabic)
4. **Always run `node --check`** after generation
5. **Save state to /memories/** every wave for power-recovery resilience
6. **Loop Engineering cap at 4** worked: 4 fix-script iterations to resolution
