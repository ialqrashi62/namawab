# P1 — أساس إصلاح Refund IDOR (Baseline)

> المرحلة: `P1_REFUND_IDOR_TENANT_GUARD_CODE_FIX` — البوابة 0 | التاريخ: 2026-06-21 | **code-only**، read-only للأساس.

## ACTIVE_SKILLS
```text
ACTIVE_SKILLS:
- MEDICAL_AUTOPILOT_CORE_SKILL_AR
- MEDICAL_SECURITY_PRIVACY_AUDIT_SKILL_AR
- MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR
- MEDICAL_API_AUDIT_SKILL_AR
- MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR
- MEDICAL_TEST_SCENARIOS_SKILL_AR
- MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR
- MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
- MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR
```

## الأساس (read-only)
| البند | القيمة | الحالة |
| ----- | ------ | ------ |
| المسار | `C:\Users\ice\Desktop\NamaMedical` | ✅ |
| parent HEAD/origin | `6257693` = `6257693` | ✅ متزامن |
| namaweb | detached `ef1acf9` = origin/master | ✅ متزامن (remote: namawab.git) |
| `ACCOUNTING_POSTING_ENABLED` | غائب من `.env` ⇒ **OFF** | ✅ |
| journal_count | **0** (لم يتغيّر) | ✅ |
| DDL/CoA/Mapping | لا تُلمَس (`DO_NOT_RERUN`) | ✅ |
| RLS policies | لا تُلمَس | ✅ |

## النطاق
code-only على مسار `POST /api/invoices/:id/refund` فقط. ممنوع: DDL، تغيير بيانات، deploy تلقائي، PM2 restart، تفعيل flag، journal، ربط محاسبي جديد، Stitch، RLS Wave، force push.

```text
GATE0_STATUS: BASELINE_VERIFIED
NEXT: GATE1_FLOW_ANALYSIS
```

`REFUND_IDOR_BASELINE_COMPLETE`
