# F-10 Closeout — Production Migrator

## Deliverables
| Mode | File |
|---|---|
| F-10.1 | `namaweb/scripts/migrate_prod.js` (shadow → swap → drop) |
| F-10.2 | `namaweb/scripts/migrate_check.js` (pre-flight) |
| F-10.3 | `namaweb/scripts/migrate_resume.js` (checkpoint resume) |
| F-10.4 | `namaweb/lib/MigrationJournal.js` (JSONL audit) |
| F-10.5 | smoke test: shadow → swap → checkpoint resume preserves done set |

## Smoke
```
PASS: 48 / 48
```

## Safety rails
- RAIL-4: every step is journaled; no DROP without prior shadow.
- RAIL-10: MigrationJournal is append-only JSONL.
- RAIL-11: fail-closed on missing checkpoint / missing step file.
