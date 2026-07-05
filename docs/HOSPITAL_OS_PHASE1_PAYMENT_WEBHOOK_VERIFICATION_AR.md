# تقرير Phase 1 - إغلاق تحقق Webhooks الدفع

التاريخ: 2026-07-03
الحالة: PHASE1_PAYMENT_WEBHOOK_VERIFICATION_PASS_STATIC_DB_TESTS_BLOCKED

## 1. التقرير التنفيذي

تم إغلاق الخطر المتبقي من موجة المسارات عالية الخطورة والمتعلق بـ external payment webhooks. لم يتم وضع `requireAuth` على webhooks لأنها لا تأتي من جلسة مستخدم داخلية، وتم بدلا من ذلك إضافة حارس توقيع `verifyBillingWebhookSignature`.

الحارس الجديد:

- يفشل مغلقا في الإنتاج أو عند تفعيل `REQUIRE_BILLING_WEBHOOK_SIGNATURE=true`.
- يستخدم HMAC-SHA256 مع `MOYASAR_BILLING_WEBHOOK_SECRET` أو `STRIPE_BILLING_WEBHOOK_SECRET` أو fallback عام `BILLING_WEBHOOK_SECRET`.
- يقارن التوقيع عبر `crypto.timingSafeEqual`.
- يقبل تواقيع headers مثل `x-nama-webhook-signature`, `{provider}-signature`, `x-webhook-signature`, `x-hub-signature-256`.
- يتحقق من `tenant_id` و`plan_key` قبل تعيين الخطة.

## 2. Gates

| Gate | النتيجة | الملاحظة |
|---|---|---|
| GATE 0 | PASS | استكمال خطر webhooks المتبقي |
| GATE 1 | PASS | فحص حالة العمل دون لمس خارج النطاق المقصود |
| GATE 2 | PASS | تحديد webhooks الخاصة بـ Moyasar وStripe |
| GATE 3 | PASS | إصلاح backend code-only دون DDL |
| GATE 4 | PASS | لا تغيير في workflow الطبي |
| GATE 5 | PASS | لا UI ولا Stitch مطلوب |
| GATE 6 | PASS | إضافة static assertions في Gate test |
| GATE 7 | PASS | الفحوصات الآمنة نجحت |
| GATE 8 | BLOCKED | DB/server tests مؤجلة لبيئة معزولة |

## 3. الملفات المعدلة

| الملف | التغيير |
|---|---|
| `namaweb/server.js` | إضافة `verifyBillingWebhookSignature` و`validateWebhookTenantPlan` وربطهما بـ Moyasar/Stripe billing webhooks |
| `namaweb/hospital_os_gate_static_test.js` | إضافة assertions تمنع webhooks غير موقعة أو assignment مباشر غير متحقق |
| `docs/HOSPITAL_OS_PHASE1_PAYMENT_WEBHOOK_VERIFICATION_AR.md` | تقرير هذه الموجة |

## 4. Test Results

| الأمر | النتيجة |
|---|---|
| `node --check server.js` | PASS |
| `node --check hospital_os_gate_static_test.js` | PASS |
| `node hospital_os_gate_static_test.js` | PASS |
| `npm run test:safe` | PASS: 111 passed, 0 failed |
| DB/server tests | BLOCKED_DB_TEST_ENV_REQUIRED: 58 skipped |

## 5. المخاطر المتبقية

| الخطر | الحالة |
|---|---|
| تشغيل webhook فعلي ضد provider/raw body | يحتاج staging/provider integration test |
| DB/server validation | يحتاج DB معزولة |
| إعداد secrets في الإنتاج | يجب ضبط env vars دون طباعتها |
| Production Deploy | لم يتم تنفيذه |

## 6. القرار النهائي

PASS_STATIC_DB_TESTS_BLOCKED

تم إغلاق خطر webhooks static/code-only. لا يوجد Production Deploy، ولا DDL، ولا Migration، ولا DB write، ولا UI.
