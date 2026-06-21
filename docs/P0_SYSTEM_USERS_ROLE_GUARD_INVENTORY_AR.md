# P0 — جرد خطر تعديل أدوار المستخدمين (`PUT /api/settings/users/:id`)

> المرحلة: `P0_SYSTEM_USERS_ROLE_GUARD_CODE_ONLY_DEPLOY` — Gate 1 | 2026-06-21 | فحص قراءة-فقط.

## الخطر
```text
route: PUT /api/settings/users/:id
file: namaweb/server.js
line_range: 1435–1452
current_auth_guard: requireAuth فقط
current_role_guard: لا شيء (مفقود) — بينما POST (1425) فيه requireRole('settings') وDELETE (1454) يفحص role==='Admin'
fields_allowed_to_update: username, password, display_name, role, speciality, permissions, is_active, commission_type, commission_value
dangerous_fields: role, permissions, is_active, commission_type, commission_value, username, password (لمستخدم آخر)
tenant_scope: لا ينطبق — system_users جدول عالمي بلا tenant_id (SYSTEM_ONLY، يُعرّف التعدّدية)؛ الربط بالمستأجر عبر user_tenants لا عبر عمود في الجدول ⇒ لا يمكن فرض cross-tenant scoping دون DDL (خارج النطاق)
self_update_behavior: أي مستخدم مصادَق يستطيع تعديل سجلّه (incl. role/permissions) ⇒ ترقية ذاتية
admin_update_behavior: لا تمييز — أي مستخدم (وليس Admin فقط) يعدّل أي مستخدم
risk: 🔴 P0 — تصعيد صلاحيات/اختطاف حساب: أي مستخدم مصادَق يغيّر role/permissions/password لأي مستخدم آخر أو يرفع نفسه Admin. RLS لا يحمي (system_users بلا RLS، والخطر في الصلاحيات نفسها).
```

## نموذج الأدوار (من الكود)
- `ROLE_PERMISSIONS['Admin'] = '*'` (أعلى صلاحية = «Super Admin/Owner» في هذا النظام). باقي الأدوار module-scoped.
- `req.session.user = { id, role, display_name, permissions, tenantId, ... }`. `logAudit(...)` متاح. `requireRole(...)` يفحص ROLE_PERMISSIONS.

## قواعد الإصلاح المعتمدة (Gate 2)
1. الحقول الخطرة (role/permissions/is_active/commission/username/كلمة مرور الغير) تُعدَّل فقط بدور `Admin`.
2. غير-Admin: يعدّل **سجلّه فقط** و**حقول profile الآمنة فقط** (display_name, speciality, password).
3. غير-Admin يحاول تعديل مستخدم آخر ⇒ 403.
4. غير-Admin يحاول تغيير حقل خطر على نفسه (ترقية) ⇒ 403 + audit آمن (بلا PHI).
5. لا ثقة بأي role/tenant_id من body؛ هوية الفاعل من `req.session.user` فقط.
6. حماية آخر Admin: منع تنزيل/تعطيل آخر Admin نشط.
7. تحديث profile الآمن يبقى يعمل.

`SYSTEM_USERS_ROLE_GUARD_RISK_INVENTORY_COMPLETE — P0 confirmed (PUT 1435 missing role guard)`
