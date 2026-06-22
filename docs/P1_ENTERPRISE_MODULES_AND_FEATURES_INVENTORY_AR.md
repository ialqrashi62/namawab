# PHASE 1 — جرد وحدات وميزات NamaMedical المؤسسية

> 2026-06-22 | جرد حيّ: **371 مسار API** (187 GET / 121 POST / 55 PUT / 8 DELETE)، **162 جدولاً** (147 FORCE RLS). أدلة حيّة، لا تغيير إنتاجي.

## تغطية الحراسة (حيّ)
- requireAuth: **366/371** (الخمسة العامة: login/logout/health/auth-me/catch-all — مقصودة).
- role guard (requireRole/SuperAdmin/Catalog): 61 مسار.
- requireTenantScope: 111 مسار.
- **الثقة بـtenant_id/facility_id من body/query: 0** (عبر الملف كاملاً).
- كل الجداول الحسّاسة محميّة بـRLS طبقة DB ⇒ الحراسة طبقة-التطبيق = دفاع-في-العمق.

## جرد الوحدات
| الوحدة | جداول | RLS | RBAC | tenant stamping | مخاطر/حالة |
|---|---|---|---|---|---|
| auth | — | n/a | loginLimiter | session | ✅ |
| users/settings | system_users(1) | RBAC (no tid by design) | **Admin guard على POST/PUT/DELETE** | n/a | ✅ مغلق |
| tenants/facilities | tenants(2)/user_facilities | registry/junction | requireAuth | n/a | ✅ |
| facility entitlements | type-map (app.js 20-21) | n/a | backend type-gate | n/a | ✅ |
| patients | 3 | ✅ FORCE | requireAuth | صريح | ✅ (IDOR مُخفَّف RLS) |
| appointments | 5 | ✅ | requireAuth | صريح | ✅ |
| admissions/discharge | 3 | ✅ | tenant-scoped | صريح | ✅ |
| beds/occupancy | 2 | ✅ | tenant-scoped | صريح | ✅ |
| nursing/ICU | 13 | ✅ | requireRole | صريح | ✅ |
| EMR/medical_records | 4 | ✅ | requireRole | DEFAULT | ✅ |
| certificates/referrals/reports/obgyn/visit_lifecycle | ضمن cosmetic/specialty (28 FORCE) | ✅ | requireRole | DEFAULT | ✅ |
| lab | 4 (3 FORCE + catalog) | ✅ | requireRole | صريح | ✅ |
| radiology | orders في lab_radiology_orders + radiology_catalog | ✅ | requireRole | صريح | ✅ catalog غير tenant |
| pharmacy | 9 | ✅ | requireRole+TenantScope | صريح | ✅ (لا خصم قبل الصرف) |
| blood bank | 4 | ✅ | requireRole | DEFAULT | ✅ |
| pathology/CSSD/CME/infection/maintenance | 2/4/3/3/4 | ✅ | requireRole | DEFAULT | ✅ |
| invoices/receipts/refunds | 2 (1 FORCE) | ✅ | requireRole('invoices','accounts') | صريح | refund محصّن سابقاً |
| cash_drawer | 1 | user-scoped (Batch A) | requireAuth | n/a | ✅ بالتصميم |
| **daily_close** | 1 | ⚠ بلا RLS، فارغ | requireRole | — | **فجوة خاملة** — مرشّح مُرهَّن PASS، gated |
| insurance | 4 | ✅ | requireRole | DEFAULT | ✅ |
| finance_* | 9 | ✅ | requireRole | DEFAULT | ✅ |
| accounting posting | journal_entries غائب | n/a | n/a | n/a | OFF/readiness فقط |
| inventory/purchases/suppliers | 10 | ✅ | requireRole | DEFAULT | ✅ |
| HR/payroll | 9 | ✅ | requireRole('hr') | DEFAULT | ✅ |
| employees | ضمن HR (14-table) | ✅ | **POST/DELETE requireRole('hr') منشور**؛ GET مفتوح | DEFAULT | ✅ |
| branches/departments | 2 | ✅ | requireAuth | backfilled | ✅ |
| ZATCA | 1 | ✅ | requireRole | صريح | ✅ |
| audit_trail | 1 | ✅ FORCE (append-only policy) | logAudit | tid من ALS | ✅ |
| reports/dashboards | — | n/a | requireRole+TenantScope | n/a | ✅ |
| external integrations | ZATCA/NPHIES readiness | — | — | — | مرجع compliance skill |

## الحالة
```text
MODULES_INVENTORIED: full ERP/HIS (28 groups)
ROUTES: 371 (auth 366/371; role 61; tenantScope 111; body/query tenant trust 0)
TABLES: 162 (147 FORCE RLS, 148 tenant_id)
DORMANT_GAP: daily_close (rehearsed candidate ready, gated)
DEPLOYED_GUARDS: system_users (POST/PUT/DELETE), employees (POST/DELETE)
```
