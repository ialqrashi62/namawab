# الدفعة 4D — جرد إنشاء المستخدم وربط المستأجر (GATE 2)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-user-tenant-linkage-integrity` (من root `b87a73b` / submodule `0747768`).
**النطاق:** قراءة فقط — لا تعديل.

## 1) مسارات إنشاء المستخدم
| المسار | يُدرِج `system_users`؟ | يُدرِج `user_tenants`؟ | معاملة؟ |
|---|---|---|---|
| **`POST /api/settings/users`** ([server.js:3490](../../../namaweb/server.js#L3490)) | نعم | **لا** ← الفجوة | **لا** (pool.query مباشر) |
| `onboarding.js` (توفير منشأة) ([:276](../../../namaweb/onboarding.js#L276), [:283](../../../namaweb/onboarding.js#L283)) | نعم | **نعم** (+ `user_facilities`) | **نعم** (pool.connect + BEGIN/COMMIT) |
| bootstrap seed ([db_postgres.js:1830](../../../namaweb/db_postgres.js#L1830)+) | admin | نعم | داخل إقلاع |

## 2) جدول `user_tenants` ([db_postgres.js:1712](../../../namaweb/db_postgres.js#L1712))
- `user_id INTEGER FK system_users ON DELETE CASCADE`, `tenant_id INTEGER FK tenants`, `is_active BOOLEAN DEFAULT TRUE`, `created_at`.
- **قيد فريد:** `CONSTRAINT uq_user_tenant UNIQUE(user_id, tenant_id)` → يدعم `ON CONFLICT (user_id, tenant_id) DO NOTHING` (يمنع التكرار).
- **حسّاس للمستأجر (RLS):** يحوي `tenant_id` → الإدراج عبر عميل مخصّص يتطلّب ربط `set_config('app.tenant_id', $1, true)`.

## 3) مصدر `tenant_id`
- من الجلسة فقط: `req.session.user.tenantId` (يضبطه `establishSession` من `user_tenants`). **هذا المسار لا يقرأ `tenant_id` من الجسم** — يجب الإبقاء على ذلك (منع انتحال).

## 4) المعاملات والـ RLS (النمط القائم)
- النمط: `const client = await pool.connect(); BEGIN; set_config('app.tenant_id', $1, true); ...; COMMIT/ROLLBACK; client.release()` (أمثلة: clinical_cpoe، e16، أسطر server.js عديدة 9901/11610/12289...).
- العميل المخصّص (`pool.connect`) **لا يرث** ربط `app.tenant_id` للطلب (الذي يتم عبر `tenantStore` لـ pool.query العادي) → يجب الربط صراحة.
- `system_users` **بلا `tenant_id`** (جدول عالمي) → الربط لا يؤثّر عليه؛ يؤثّر فقط على إدراج `user_tenants`.

## 5) حالات حافة
- **مستخدمون بلا ربط (orphan):** المسار الحالي يُنشئ `system_users` دون `user_tenants` → عضوية المستأجر غير مُسجّلة → `countTenantUsers` لا يعدّهم. هذه هي الفجوة المستهدفة.
- **super admin العالمي:** هويته عبر قائمة `SUPER_ADMIN_USERS` (env)؛ قد يكون/لا يكون عضو مستأجر. العدّ tenant-scoped عبر `user_tenants` → لا يُحتسب خطأً ضمن مستأجر ليس عضواً فيه. لا نربطه تلقائياً.
- **غياب `tenantId` في الجلسة:** سياق غير-مستأجر (نادر لأدمن مستأجر) → لا ربط ممكن؛ يُبقى السلوك الحالي (إنشاء بلا ربط) لتلك الحافة فقط، مع تسجيل.

## 6) الخلاصة (تغذّي التصميم)
- **الإصلاح:** جعل `POST /api/settings/users` يربط المستخدم الجديد في `user_tenants` بمستأجر الجلسة، **داخل معاملة واحدة** (لا orphan: فشل الربط ⇒ rollback)، مع ربط `app.tenant_id` للـ RLS، و`tenant_id` من الجلسة فقط.
- **مصدر الحقيقة موحّد:** `countTenantUsers` يقرأ `user_tenants` — نفس ما يكتبه الإصلاح ⇒ العدّ ينمو بعد الإنشاء (يُثبَت باختبار).
- **NO-DDL** (القيد الفريد موجود؛ لا تغيير مخطط).
