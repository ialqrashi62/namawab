# P1A_STAGING_DB_AND_CLIENT_TOOLS — تقرير التجهيز

> المرحلة: `PROVISION_ISOLATED_STAGING_DB_AND_CLIENT_TOOLS`. التاريخ: 2026-06-20.
> الهدف: رفع حظر Gate 1 السابق بتجهيز قاعدة staging معزولة وأدوات العميل، بلا أي DDL/seed على الإنتاج.
> **لم يُنفَّذ:** أي DDL/seed محاسبي · أي تغيير بيانات · أي كتابة على عنقود الإنتاج · توصيل المحرك · نشر تطبيق.

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## ملخص تنفيذي
| البند | الحالة |
|---|---|
| أدوات العميل (psql/pg_dump/pg_restore) | ✅ **READY** — PostgreSQL 16.14 في `C:\Program Files\PostgreSQL\16\bin` |
| هوية الإنتاج (read-only) | ✅ مؤكَّدة: `nama_medical_web` @ localhost:5432، user `postgres` (superuser)، PG 16.14، NODE_ENV=production |
| تصدير schema-only من الإنتاج | ✅ تم (read-only) → خارج المستودع: `C:\Users\ice\nama_staging_artifacts\prod_schema_only.sql` |
| قاعدة staging معزولة | ⛔ **غير مُجهَّزة** — موقوفة (انظر BLOCKER) |
| القالب الآمن للبيئة | ✅ [docs/staging/.env.staging.example](staging/.env.staging.example) (بلا أسرار) |
| الحالة النهائية | `STAGING_DB_AND_CLIENT_TOOLS_BLOCKED` (أدوات جاهزة؛ القاعدة المعزولة تنتظر موافقة) |

---

## Gate 0 — المستودع: PASS
HEAD = `2194012` (سليل آمن)، متزامن 0/0، كل وثائق الحظر السابقة + ملفات candidate موجودة. backup: branch/tag `backup/before-p1a-staging-provision` عند 2194012.

## Gate 1 — اكتشاف الأدوات
| أداة | الحالة |
|---|---|
| psql / pg_dump / pg_restore / createdb / dropdb | ✅ PostgreSQL 16.14 (`C:\Program Files\PostgreSQL\16\bin`) — **Option B: عميل مثبّت موجود** |
| initdb / pg_ctl | ✅ متاحان (يتيحان عنقوداً منفصلاً) |
| node / npm / pg driver | ✅ node v24.14، npm 11.9، pg 8.18 |
| docker / docker-compose | ✅ مثبّتان لكن **الـ daemon متوقف** (لا حاوية الآن) |
| منفذ 5432 | ✅ خادم Postgres يستمع (= الإنتاج المحلي) |
**نتيجة:** جزء الأدوات من حظر Gate 1 السابق **مرفوع** — psql/pg_dump متاحان.

## Gate 2 — اكتشاف هدف staging
لا توجد ملفات/متغيّرات staging: `.env.staging`/`.env.local`/`.env.test` غير موجودة؛ لا `STAGING_DATABASE_URL`/`DATABASE_URL_STAGING`/`PGHOST_STAGING`. لا CI configs (فقط `docs/dev-tooling/docker-compose.dev.yml`). ⇒ **لا قاعدة staging قائمة**؛ يلزم إنشاؤها.

## Gate 3 — حارس هوية الإنتاج (READ-ONLY)
```
db=nama_medical_web  user=postgres  server_addr=::1  port=5432  version=PostgreSQL 16.14
role postgres: createdb=true  super=true
databases on cluster: nama_medical_web , postgres   (لا staging)
```

## Gate 4 — تصدير schema-only (READ-ONLY) — تم
- `pg_dump --schema-only --no-owner --no-privileges` من `nama_medical_web`.
- المخرج (خارج git، غير ملتزَم): `C:\Users\ice\nama_staging_artifacts\prod_schema_only.sql` (≈240KB، **148 جدولاً**، بلا أي صفوف بيانات).
- **اكتشاف مهم**: الإنتاج **يحتوي فعلاً** كل جداول `finance_*` الثمانية، و`finance_journal_lines.debit/credit` من نوع **`real`** في الإنتاج — ما يؤكّد أن فجوة نوع المال حقيقية في الإنتاج ويبرّر candidate DDL. (تصحيح لافتراض سابق بأن جداول الإنتاج قد لا تكون منشأة.)

## Gate 5/6 — إنشاء/استيراد staging والتحقق: BLOCKED
- **Docker daemon متوقف** ⇒ لا حاوية معزولة الآن.
- **إنشاء قاعدة على عنقود الإنتاج (createdb @ 5432) رُفض** بوّابياً (auto-mode) لأنه كتابة على بنية الإنتاج وتعارض مع حد Gate 3 (read-only فقط على الإنتاج) ومتطلّب العزل. لم أحاول الالتفاف.
- لم أُنشئ عنقوداً منفصلاً تلقائياً (initdb على 5433) لأنه إجراء بنية تحتية ثقيل يستحق موافقة صريحة بعد إشارة الرفض.

تفاصيل ومسارات الحل في [P1A_STAGING_DB_AND_CLIENT_TOOLS_BLOCKER_AR.md](P1A_STAGING_DB_AND_CLIENT_TOOLS_BLOCKER_AR.md).

## Gate 7 — خطة الاستئناف (بعد تجهيز staging)
بمجرّد توفّر قاعدة staging معزولة (`nama_medical_staging_rehearsal`) واستيراد schema:
```bash
PGBIN="/c/Program Files/PostgreSQL/16/bin"; export PGPASSWORD=<staging_pw>
# 1) DDL rehearsal
"$PGBIN/psql.exe" -h localhost -p 5433 -U postgres -d nama_medical_staging_rehearsal -v ON_ERROR_STOP=1 -f docs/accounting_candidates/accounting_ddl_candidate_up.sql
# 2) validate
"$PGBIN/psql.exe" ... -f docs/accounting_candidates/accounting_ddl_candidate_validate.sql
# 3) CoA seed
"$PGBIN/psql.exe" ... -f docs/accounting_candidates/medical_coa_seed_candidate.sql
# 4) mapping seed
"$PGBIN/psql.exe" ... -f docs/accounting_candidates/account_mapping_seed_candidate.sql
# 5) rollback rehearsal
"$PGBIN/psql.exe" ... -f docs/accounting_candidates/accounting_ddl_candidate_down.sql
# 6) app compatibility checks (against staging, بلا توصيل المحرك)
```
لا تُنفَّذ Gates 2–5 لمرحلة DDL السابقة إلا بتعليمة صريحة بالمتابعة بعد جاهزية staging.

## الحالة
```text
FINAL_STATUS: STAGING_DB_AND_CLIENT_TOOLS_BLOCKED
CLIENT_TOOLS: READY (psql/pg_dump/pg_restore 16.14)
PROD_IDENTITY_CONFIRMED: YES (nama_medical_web @5432, read-only)
SCHEMA_ONLY_EXPORT: DONE (148 tables, out-of-repo, no data rows)
ISOLATED_STAGING_DB: NOT_PROVISIONED (Docker down + prod-cluster write denied)
DDL_EXECUTED: NO | DATA_CHANGED: NO | PRODUCTION_DEPLOYED: NO | ENGINE_WIRED: NO | FORCE_PUSH: NO
NEXT_REQUIRED_ACTION: APPROVE_STAGING_PROVISIONING_METHOD (Docker | separate local cluster :5433 | createdb on local cluster)
```
