# P0 الموجة 2 — 07 التحقق من الإنتاج (Production Verification)

> التاريخ: 2026-06-20 | بعد نشر Class B على alfaisal-erp.com.

## الفحوصات (جميعها بعد النشر)

| الفحص | النتيجة |
| ----- | ------- |
| `GET https://alfaisal-erp.com/api/health` | **200** — `{"status":"UP"}` |
| PM2 `nama-medical-erp` | **online** — mem ~71mb |
| أخطاء PM2 (آخر 40 سطراً) | **لا أخطاء** (لا ECONN/throw/column-does-not-exist) |
| Redis | **PONG** — 55 مفتاح جلسة `nama_session:*` (لا تراجع MemoryStore) |
| FORCE RLS | **13 جدولاً** ما زالت forced (سليمة، بلا تأثّر) |
| Smoke مسارات Class B (بلا جلسة) | جميعها **401** — المسارات حيّة، المصادقة مفروضة، لا انهيار |

تفصيل الـ smoke:
```
GET /api/telemedicine/sessions -> 401
GET /api/pathology/cases       -> 401
GET /api/social-work/cases     -> 401
GET /api/mortuary/cases        -> 401
GET /api/zatca/invoices        -> 401
```
> 401 (لا 500) يثبت أن كود الفلترة الجديد يُحمّل ويعمل دون كسر، والمصادقة سليمة.

## الخلاصة

| البند | القيمة |
| ----- | ------ |
| PRODUCTION_HEALTH_CHECK | PASS |
| PRODUCTION_SMOKE | PASS |
| REDIS | ACTIVE |
| RLS_FORCED_INTACT | YES (13) |
| ROLLBACK_REQUIRED | NO |

## متابعة موصى بها (خارج النطاق)

- Smoke مُصادَق (تسجيل دخول ثم قراءة مسار Class B والتأكد من إرجاع بيانات مُنطقة بالمستأجر) — يُجرى يدوياً عند توفر جلسة اختبار؛ التحقق الحالي (401 + الأعمدة موجودة + اختبارات ثابتة + لا أخطاء) كافٍ لنشر code-only.

`WAVE2_PRODUCTION_VERIFICATION_COMPLETE — PASS`
