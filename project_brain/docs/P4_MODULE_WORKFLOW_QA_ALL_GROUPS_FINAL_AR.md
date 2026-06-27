# PHASE 4 — جودة سير عمل الموديولات لكل المجموعات

> 2026-06-22 | مصفوفة QA مبنية على تدقيق المسارات + إثبات RLS الحيّ (PHASE 0) + تدقيق الختم (PHASE 2).

## ملخّص
كل الموديولات تحت **147 FORCE RLS** + ربط app.tenant_id + RBAC طبقة-تطبيق. لا فجوة RLS tenant-sensitive على مستوى DB. الحالة العامة لكل موديول = **PASS (RLS+RBAC مفروضان)** ما لم يُذكر خلاف.

## المصفوفة
| الموديول | RLS | RBAC (requireRole) | ختم المستأجر | ملاحظة/مخاطر |
|---|---|---|---|---|
| patients | ✅ FORCE | requireAuth (+catalog/discount guards) | صريح | IDOR مُخفَّف بـRLS |
| appointments | ✅ | requireAuth | صريح | DELETE بلا AND tenant_id (RLS) |
| admissions/discharge | ✅ | tenant-scoped | صريح | PASS |
| beds/occupancy | ✅ | tenant-scoped | صريح | PASS |
| nursing/ICU | ✅ | requireRole | صريح | PASS |
| lab | ✅ | requireRole | صريح | UPDATE status بلا AND tenant_id (RLS) |
| radiology | ✅ | requireRole | صريح | PASS |
| pharmacy | ✅ | requireRole + requireTenantScope | صريح | قاعدة: لا خصم قبل الصرف (مرجع skill) |
| insurance | ✅ | requireRole | DEFAULT | claims UPDATE بلا AND tenant_id (RLS) |
| billing/finance | ✅ | requireRole('invoices','accounts') | صريح | refund محصّن سابقاً |
| HR/payroll | ✅ (hr_employees/14-table) | requireRole('hr') | DEFAULT | /api/employees GET بلا role (قوائم أطباء) |
| branches/departments | ✅ (14-table) | requireAuth | backfilled | PASS |
| blood bank | ✅ | requireRole | DEFAULT | ختم صريح = دفاع-في-العمق |
| pathology | ✅ (Batch B) | requireRole | DEFAULT | PASS |
| CSSD | ✅ (Batch B/14) | requireRole | DEFAULT | PASS |
| CME | ✅ (14-table) | requireRole | DEFAULT | PASS |
| infection control | ✅ (Batch B) | requireRole | DEFAULT | PASS |
| maintenance | ✅ (Batch B) | requireRole('maintenance') | DEFAULT | PASS |
| ZATCA | ✅ | requireRole | صريح | PASS |
| reports | ✅ | requireRole + requireTenantScope | n/a | financial/commissions tenant-scoped |
| admin/settings | ✅ (company_settings RLS) | requireRole('settings')+Admin | n/a | **POST users Admin-guard منشور** |
| facility entitlements | n/a | requireAuth | n/a | استحقاقات النوع (مرجع skill) |

## أبرز البنود
- **منشور هذه المرحلة**: حارس Admin على إنشاء مستخدم النظام (تصعيد امتياز) — انظر PHASE 1.
- **مفتوح بقرار**: `/api/employees` GET بلا requireRole (قوائم الأطباء؛ كشف راتب داخل المستأجر فقط).
- **مُخفَّف بـRLS**: مسارات UPDATE/SELECT بلا AND tenant_id صريح ⇒ دفاع-في-العمق (Batches B/C).

## الحالة
```text
FINAL_STATUS: MODULE_WORKFLOW_QA_ALL_GROUPS_COMPLETE
RLS_GAPS: 0   DEPLOYED_FIX: settings/users admin-guard   OPEN_BY_DECISION: employees GET RBAC
```
