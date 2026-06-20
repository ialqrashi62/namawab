# P1 fail-closed — 03 التحقق من الإنتاج (Production Verification)

> التاريخ: 2026-06-20 | بعد ضبط facility_type=large_hospital ونشر كود fail-closed. read-only.

## 1. HTTP حيّ
| الطلب | النتيجة | الدلالة |
| ----- | ------- | ------- |
| `/api/health` | 200 `{"status":"UP"}` | الصحة سليمة |
| HTTP→HTTPS | 301 | التوجيه سليم |
| `/api/patients` (بلا جلسة) | 401 | طبقة المصادقة سليمة (الحارس يُمرّر بلا سياق ثم auth يمنع) |
| `POST /api/auth/login` (بيانات خاطئة) | 401 | الدخول لا ينكسر |

## 2. عدم كسر المستأجر الإنتاجي (الأهم)
- نوع المنشأة الفعلي على الإنتاج الآن: **`large_hospital`** (`'*'`).
- فحص الحارس المنشور للمسارات الحساسة: **12/12 مسموحة** (patients/EMR/admissions/icu/pharmacy/lab/radiology/invoices/finance/inventory/reports/blood-bank) → **لا كسر للتشغيل**.

## 3. تفعيل fail-closed (عبر الكود المنشور، read-only)
| الفحص | النتيجة | المتوقع |
| ----- | ------- | ------- |
| missing + مسار حساس | 403 | 403 ✓ |
| unknown facility type | 422 | 422 ✓ |
| read-error + مسار حساس | 403 | 403 ✓ |
| read-error + مسار عام | 200 | 200 ✓ |
| pharmacy_only + /api/lab (تجاوز) | 403 | 403 ✓ |

## 4. عدم تراجع RLS P0
- `patients`: no-context=**0** / tenant1=**3** / tenant999=**0** → **INTACT** ✓.
- آلية app.tenant_id / pool.query / pool.connect سليمة.

## 5. Redis/الجلسات
- `redis-cli ping` = **PONG** ؛ مفاتيح الجلسات = **88** (نشطة، لا تراجع MemoryStore).

## 6. تحقق 403 الحيّ لمستأجر مقيّد
- **غير متاح بدون تغيير بيانات إضافي**: لا يوجد مستأجر مقيّد في الإنتاج (مستأجر واحد = large_hospital). لم أُنشئ مستأجراً مقيّداً ولم أغيّر المستأجر الأساسي لنوع مقيّد لغرض الاختبار (التزام القواعد).
- البديل المُنفَّذ: فحوص قرار الكود المنشور (read-only) + فحص التجاوز المباشر + الاختبارات الآلية (50/50 + 41/41).

## الخلاصة
الإنفاذ fail-closed منشور وفعّال؛ المستأجر الإنتاجي يعمل بكامل موديولاته (large_hospital) دون كسر؛ المسارات الحساسة لم تعد permissive عند missing/unknown/read-error؛ RLS P0 سليم؛ Redis نشط.

`PRODUCTION_VERIFICATION_COMPLETE`
