# جمانة سوفت — خارطة تنفيذ SaaS بالدفعات (PHASE 4)

**التاريخ:** 2026-06-30 · **لا تنفيذ كود في هذه المرحلة** — خطة فقط. كل دفعة تُبنى على staging/معزول ثم تُنشر بإذن صريح.
كل دفعة: الملفات المتوقّعة · المخاطر · الاختبارات · rollback · بوابة النجاح. النمط الموحّد: وحدة نقيّة + `*_test.js` + هجرة `eNN_*_{up,down,validate}` + RLS + بوابات [[jumanasoft-global-gates]].

> القاعدة: PASS → التالية تلقائياً. FAIL → توقّف بتقرير. أي DDL/نشر على الإنتاج = إذن لاحق صريح.

## الدفعة 1 — Tenant Control Center (Super Admin)
- **ملفات:** `namaweb/platform/super_admin.js` (مسارات إدارة المستأجرين)، `migrations/e24_tenants_extend_*` (status/plan_id/trial_ends_at)، `migrations/e25_platform_admins_*`، واجهة `public/super-admin/*`، `super_admin_test.js`.
- **مخاطر:** عزل Super Admin عن RLS المستأجر (يجب ألا يصل PHI افتراضياً). تصعيد صلاحية.
- **اختبارات:** وحدة (صلاحيات/انتقالات حالة)، cross-tenant (لا تسرّب)، حارس دور المنصّة.
- **rollback:** down migration + إزالة المسارات (مبوّبة بعلم `SUPER_ADMIN_ENABLED`).
- **بوابة النجاح:** Super Admin يسرد/يعلّق/يفعّل مستأجراً، صفر وصول PHI، اختبارات خضراء.

## الدفعة 2 — Auth/RBAC Hardening
- **ملفات:** توسعة `rbac.js` (مصفوفة المنصّة)، `requireEntitlement` middleware، اختبارات.
- **مخاطر:** fail-open غير مقصود؛ كسر مسارات قائمة.
- **اختبارات:** fail-closed لكل صلاحية، حراسة P0، cross-tenant.
- **rollback:** الإبقاء على المسار القديم خلف علم حتى التحقّق.
- **بوابة:** كل مسار محمي بالصلاحية الصحيحة، 403 عند الغياب.

## الدفعة 3 — Plans & Pricing
- **ملفات:** `migrations/e26_plans_*`, `e27_plan_features_*`, `plans.js`, `plans_test.js`, صفحة أسعار عامة.
- **مخاطر:** أسعار `NUMERIC` (لا REAL)، عملات.
- **اختبارات:** اشتقاق التفعيلات من الخطة، حدود الميزات.
- **rollback:** down migration (جداول جديدة، بلا مساس ببيانات).
- **بوابة:** خطط مُعرّفة، تفعيلات مشتقّة صحيحة.

## الدفعة 4 — Billing Adapter (تجريد الدفع)
- **ملفات:** `payments/provider.js` (واجهة)، `payments/stripe.js`، `payments_test.js` (بـ fetch محقون).
- **مخاطر:** تسرّب SDK؛ أسرار في الكود (ممنوع — env فقط).
- **اختبارات:** عقد الواجهة، تطبيع الأحداث، fail-closed بلا إعداد.
- **rollback:** علم `PAYMENT_PROVIDER` (none افتراضياً = خامل).
- **بوابة:** المحوّل يمرّر العقد، صفر أسرار مطبوعة، خامل بلا إعداد.

## الدفعة 5 — Payment Gateway Sandbox
- **ملفات:** ربط Stripe sandbox، `payments/webhook.js` (+ idempotency عبر `billing_events.event_id`).
- **مخاطر:** webhook غير موقّع/مكرّر.
- **اختبارات:** توقيع webhook، idempotency للحدث المكرّر، sandbox e2e.
- **rollback:** تعطيل المسار (علم)، لا أثر على الإنتاج.
- **بوابة:** checkout sandbox ناجح + webhook idempotent.

## الدفعة 6 — Subscription Lifecycle
- **ملفات:** `migrations/e28_subscriptions_*`, `e29_billing_events_*`, `subscriptions.js`, اختبارات الانتقالات.
- **مخاطر:** انتقالات حالة خاطئة (past_due/canceled)، فقد تفعيلات.
- **اختبارات:** كل انتقال، مهلة الدفع، إلغاء آخر الفترة.
- **rollback:** down migration + علم.
- **بوابة:** الانتقالات الخمسة صحيحة، التفعيلات تتبع الحالة.

## الدفعة 7 — Usage Metering
- **ملفات:** `migrations/e30_usage_*`, `usage.js` (تسجيل + rollup)، تنبيه 80%/100%.
- **مخاطر:** أداء التسجيل (لا يبطئ المسارات)، دقّة العدّ.
- **اختبارات:** فرض الحدود، التجميع الدوري.
- **rollback:** down migration.
- **بوابة:** عدّ دقيق + فرض حدّ + تنبيه.

## الدفعة 8 — Admin Dashboard (احترافي)
- **ملفات:** `public/dashboard/*` (RTL، KPIs، رسوم، جداول)، تحسينات app.js.
- **مخاطر:** تهريب المخرجات (XSS)، CSP، الأداء.
- **اختبارات:** Playwright smoke، فحص بصري، a11y أساسي.
- **rollback:** ملفات ثابتة (استبدال فوري).
- **بوابة:** يعرض بيانات حيّة بلا أخطاء console، RTL سليم.

## الدفعة 9 — Public Website SEO/GEO
- **ملفات:** صفحات عامة + Schema.org + llms.txt + sitemap.xml + robots.txt + meta ثنائية اللغة.
- **مخاطر:** فهرسة صفحات التطبيق (noindex على /app).
- **اختبارات:** تحقّق Schema، روابط، lighthouse/CWV.
- **rollback:** ملفات ثابتة.
- **بوابة:** صفحات مكتملة + بيانات منظّمة صحيحة. راجع [[jumanasoft-seo-geo-growth]] و PHASE 5.

## الدفعة 10 — Observability & Deployment
- **ملفات:** مقاييس/تنبيهات، تنظيف TTL لـ `idempotency_keys`/`usage`, توثيق نشر.
- **مخاطر:** ضجيج تنبيهات، تكلفة.
- **اختبارات:** فحص صحّة، إنذارات تجريبية.
- **rollback:** علم تعطيل المراقبة.
- **بوابة:** صحّة + تنبيهات تعمل + ضبط تكلفة موثّق. راجع [[jumanasoft-observability-deployment]].

## شروط عبور كل دفعة (موحّدة)
1. اختبارات وحدة خضراء + (إن لزم) cross-tenant. 2. `node --check`. 3. تحقّق DDL معزول (G9).
4. لا أسرار/لا force push/لا حذف بيانات. 5. نشر بإذن صريح + نسخة احتياطية + rollback + فحص صحّة.

## قرار البوابة (PHASE 4)
- ✅ **PASS** — خطة دفعات كاملة بمخاطر/اختبارات/rollback/بوابات، بلا تنفيذ كود. ننتقل إلى PHASE 5.
