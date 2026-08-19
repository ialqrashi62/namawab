# TIER4_FAMILY 6 Modules Shipped — 2026-08-15

## Summary
**TIER4_FAMILY-101..106** (Family Medicine: 6 modules) deployed to jumanasoft.com with **12/12 smoke tests passing 200 on first try**.

## Modules Shipped
| # | Module | Endpoints |
|---|---|---|
| 101 | Health Behavior | `fammi/mi`, `fammi/changestage` |
| 102 | Well Visit | `famwell/adult`, `famwell/dev` |
| 103 | Health Literacy | `famlit/screen`, `famlit/comm` |
| 104 | Smoking | `famsmoke/fiveAs`, `famsmoke/plan` |
| 105 | Grief | `famgrief/stage`, `famgrief/support` |
| 106 | Travel | `famtravel/consult`, `famtravel/vaccines` |

## Files Created (19 total)
- 12 JS (6 engines + 6 routers)
- 6 migrations (e525-e530)
- 1 server.js (6 mounts added)

## Commits
- Inner (namaweb): `0ac0d88f`
- Outer (NMEDCALVSCODE): `9437c31b`

## Key Learning
- Bash smoke script (file piped via SSH) works on Windows PowerShell 5.1
- `--data-binary @file` does NOT work; need `--data-raw` or just bash+curl
- Pattern: write smoke.sh to disk → scp → bash it
- Smoke via `x-tenant-id: tenant_test_001` header (lowercase) works

## Cumulative After This Wave
156 Tier-4 + 155 Tier-3 = **311 routers** live