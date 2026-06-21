# Gate 2 — Production Pre-Validate (PHI Class A DDL)

> المرحلة: `P1_PHI_CLASS_A_RESIDUAL_RLS_PRODUCTION_DDL_CONTROLLED_EXECUTION` | التاريخ: 2026-06-21 | read-only.

## حالة الجداول الخمسة قبل DDL

| Table | Exists | tenant_id Exists | Row Count | RLS Enabled | FORCE RLS | Policies | Expected Action |
| --- | :--: | :--: | --: | :--: | :--: | --: | --- |
| portal_users | YES | YES | 0 | false | false | 0 | ENABLE+FORCE+policy |
| audit_trail | YES | YES | 44 | false | false | 0 | ENABLE+FORCE+policy |
| packages | YES | **NO** | **0** | false | false | 0 | ADD tenant_id+facility_id+index, ENABLE+FORCE+policy |
| blood_bank_donors | YES | **NO** | **0** | false | false | 0 | ADD tenant_id+facility_id+index, ENABLE+FORCE+policy |
| blood_bank_units | YES | **NO** | **0** | false | false | 0 | ADD tenant_id+facility_id+index, ENABLE+FORCE+policy |

## فحوص الأمان الحرجة
```text
group2_tables_without_tenant_id_are_empty: YES (packages=0, blood_bank_donors=0, blood_bank_units=0)
  => إضافة tenant_id additive بلا صفوف يتيمة، ولا backfill، ولا تغيير بيانات.
audit_trail_null_tenant: 0 (الـ44 صفاً كلها tenant_id غير NULL => لن تُخفى بعد التحويل، validate #3 سيمر)
portal_users_null_tenant: 0
all_five_tables_exist: YES
no_table_already_force_rls: YES (التطبيق idempotent على أي حال)
```

## القرار
```text
PREVALIDATE_DECISION: SAFE_TO_APPLY
```
لا يوجد أي جدول بلا `tenant_id` يحوي صفوفاً ⇒ شرط التوقف غير مُفعَّل ⇒ يُسمح بتنفيذ `up.sql`.

`PRODUCTION_PREVALIDATE: PASS`
