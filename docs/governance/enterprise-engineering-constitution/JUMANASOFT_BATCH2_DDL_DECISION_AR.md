# الدفعة 2 — قرار DDL (GATE 4)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-auth-rbac-hardening`.

## القرار: **NO-DDL** (صفر تغيير على المخطط)

تقوية Auth/RBAC في هذه الدفعة **منطقية بالكامل** (حُرّاس + هوية جلسة)، ولا تتطلّب أي عمود أو جدول جديد:

| الحاجة المحتملة | كيف عولجت بلا DDL |
|---|---|
| هوية Super Admin | قائمة بيئية `SUPER_ADMIN_USERS` (موجودة) + إضافة `username` إلى كائن الجلسة وقت التشغيل (لا تغيير DB). |
| دور tenant admin | `system_users.role === 'Admin'` (عمود قائم). |
| تدقيق الرفض/التصعيد | جدول `audit_trail` (قائم). |
| مصفوفة الصلاحيات | `role_permissions` (قائمة، تُستخدم عبر `requirePermission`). |

- **لا migration جديد** في هذه الدفعة (لا up/down/candidate لازم).
- **لا destructive** (لا DROP/ALTER/DELETE).
- العمود `username` موجود أصلاً في `system_users`؛ نحن فقط **نقرؤه** في استعلام تسجيل الدخول ونمرّره للجلسة — قراءة فقط، لا DDL.

## التأكيدات
- لم يُشغَّل أي DDL/migration على أي قاعدة (إنتاج أو غيره).
- لا يلزم rollback قاعدة بيانات لهذه الدفعة.
