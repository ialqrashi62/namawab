# الدفعة 4D — تصميم سلامة ربط المستخدم بالمستأجر (GATE 3)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-user-tenant-linkage-integrity`.
**المبدأ:** أقل diff، معاملة ذرّية، `tenant_id` من الجلسة، لا orphan، يحافظ على RBAC و4C، NO-DDL.

## 1) سياسة الربط
- **مصدر `tenantId`:** `req.session.user.tenantId` **حصراً** — لا يُقرأ من جسم الطلب أبداً.
- عند إنشاء مستخدم مستأجر: يُنشأ `user_tenants(user_id, tenant_id, is_active=true)` في **نفس المعاملة** التي تُنشئ `system_users`.
- **عدم التكرار:** `ON CONFLICT (user_id, tenant_id) DO NOTHING` (يستخدم `uq_user_tenant`).
- **لا orphan:** إن فشل أي جزء (إدراج المستخدم أو الربط) ⇒ `ROLLBACK` ⇒ تفشل العملية كاملة (لا مستخدم بلا ربط).
- **super admin العالمي:** لا يُربط تلقائياً بمستأجر (الربط فقط لمستأجر الجلسة الحالي).
- **حافة بلا `tenantId`:** لا ربط ممكن؛ يُبقى السلوك الحالي (إنشاء المستخدم بلا ربط) مع تسجيل — لا regression لتلك الحالة النادرة.

## 2) الذرّية والـ RLS
- عميل مخصّص: `pool.connect()` → `BEGIN` → `set_config('app.tenant_id', $1, true)` (محلي للمعاملة، لإدراج `user_tenants` الحسّاس RLS) → `INSERT system_users RETURNING id` → `INSERT user_tenants ... ON CONFLICT DO NOTHING` → `SELECT` صف العرض → `COMMIT`. عند الخطأ: `ROLLBACK`. `finally: client.release()`.
- `system_users` بلا `tenant_id` فلا يتأثّر بالربط؛ الربط يضمن فقط نجاح `user_tenants` تحت RLS.

## 3) توافق العدّ (مصدر حقيقة موحّد)
- `countTenantUsers` (4C) يقرأ `COUNT(*) FROM user_tenants WHERE tenant_id=? AND is_active=true` — **نفس** ما يكتبه الإصلاح ⇒ بعد إنشاء مستخدم، يزيد العدّ بواحد.
- اختبار إلزامي يثبت: `count` قبل الإنشاء + 1 = بعد الإنشاء.

## 4) الحفاظ على ما هو قائم
- **RBAC دون تغيير:** السلسلة تبقى `requireAuth → requireRole('settings') → requireTenantAdmin → userLimitGuard → handler`.
- **حارس 4C دون تغيير:** `makeUserLimitGuard`/`countTenantUsers` كما هي؛ لا تفعيل enforce.
- **سلوك الاستجابة:** يبقى إرجاع صف المستخدم المُنشأ (نفس الأعمدة). تغيير داخلي فقط (pool.query → معاملة client).

## 5) الأمان
- لا انتحال `tenant_id` (من الجلسة فقط).
- لا orphan (rollback عند فشل الربط).
- لا كشف تفاصيل داخلية في الأخطاء (يبقى 500 عام كما هو، أو 400 لسياسة كلمة المرور كما هو).
- لا أسرار، لا دفع، لا DDL.

## 6) المعمارية (أقل diff)
- تعديل **معالج واحد**: `POST /api/settings/users` في `server.js` → تحويله إلى معاملة client مع ربط `user_tenants`.
- لا ملفات جديدة في الكود (الاختبار الجديد فقط). لا تغيير على `entitlements.js`.

## 7) خارج النطاق
لا DDL/e25، لا staging، لا تفعيل enforce، لا فواتير/فروع/وحدات، لا دفع، لا ربط مسار onboarding (يربط أصلاً بشكل صحيح).
