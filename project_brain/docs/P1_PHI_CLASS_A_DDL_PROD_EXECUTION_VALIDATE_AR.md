# Gate 3 — تنفيذ DDL والتحقّق (PHI Class A Production Execution & Validate)

> المرحلة: `P1_PHI_CLASS_A_RESIDUAL_RLS_PRODUCTION_DDL_CONTROLLED_EXECUTION` | التاريخ: 2026-06-21 | الأداة: psql مع `ON_ERROR_STOP=1`.

## التنفيذ
```text
DDL_FILE_EXECUTED: docs/sql/phi_class_a_residual_rls_candidate_up.sql (الوحيد)
PSQL_OUTPUT: BEGIN / DO / DO / COMMIT
APPLY_EXIT: 0
EXECUTION_MODE: معاملة ذرّية (BEGIN…COMMIT)، DO blocks، idempotent
DROP/DELETE/UPDATE/BACKFILL: NONE
OTHER_TABLES_TOUCHED: NONE (الجداول الخمسة فقط)
```

## ما طُبِّق (additive)
- **المجموعة 1** (portal_users، audit_trail): `ENABLE ROW LEVEL SECURITY` + `FORCE ROW LEVEL SECURITY` + سياسة `rls_<t>_tenant_isolation` (USING/WITH CHECK على tenant_id). لا تغيير أعمدة، لا تغيير بيانات.
- **المجموعة 2** (packages، blood_bank_donors، blood_bank_units): `ADD COLUMN IF NOT EXISTS tenant_id INTEGER` + `facility_id INTEGER` + `CREATE INDEX IF NOT EXISTS idx_<t>_tenant` + ENABLE+FORCE+policy. الجداول كانت فارغة ⇒ لا صفوف يتيمة.

## التحقق — `phi_class_a_residual_rls_candidate_validate.sql`
```text
rls_forced_with_policy   : bad_rows=0   ✅ (الخمسة FORCE + سياسة)
tenant_id_present        : bad_rows=0   ✅ (الخمسة لديها tenant_id)
portal_users_null_tenant : bad_rows=0   ✅
audit_trail_null_tenant  : bad_rows=0   ✅
packages_null_tenant     : bad_rows=0   ✅
blood_bank_donors_null   : bad_rows=0   ✅
blood_bank_units_null    : bad_rows=0   ✅
VALIDATE_RESULT: PASS (7/7 checks = 0 bad_rows)
```

## حالة الجداول بعد DDL
| Table | rls_enabled | FORCE | policies | tenant_id | rows |
| --- | :--: | :--: | --: | :--: | --: |
| portal_users | true | true | 1 | true | 0 |
| audit_trail | true | true | 1 | true | 44 |
| packages | true | true | 1 | true | 0 |
| blood_bank_donors | true | true | 1 | true | 0 |
| blood_bank_units | true | true | 1 | true | 0 |

`PRODUCTION_EXECUTION_VALIDATE: PASS`
