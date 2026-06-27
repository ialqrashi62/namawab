# P1_DDL_AND_COA_SEED — تقرير حظر (BLOCKER)

> أُنشئ وفق القاعدة 10 (أي بوابة فاشلة توقف المرحلة وتُنشئ تقرير حظر). التاريخ: 2026-06-20.

## الحظر
**Gate 1 — جاهزية قاعدة Staging: لا توجد قاعدة staging آمنة قابلة للاستخدام.**

## الأدلة
| البند | الحالة |
|---|---|
| `psql` | غير متاح (NO_PSQL) |
| `pg_dump` | غير متاح (NO_PG_DUMP) |
| متغيّرات بيئة staging (DATABASE_URL/STAGING/PG*) | غير موجودة |
| الهدف الوحيد المتاح (`namaweb/.env`) | `DB_HOST=localhost` + **`NODE_ENV=production`** |
| قاعدة staging مؤكَّدة العزل عن الإنتاج | **غير موجودة** |

## لماذا توقفنا (بدل التنفيذ)
- تطبيق DDL على هدف موسوم `production` أو غير مؤكَّد العزل ينتهك القواعد 2 (لا DDL إنتاج قبل نجاح staging)، و8 (لا تغييرات هدّامة)، و9 (لا تعديل غير آمن في الإنتاج).
- لا تتوفّر أدوات `psql/pg_dump` لأخذ backup أو تنفيذ آمن حتى لو وُجد هدف.
- المبدأ المهني (Production Release Commander): **لا تنفيذ DDL على إنتاج بلا بروفة staging ناجحة وموافقة صريحة.**

## ما لم يتأثّر (سلامة)
لا DDL، لا Seed، لا تغيير بيانات، لا اتصال بإنتاج، لا نشر، لا توصيل محرك، لا force push، لا لمس `.gitmodules`/`df893ab`/RLS/entitlement.

## شروط رفع الحظر (Unblock Requirements)
1. توفير قاعدة **PostgreSQL staging** مُجهَّزة ومؤكَّد أنها **ليست الإنتاج** ومعزولة (DSN مستقل، NODE_ENV ≠ production).
2. تثبيت أدوات العميل `psql` و`pg_dump` (أو اعتماد سكربت node عبر `pg` لتنفيذ الملفات بأمان).
3. نسخة **schema-only** من الإنتاج (pg_dump -s) لإعادة إنتاج الحالة بدقة في staging.
4. تشغيل البروفة (Gates 2–5) وإثبات: NUMERIC، FK، UNIQUE/idempotency، فهارس، عزل المستأجر، رفض الترحيل المزدوج، وrollback.
5. ثم — بموافقة صريحة — تنفيذ الإنتاج عبر [P1_DDL_AND_COA_SEED_PRODUCTION_RUNBOOK_AR.md](P1_DDL_AND_COA_SEED_PRODUCTION_RUNBOOK_AR.md).

## الحالة
```text
FINAL_STATUS: DDL_AND_COA_SEED_BLOCKED
BLOCKING_GATE: GATE_1_STAGING_DB_READINESS
GATE0: PASS (git + candidates + static review + backup)
DDL_EXECUTED: NO
DATA_CHANGED: NO
PRODUCTION_DEPLOYED: NO
ENGINE_WIRED_TO_INVOICES: NO
NEXT_REQUIRED_ACTION: PROVISION_ISOLATED_STAGING_DB_AND_CLIENT_TOOLS
```
