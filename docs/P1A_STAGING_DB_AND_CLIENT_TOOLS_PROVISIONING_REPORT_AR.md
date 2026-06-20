# P1A_STAGING_DB_AND_CLIENT_TOOLS — تقرير التجهيز

> المرحلة: `PROVISION_ISOLATED_STAGING_DB_AND_CLIENT_TOOLS`. التاريخ: 2026-06-20.
> **النتيجة: `STAGING_DB_AND_CLIENT_TOOLS_READY` — حظر Gate 1 السابق مرفوع.**
> **لم يُنفَّذ:** أي DDL/seed محاسبي · أي تغيير بيانات إنتاج · أي كتابة على عنقود الإنتاج · توصيل المحرك · نشر تطبيق · نسخ صفوف بيانات إلى staging (schema-only فقط).

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
| أدوات العميل (psql/pg_dump/pg_restore/initdb/pg_ctl) | ✅ PostgreSQL 16.14 (`C:\Program Files\PostgreSQL\16\bin`) |
| هوية الإنتاج (read-only) | ✅ `nama_medical_web` @localhost:5432، postgres (superuser)، PG 16.14، NODE_ENV=production |
| تصدير schema-only (read-only) | ✅ `C:\Users\ice\nama_staging_artifacts\prod_schema_only.sql` (148 جدولاً، بلا بيانات، خارج git) |
| **قاعدة staging معزولة** | ✅ **مُجهَّزة** — عنقود منفصل عبر initdb على المنفذ **5433** |
| التحقق من الجاهزية (Gate 6) | ✅ كل الفحوص ناجحة |
| القالب الآمن للبيئة | ✅ [docs/staging/.env.staging.example](staging/.env.staging.example) (بلا أسرار) |
| الحالة النهائية | **`STAGING_DB_AND_CLIENT_TOOLS_READY`** |

---

## Gate 0 — المستودع: PASS
HEAD سليل آمن لـ `2194012`، متزامن مع origin، كل الوثائق/الملفات المرشّحة موجودة. backup: `backup/before-p1a-staging-provision`.

## Gate 1 — الأدوات: PASS
psql/pg_dump/pg_restore/createdb/initdb/pg_ctl (PostgreSQL 16.14) — **Option B (عميل مثبّت موجود)**. node v24 + pg 8.18. Docker مثبّت لكن daemon متوقف (لذا اعتُمد العنقود المنفصل بدل الحاوية).

## Gate 2 — اكتشاف هدف staging
لا قاعدة/متغيّرات staging قائمة ⇒ أُنشئت جديدة.

## Gate 3 — حارس هوية الإنتاج (READ-ONLY)
`nama_medical_web` @5432، postgres superuser، PG 16.14. القواعد على العنقود: `nama_medical_web`, `postgres` فقط.

## Gate 4 — schema-only export (READ-ONLY): DONE
`pg_dump --schema-only --no-owner --no-privileges` ⇒ 148 جدولاً، بلا صفوف بيانات، خارج المستودع.
**اكتشاف:** الإنتاج يحوي فعلاً كل جداول `finance_*` الثمانية و`finance_journal_lines.debit/credit` من نوع **`real`** — يؤكّد فجوة نوع المال في الإنتاج.

## Gate 5 (Option B المعتمد من المستخدم) — إنشاء عنقود staging معزول: DONE
- `initdb -D C:/Users/ice/nama_pg_staging_data -U postgres --auth=trust --encoding=UTF8` ⇒ عنقود جديد.
- `pg_ctl ... -o "-p 5433" -w start` ⇒ خادم يستمع على **127.0.0.1:5433 و ::1:5433** (PID مستقل، مجلد بيانات مستقل، منفصل تماماً عن إنتاج 5432).
- `createdb nama_medical_staging_rehearsal` على 5433.
- استيراد `prod_schema_only.sql` ⇒ **148 جدولاً، 8 جداول finance**، بلا أخطاء.

## Gate 6 — التحقق من جاهزية staging: PASS
| فحص | نتيجة |
|---|---|
| الهوية | `db=nama_medical_staging_rehearsal port=5433` (ليست الإنتاج) |
| المخطط الأساسي موجود | 148 جدولاً |
| حالة هدف candidate (غائبة، جاهزة للبروفة) | `debit=real` · لا `uq_coa_tenant_code` · لا `uq_journal_idempotency` · لا `source_type` · لا `coa.tenant_id` · لا `fk_jl_account` (الكل = 0) |
| المعاملات + التراجع | `tx_rollback_ok=true` |
| لا بيانات إنتاج في staging | finance_chart_of_accounts/journal_entries/journal_lines = 0 صف (schema-only) |

## إدارة عنقود staging (تشغيل/إيقاف)
```bash
PGBIN="/c/Program Files/PostgreSQL/16/bin"; export MSYS2_ARG_CONV_EXCL="*"
# تشغيل:
"$PGBIN/pg_ctl.exe" -D "C:/Users/ice/nama_pg_staging_data" -o "-p 5433" -l "C:/Users/ice/nama_pg_staging.log" -w start
# إيقاف لطيف:
"$PGBIN/pg_ctl.exe" -D "C:/Users/ice/nama_pg_staging_data" stop -m fast
# اتصال:
"$PGBIN/psql.exe" -h 127.0.0.1 -p 5433 -U postgres -d nama_medical_staging_rehearsal
```
ملاحظة: العنقود وملف schema الخام خارج المستودع (غير ملتزَمين). أداة الاتصال للملفات تستخدم مسارات Windows (`C:/...`) مع `MSYS2_ARG_CONV_EXCL="*"`.

## Gate 7 — خطة الاستئناف (بروفة DDL — لا تُنفَّذ إلا بتعليمة صريحة)
```bash
PGBIN="/c/Program Files/PostgreSQL/16/bin"; export MSYS2_ARG_CONV_EXCL="*"
P(){ "$PGBIN/psql.exe" -h 127.0.0.1 -p 5433 -U postgres -d nama_medical_staging_rehearsal -v ON_ERROR_STOP=1 -f "$1"; }
P "C:/Users/.../docs/accounting_candidates/accounting_ddl_candidate_validate.sql"   # preflight
P "C:/Users/.../docs/accounting_candidates/accounting_ddl_candidate_up.sql"          # DDL
P "C:/Users/.../docs/accounting_candidates/medical_coa_seed_candidate.sql"           # CoA
P "C:/Users/.../docs/accounting_candidates/account_mapping_seed_candidate.sql"       # mapping
# ثم: validate ثانية، اختبارات المحرك (node accounting_posting_test.js)، حالات ترحيل وهمية، rollback rehearsal.
```

## الحالة
```text
FINAL_STATUS: STAGING_DB_AND_CLIENT_TOOLS_READY
CLIENT_TOOLS: READY (PostgreSQL 16.14)
PROD_IDENTITY_CONFIRMED: YES (read-only)
SCHEMA_ONLY_EXPORT: DONE (148 tables, no data, out-of-repo)
ISOLATED_STAGING_DB: PROVISIONED (separate cluster, nama_medical_staging_rehearsal @127.0.0.1:5433)
STAGING_NOT_PRODUCTION: CONFIRMED
DDL_EXECUTED: NO | DATA_CHANGED: NO | PROD_DATA_COPIED: NO | PRODUCTION_DEPLOYED: NO | ENGINE_WIRED: NO | FORCE_PUSH: NO
PREVIOUS_BLOCKER (GATE_1_STAGING_DB_READINESS): REMOVED
NEXT_REQUIRED_ACTION: RESUME_DDL_AND_COA_SEED_STAGING_REHEARSAL (Gates 2-5 of the DDL phase) — awaiting explicit go
```
