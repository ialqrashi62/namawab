# البنود المنجزة (COMPLETED / COMPLETED_DOCS_ONLY)

> سجلّ ما اكتمل فعلاً (منشور أو موثّق)، مع الدليل.

## منشور ومُتحقَّق (COMPLETED — production)
| البند | الدليل | الـcommit |
|---|---|---|
| A1 EMR Lock/Signature (backend+UI) | sign/amend/badge؛ harness 13/13 | namaweb 4fb13ae + parent |
| A2 MFA opt-in (+تصليب أمان) | harness 22، static 19/19؛ brute-force/replay/session-fixation/step-up | namaweb 15e6dfa |
| A3A PHI File Guard | harness 18/18؛ vault خارج webroot + مسار محمي | namaweb 56bd2ee |
| A3B upload freeze | مرفوع للرفع المحمي فقط | — |
| A3 at-rest encryption (DPAPI) | harness 17/17؛ mfa_secret + ملفات PHI ciphertext | namaweb f9819b6 |
| backup غير مراقب | pg_dump مجدول عبر pgpass؛ pg_restore صالح | — |
| audit hardening | FAILED_LOGIN/LOGOUT/MFA مُدقّقة (audit=163) | namaweb a0b2d1c |
| E2E accounts cleanup | 4 معطّلة، 401؛ تدقيق محفوظ؛ creds حُذف | parent 1ce05f0 |
| restore drill (معزول) | 167 جدول، 150 FORCE_RLS، DB drill حُذفت | (هذه/سابق الموجات) |
| RLS enforcement | 150 FORCE policies، app=nama_medical_app | — |
| D0 secrets/key model | Option E هجين معتمد، DPAPI منفّذ | parent 27a5b90 |

## موثّق (COMPLETED_DOCS_ONLY)
restore readiness · incident response runbook · security ops runbook · key rotation runbook · RLS drift (FORCE=150 ثابت) · clinical audit completeness · i18n (2243 tr()) · operator runbooks · Redis/PM2 watchdog review · HA/DR · prompt-logging policy · model-data-boundary policy · release lock · operation handover · support runbook · risk register · owner decision menu.

## الثوابت الإجمالية
```text
FORCE_RLS: 150 | ACCOUNTING_POSTING_ENABLED: OFF | JOURNAL: 0
HEALTH: local 200, domain 200 | Redis: PONG | R17: UNTOUCHED (b4270c7 preserved)
```
