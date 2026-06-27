# P0 ربط app.tenant_id — 02 التنفيذ (Implementation)

> التاريخ: 2026-06-20 | الملفات: `namaweb/db_postgres.js`, `namaweb/server.js`. أصغر تغيير آمن يغطّي كل مواقع الاستدعاء (804 `pool.query` + معاملة `pool.connect` واحدة).

## 1. التصميم
- **AsyncLocalStorage (`tenantStore`)**: لكل طلب سياقه الخاص؛ ALS يحمل `{tenantId, facilityId}` عبر سلسلة async للطلب، فلا تسرّب بين الطلبات.
- **Middleware (server.js، بعد الجلسة، قبل المسارات)**: يقرأ `getRequestTenantContext(req)` ويشغّل بقية الطلب داخل `tenantStore.run({tenantId, facilityId}, next)`. بلا tenant → السلوك الأصلي (تسجيل الدخول/الصحة/الملفات الثابتة).
- **wrapper لـ `pool.query` (db_postgres.js)**: عند وجود سياق مستأجر → يحجز اتصالاً، ينفّذ `set_config('app.tenant_id', tid, false)`، ينفّذ الاستعلام على **نفس** الاتصال، ثم يعيد ضبط `app.tenant_id` إلى `''` في `finally` ويحرّر الاتصال. بدون سياق → الاستعلام الأصلي بلا تغيير.
- **مسار `pool.connect` (معاملة الإفراغ)**: أُضيف بعد `BEGIN`: `set_config('app.tenant_id', $1, true)` (محلي للمعاملة، يُعاد ضبطه تلقائياً عند COMMIT/ROLLBACK).

## 2. لماذا هذا أصغر تغيير آمن
- لا حاجة لتعديل 804 موقع استدعاء؛ الـ wrapper يلتقطها جميعاً.
- لا يكسر السلوك الحالي: بدون سياق (init/seed/login) يستخدم المسار الأصلي.
- لا تسرّب: ALS لكل طلب + إعادة ضبط GUC قبل تحرير الاتصال للـ pool.

## 3. منع تسرّب السياق
| الطبقة | الضمان |
| ------ | ------ |
| بين الطلبات | لكل طلب سياق ALS مستقل |
| بين الاستعلامات المتزامنة في طلب | كل `pool.query` يحجز اتصالاً منفصلاً بسياقه |
| على مستوى الاتصال المجمّع | إعادة ضبط `app.tenant_id=''` في `finally` قبل `release()` |
| في المعاملة | `SET LOCAL` (is_local=true) يُعاد ضبطه تلقائياً عند نهاية المعاملة |

## 4. ملاحظات
- التطبيق لا يستخدم نمط callback لـ `pool.query` (كله `await`) — الـ wrapper يدعم `(text)` و`(text, params)`.
- التهيئة (initDatabase) وseed تعمل خارج سياق طلب → المسار الأصلي → غير متأثرة.
- تكلفة: حجز/تحرير اتصال لكل استعلام عند وجود سياق (مقبول؛ pg Pool يعيد استخدام الاتصالات الخاملة) — يُراجَع في تدقيق الأداء.

## 5. تعديلات pool.query / pool.connect
- `pool.query` معدّل: **نعم** (wrapper).
- `pool.connect` (معاملة الإفراغ): **نعم** (إضافة SET LOCAL).

`IMPLEMENTATION_COMPLETE`
