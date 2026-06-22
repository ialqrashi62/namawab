# PHASE 3 — مطابقة دفاع RBAC في العمق لكل المجموعات الـ28

> 2026-06-22 | مبني على تدقيق P1 + المطابقة العميقة الحيّة + الإصلاحين المنشورين هذه الحملة.

## الأساس
كل المجموعات تحت **147 FORCE RLS** + ربط app.tenant_id + RBAC طبقة-تطبيق. **لا مسار يثق بـtenant_id/facility_id من body/query (0 حالة).** RLS هو الحد الصلب؛ ما دونه دفاع-في-العمق.

## ملخّص المجموعات (auth/role/tenant)
| المجموعة | auth | role guard | tenant | مخاطر متبقّية |
|---|---|---|---|---|
| auth | n/a | loginLimiter | session | — |
| system_users/settings | ✅ | requireRole('settings') + **Admin guard على POST/PUT/DELETE** | n/a | **مغلق** (منشور) |
| patients | ✅ | requireAuth(+catalog/discount) | RLS | IDOR مُخفَّف بـRLS |
| appointments | ✅ | requireAuth | RLS | — |
| admissions/discharge | ✅ | tenant-scoped | RLS | — |
| beds/occupancy | ✅ | tenant-scoped | RLS | — |
| nursing/ICU | ✅ | requireRole | RLS | — |
| lab | ✅ | requireRole | RLS | UPDATE status بلا AND tenant (RLS) |
| radiology | ✅ | requireRole | RLS | catalog غير tenant |
| pharmacy | ✅ | requireRole+requireTenantScope | RLS | — |
| insurance | ✅ | requireRole | RLS | claims UPDATE (RLS) |
| billing | ✅ | requireRole('invoices','accounts') | RLS | **daily_close خامل** (PHASE 1) |
| finance | ✅ | requireRole | RLS | — |
| HR/payroll | ✅ | requireRole('hr') | RLS | **employees POST/DELETE مغلق** (منشور)؛ GET مفتوح عمداً |
| branches/departments | ✅ | requireAuth | RLS | — |
| blood bank | ✅ | requireRole | RLS | — |
| pathology/CSSD/CME/infection/maintenance | ✅ | requireRole | RLS | — |
| ZATCA | ✅ | requireRole | RLS | — |
| reports | ✅ | requireRole+requireTenantScope | RLS | — |
| admin/settings | ✅ | requireRole+Admin | n/a | **مغلق** |
| facility entitlements | ✅ | requireAuth | type-map | — |

## المنشور هذه الحملة
1. حارس Admin على `POST /api/settings/users` (ae539b2).
2. `requireRole('hr')` على `POST/DELETE /api/employees` + audit (bc24a47).

## الحالة
```text
API_RBAC_ALL_GROUPS_RECONCILED: YES (28)
P0_REMAINING: 0
P1_REMAINING: defense-in-depth explicit AND tenant_id على UPDATE/SELECT (RLS-mitigated, غير عاجل)
NEXT_REQUIRED_ACTION: none blocking (RLS يغطّي المتبقّي)
```
