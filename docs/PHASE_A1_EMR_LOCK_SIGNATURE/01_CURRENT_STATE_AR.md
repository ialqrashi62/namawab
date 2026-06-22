# Phase A1 — الحالة الحالية لـEMR (Current State)

> 2026-06-22 | اكتشاف قراءة-فقط. لا تغيير.

## الهدف/النطاق/المنهجية
حصر جداول/مسارات السجل الطبي وحالة القفل/التوقيع الحالية. استبطان `information_schema` + grep لمسارات UPDATE/DELETE.

## الأدلة (حيّ)
- كل الجداول السريرية تحمل `tenant_id` + FORCE RLS، و**كلها فارغة (0 صف)** في الإنتاج (نشر تجريبي/غير-PHI) ⇒ إضافة أعمدة قفل/توقيع **إضافية آمنة بلا backfill ولا خطر PHI**.

## الجدول التفصيلي
| الجدول | صفوف | حقول قفل/توقيع حالية | tenant_id | RLS | يمكن update | يمكن delete | المخاطر | التوصية |
|---|---|---|---|---|---|---|---|---|
| medical_records | 0 | **NONE** | Y | FORCE | عبر مسارات طبيب | لا مسار delete مباشر | لا قفل ⇒ تعديل غير محكوم | أضف lock/signature |
| medical_records_coding | 0 | status | Y | FORCE | نعم | — | status عام لا قفل | أضف lock |
| nursing_assessments | 0 | NONE | Y | FORCE | نعم | — | لا قفل | أضف lock |
| nursing_care_plans | 0 | status | Y | FORCE | نعم | — | status لا يقفل | أضف lock |
| medical_reports | 0 | fitness_status | Y | FORCE | نعم | — | لا قفل | أضف lock |
| medical_certificates | 0 | NONE | Y | FORCE | نعم | — | لا قفل | أضف lock |
| surgery_anesthesia_records | 0 | NONE | Y | FORCE | نعم | — | لا قفل | أضف lock |
| icu_monitoring | 0 | NONE | Y | FORCE | نعم | — | لا قفل | أضف lock (اختياري) |
| emergency_trauma_assessments | 0 | NONE | Y | FORCE | نعم | — | لا قفل | أضف lock (اختياري) |
| medical_records_requests | — | status (workflow طلبات) | Y | FORCE | نعم (Delivered/Returned) | — | منفصل عن قفل السجل | لا يحتاج قفل |

## الفجوة
لا توجد آلية قفل/توقيع/finalization على أي سجل سريري؛ التعديل بعد الاعتماد ممكن دون توثيق amendment.

## 6-12
المتطلبات: حالة draft→signed→locked + توقيع + amendments + audit. الأولوية: P0 (امتثال CBAHI/قانوني). المخاطر: حالياً تعديل صامت بعد الاعتماد. توصيات: تصميم Gate 2 + candidate Gate 3 + rehearsal. Acceptance: حُصرت كل الجداول الحرجة (✅). Next: 02 Design.
