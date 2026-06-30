# الدفعة 4D — تقرير المراجعة الأمنية (GATE 8)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-user-tenant-linkage-integrity`.
**المُراجَع:** `user_provisioning.js` (جديد، 0 تبعيات)، `server.js` (تحويل معالج إنشاء المستخدم)، اختباران (`user_tenant_linkage_test.js` + تحديث static).

## قائمة التحقق الأمني
| البند | النتيجة | الدليل |
|---|---|---|
| لا انتحال `tenant_id` | ✅ | `tenantId = req.session.user.tenantId` فقط؛ المعالج **لا يقرأ** `req.body.tenant_id` (مؤكَّد static + لا مسار في الـ helper). |
| لا route بلا RBAC | ✅ | السلسلة سليمة: `requireAuth → requireRole('settings') → requireTenantAdmin → userLimitGuard → handler`. |
| لا orphan users | ✅ | الإنشاء والربط في معاملة واحدة؛ فشل الربط ⇒ `ROLLBACK` ⇒ رمي ⇒ 500 (لا صف جزئي). مُختبَر سلوكياً. |
| لا partial create | ✅ | ذرّية BEGIN..COMMIT؛ مُختبَر (rollback عند فشل الربط، لا commit). |
| لا تفعيل enforcement افتراضي | ✅ | حارس 4C دون تغيير، خلف flags؛ لم يُفعَّل enforce. |
| لا production config / DDL | ✅ | NO-DDL؛ لا e25؛ لا نشر. |
| لا أسرار | ✅ | لا تسجيل لكلمة المرور/الهاش؛ فحص الأسرار نظيف. |
| لا دفع | ✅ | لا شيء مالي. |
| لا كسر login/MFA | ✅ | `establishSession`/login/MFA دون مساس. |
| لا كسر Tenant Control Center | ✅ | super_admin 28/28، plans 47/47 سليمة. |
| ربط RLS صحيح | ✅ | `set_config('app.tenant_id', $1, true)` قبل إدراج `user_tenants` (الجدول حسّاس RLS). |
| لا تكرار ربط | ✅ | `ON CONFLICT (user_id, tenant_id) DO NOTHING` (يستخدم `uq_user_tenant`). مُختبَر. |
| متانة الاتصال | ✅ | `pool.connect()` داخل try؛ `if (client) client.release()` في finally (لا تسرّب اتصال، لا تعليق عند فشل connect). |

## تحليل الإصلاح
- **إغلاق الفجوة:** المستخدم الجديد يُربَط في `user_tenants` بمستأجر الجلسة ⇒ `countTenantUsers` (مصدر الحقيقة لـ max_users) يعكسه. أُثبِت باختبار: `count` قبل=0 → بعد=1.
- **التحقّق قبل الاتصال:** سياسة كلمة المرور تُفحَص قبل `pool.connect()` (لا اتصال مهدور على مدخلات سيّئة، يبقى 400 كما هو).
- **استخراج testable:** المنطق في `user_provisioning.js` (نقيّ من التبعيات، يستقبل client محقوناً) ⇒ قابلية اختبار سلوكية كاملة دون DB.

## المخاطر المتبقية (موثّقة)
1. **مسارات إنشاء أخرى:** onboarding يربط أصلاً بشكل صحيح؛ bootstrap seed كذلك. لا مسار آخر منتِج orphan ضمن النطاق.
2. **التفعيل الحيّ لـ enforce** يبقى مؤجّلاً حتى نجاح 4B على staging (الآن أصبح العدّ موثوقاً ⇒ شرط 4D للتفعيل مُستوفى منطقياً، يبقى شرط staging).

## الحكم
**لا orphan، لا انتحال، ذرّية، RBAC محفوظ، RLS صحيح، العدّ موثوق.** → `PASS`.
