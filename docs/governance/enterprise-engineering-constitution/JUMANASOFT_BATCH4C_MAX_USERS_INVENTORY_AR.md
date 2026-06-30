# الدفعة 4C — جرد مسار إنشاء المستخدم (GATE 2)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-max-users-enforcement-candidate` (من root `ce326a9` / submodule `be4dd86`).
**النطاق:** قراءة فقط — لا تعديل.

## 1) المسار المستهدف: `POST /api/settings/users`
- **السلسلة** ([server.js:3490](../../../namaweb/server.js#L3490)): `requireAuth` → `requireRole('settings')` → `requireTenantAdmin({action:'BLOCKED_USER_CREATE', module:'Settings'})` → المعالج.
- المعالج: `validatePasswordPolicy` ثم `INSERT INTO system_users (...)` ([server.js:3498](../../../namaweb/server.js#L3498)) ثم `logAudit('CREATE_USER')`.
- **خاص بأدمن المستأجر** (`role==='Admin'` عبر `requireTenantAdmin`) — ليس super admin.

## 2) ملاحظة جوهرية: لا ربط `user_tenants` في هذا المسار
- المعالج يُدرِج في `system_users` **فقط** — **لا** `INSERT INTO user_tenants`. أي عضوية المستأجر للمستخدم الجديد تُنشأ في مكان آخر/لاحقاً.
- **أثر على العدّ:** عدّ المستخدمين عبر `user_tenants` لن يعكس مستخدمي هذا المسار حتى يُربطوا. → **فجوة معروفة** تُوثّق وتُعالَج قبل التفعيل الحيّ (انظر §6). للمرشّح، دالة العدّ صحيحة دلالياً («أعضاء المستأجر النشطون»)، والربط شرط تفعيل.

## 3) مصدر `tenant_id` (لمنع الانتحال)
- من الجلسة فقط: `req.session.user.tenantId` (يُضبط في `establishSession`). **لا يُقرأ من جسم الطلب أبداً** → لا bypass عبر tenant_id منتحَل.

## 4) طريقة عدّ المستخدمين الحاليين
- المعيار المعتمد (يطابق super_admin/entitlements): `SELECT COUNT(*)::int FROM user_tenants WHERE tenant_id=$1 AND is_active=true` ([super_admin.js:124](../../../namaweb/super_admin.js#L124)).
- **active فقط** (`is_active=true`) — المعطّلون لا يُحتسبون.
- **super admin خارج المستأجر** يُستبعَد طبيعياً (العدّ tenant-scoped عبر `user_tenants`؛ من ليس عضواً لا يُحتسب).

## 5) جداول/مسارات ذات صلة
- `system_users`: **لا `tenant_id`**؛ أعمدة منها `is_active`. الحذف عبر `DELETE FROM system_users` (حذف فعلي، لا soft-delete) — لا يؤثر على منطق 4C.
- `user_tenants`: عضوية المستأجر (`user_id, tenant_id, is_active`).
- **مسار إنشاء ثانٍ:** `onboarding.js` ([:277](../../../namaweb/onboarding.js#L277), [:284](../../../namaweb/onboarding.js#L284)) يُنشئ Admin الأولي **+** `user_tenants` أثناء توفير المنشأة — **خارج نطاق 4C** (لا يُربط).
- bootstrap (`db_postgres.js`) يبذر admin + user_tenants — غير ذي صلة بالتشغيل.

## 6) الخلاصة (تغذّي التصميم)
- نقطة الإنفاذ الوحيدة في 4C = `POST /api/settings/users` (نظيفة، route واحد، أدمن المستأجر).
- العدّ = أعضاء المستأجر النشطون من `user_tenants` للـ `tenantId` من الجلسة.
- **فجوة تفعيل معروفة:** هذا المسار لا يربط `user_tenants`، فالعدّ قد لا ينمو عبره؛ قبل التفعيل الحيّ يجب تأكيد/إصلاح آلية ربط العضوية حتى يصبح الحدّ ذا معنى (يُسجَّل في runbook التفعيل 4C).
- 4C = **كود مرشّح خلف flags فقط**: disabled=no-op، observe=تسجيل بلا منع، enforce=منع عند `usage >= max_users`. لا DDL، لا staging، لا تفعيل حيّ.
