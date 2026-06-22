# PHASE 3 — تدقيق API/RBAC/الصلاحيات الكامل (كل المسارات)

> 2026-06-22 | استخراج حيّ من server.js. لا تغيير هذا القسم (الإصلاحات منشورة سابقاً هذه الجلسة).

## الإحصاء الحيّ
- **371 مسار**: 187 GET، 121 POST، 55 PUT، 8 DELETE.
- requireAuth: **366/371**. الخمسة بلا auth = عامة مقصودة: `POST /api/auth/login`، `POST /api/auth/logout`، `GET /api/health`، `GET /api/auth/me`، `GET *` (catch-all). **لا فجوة auth**.
- role guard: 61 مسار (requireRole/requireSuperAdmin/requireCatalogAccess).
- requireTenantScope: 111 مسار.
- **body/query tenant trust: 0** (عبر الملف).

## الحراسات المنشورة (مؤكَّدة)
- `system_users`: POST(Admin guard)/PUT(P0 privilege guard)/DELETE(Admin-only) — مغلق.
- `employees`: POST/DELETE → requireRole('hr')+audit؛ GET مفتوح عمداً (قوائم الأطباء، كشف راتب داخل المستأجر فقط).
- catalog edits: requireCatalogAccess (Admin/Manager).
- discount: MAX_DISCOUNT_BY_ROLE.

## المخاطر المتبقّية
- **daily_close** routes (GET 4470/POST 4484): بلا نطاق مستأجر — تُغطّى تلقائياً بعد تطبيق مرشّح RLS (PHASE 5/2). gated DDL.
- defense-in-depth: إضافة `AND tenant_id` صريح على بعض UPDATE/SELECT (RLS-mitigated، غير عاجل).
- audit-reader: غير ممنوح (PHASE 7).

## الحالة
```text
P0_REMAINING: 0
P1_REMAINING: daily_close RLS (gated DDL); explicit AND tenant_id defense-in-depth (RLS-mitigated)
CODE_CANDIDATES: none blocking (الإصلاحات الواضحة منشورة)
DEPLOY_REQUIRED: none (beyond gated daily_close DDL)
```
