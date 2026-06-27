# PHASE 4 — جودة سير العمل السريري لكل الأقسام

> 2026-06-22 | كل الأقسام تحت FORCE RLS + RBAC + ربط app.tenant_id. لا حساب اختبار ⇒ harness.

## التقييم لكل قسم
| القسم | unauth | RLS سلوك | RBAC | فجوة سير عمل |
|---|---|---|---|---|
| patients | 401 | عزل (3/0/0) | requireAuth | — |
| appointments | 401 | عزل | requireAuth | — |
| admissions/discharge | 401 | عزل | tenant-scoped | — |
| beds/occupancy | 401 | عزل | tenant-scoped | — |
| nursing | 401 | عزل | requireRole | — |
| ICU | 401 | عزل | requireRole | — |
| EMR/medical_records | 401 | عزل | requireRole | — |
| lab | 401 | عزل | requireRole | UPDATE status بلا AND tenant (RLS يغطّي) |
| radiology | 401 | عزل (catalog عام) | requireRole | — |
| pharmacy | 401 | عزل | requireRole+TenantScope | قاعدة: لا خصم قبل الصرف (مرجع skill) |
| blood bank | 401 | عزل | requireRole | — |
| pathology/CSSD/infection/maintenance | 401 | عزل | requireRole | — |
| obgyn/referrals/medical_reports | 401 | عزل | requireRole | — |

## Harness (مسار التطبيق الحقيقي، هذه الجلسة)
عزل مُثبَت app-path: patients 3/0/0، employees 3/0، branches 1/0، FORCE=147. unauth للمسارات الحسّاسة=401. لا 42501/42P01 على مسار التطبيق.

## الحالة
```text
CLINICAL_WORKFLOW_STATUS: PASS (RLS+RBAC enforced; harness)
BROWSER_E2E: BLOCKED_PENDING_TEST_ACCOUNT
HARNESS_STATUS: PASS
```
