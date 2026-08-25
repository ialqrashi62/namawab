# WAVE GGLOBAL-F Closeout — vGlobal.0

## Deliverables
| Mode | File | Status |
|---|---|---|
| G-23 User Manual | `docs/UserManualGenerator.js` | ✅ |
| G-24 i18n | `i18n/translations.json` (4 locales) | ✅ |
| G-25 Seed Data | `seeds/sample_data.js` | ✅ |
| G-26 ERD | `docs/ERDGenerator.js` | ✅ |
| G-27 Budget Tracker | `billing/BudgetTracker.js` | ✅ |

## Smoke
```
PASS: 92 / 92
```
Added 5 tests for User Manual / i18n / Seed / ERD / Budget.

## Safety rails
- RAIL-12: Sample data uses fake names (no real PHI).
- RAIL-12: i18n translations never embed PHI.
- RAIL-11: Budget tracker throws on overrun.
