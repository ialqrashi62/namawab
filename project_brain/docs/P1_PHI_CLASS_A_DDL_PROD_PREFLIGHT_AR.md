# Gate 0 — Master Preflight (PHI Class A Production DDL)

> المرحلة: `P1_PHI_CLASS_A_RESIDUAL_RLS_PRODUCTION_DDL_CONTROLLED_EXECUTION` | تفويض: `APPROVE_PHI_CLASS_A_DDL` | التاريخ: 2026-06-21 | read-only.

## النتيجة
```text
LOCAL_EQUALS_ORIGIN: YES (parent 780ff88 == origin/master 780ff88 ; ahead/behind = 0/0)
PARENT_HEAD: 780ff88 (≥ 780ff88) ✅
namaweb_HEAD: 082c07b ✅ (لا نشر runtime هذه المرحلة)
PM2_STATUS: online (restarts=1 مستقر)
HEALTH: 200 (/api/health=200 ، /=200)
DB_ROLE_CURRENT: postgres
RLS_RUNTIME_ENFORCEMENT: NOT_YET (postgres superuser يتجاوز الـ115 + الجديدة)
ACCOUNTING_POSTING_ENABLED: OFF (الراية غائبة عن .env)
JOURNAL_COUNT: 0
NO_ENV_TRACKED: YES (.env غير متعقّب في Git)
NO_SECRETS: YES
NO_FORCE_PUSH: YES
OUT_OF_SCOPE_FILES: Stitch/UI فقط (لن تُلمس)
```

## تحقق المرشّحات (قراءة الملفات قبل التنفيذ)
- `phi_class_a_residual_rls_candidate_up.sql`: BEGIN/COMMIT، **idempotent + additive**. المجموعة 1 (portal_users/audit_trail): ENABLE+FORCE+policy محميّة بـ NOT EXISTS. المجموعة 2 (packages/blood_bank_donors/blood_bank_units): `ADD COLUMN IF NOT EXISTS tenant_id/facility_id` + `CREATE INDEX IF NOT EXISTS` + ENABLE+FORCE+policy. **لا DROP/DELETE/UPDATE/backfill**. الجداول الخمسة فقط.
- `..._validate.sql`: read-only — يتحقق (1) الخمسة FORCE+policy، (2) tenant_id موجود، (3) **لا صفوف tenant_id=NULL** (يكشف خطر إخفاء البيانات بعد التحويل).
- `..._down.sql`: rollback آمن idempotent (drop policy + NO FORCE + DISABLE + drop المجموعة-2 columns/index).

`MASTER_PREFLIGHT: PASS — PROCEED_TO_BACKUP`
