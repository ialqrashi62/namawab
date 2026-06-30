# الدفعة 1 — جرد Tenant Control Center (GATE 2)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-tenant-control-center` · بحث فعلي في الكود (لا افتراض).

## 1) الجداول الموجودة (قابلة لإعادة الاستخدام)
| الجدول | الأعمدة المهمّة | RLS |
|---|---|---|
| `tenants` (db_postgres.js:1682) | `id, name, subdomain UNIQUE, status DEFAULT 'active', plan_type DEFAULT 'standard', created_at` | **بلا RLS** (جدول علوي، يحمل `id` لا `tenant_id`) → الـ Super Admin يقرؤه مباشرة |
| `facilities` | `id, tenant_id→tenants, name, tax_number` | tenant-scoped |
| `branches` | `id, facility_id, name` | — |
| `system_users` (db:527) | `id, username UNIQUE, password_hash, display_name, role DEFAULT 'Reception', permissions, is_active` — **لا tenant_id** (مستخدمون عامّون) | — |
| `user_tenants` (db:1712) | `user_id→system_users, tenant_id→tenants, is_active, UNIQUE(user_id,tenant_id)` | tenant-scoped |
| `audit_trail` (db:1134) + `logAudit()` (server.js:380) | يسجّل من/ماذا/متى/IP، tenant_id من السياق | tenant-scoped |

## 2) الأدوار والصلاحيات
- `ROLE_PERMISSIONS` (server.js:328): `'Admin' = '*'` (كل الوحدات)، أدوار أخرى مقيّدة. + `rbac.js` (requirePermission مصفوفي fail-closed).
- **لا يوجد علم/دور Super Admin على مستوى المنصّة** (لا `is_super_admin`، لا دور `SuperAdmin`). `'Admin'` هو **أدمن المستأجر** لا أدمن المنصّة.

## 3) المسارات الموجودة المتعلّقة بالإدارة
- `/api/admin/audit-trail`, `/api/admin/backup-info`, `/api/admin/backup`, `/api/admin/backups` (كلها `requireAuth` على مستوى المستأجر).
- **لا يوجد** `/api/tenants` ولا `/api/super-admin/*` ولا أي إدارة مستأجرين عبر-المستأجر → **الفجوة مؤكّدة**.

## 4) الاشتراكات/الخطط/الفوترة
- **لا توجد** جداول `plans/subscriptions/plan_features/billing_events` (مؤجّلة لدفعات لاحقة حسب الخارطة).
- خطة المستأجر الحالية = `tenants.plan_type` (نصّي بسيط).

## 5) خلاصة للتصميم (تؤثّر على GATE 3/4)
- **`tenants.status` و `tenants.plan_type` موجودان** → تغيير الحالة وعرض الخطة **بلا DDL**.
- `tenants` بلا RLS → القائمة تُقرأ مباشرة (id/name/status/plan/created).
- **عدد المستخدمين / آخر نشاط** يتطلّب قراءة `user_tenants`/`audit_trail` (المحميّة بـ RLS) → الـ Super Admin يقرؤها **لكل مستأجر على حدة** بربط `app.tenant_id` لذلك المستأجر في صفحة التفاصيل (يحترم RLS، لا قراءة عبر-المستأجر بالجملة).
- هوية Super Admin: **قائمة بيئية** `SUPER_ADMIN_USERS` (أسماء مستخدمين، منح منصّة صريح) — لا DDL، يمنع تصعيد أدمن المستأجر.

## 6) قرار البوابة (GATE 2)
- ✅ **PASS** — الجرد مكتمل بالبحث، الأساس كافٍ لبناء Tenant Control Center **بلا DDL إنتاجي**. ننتقل إلى GATE 3.
