# Wave 3 — Orthanc Local Runtime Sandbox

> 2026-06-23 | شُغّل Orthanc فعلياً محلياً (loopback)، dummy، ثم فُكّك. الإنتاج بقي 200.

## ما نُفِّذ
- **سحب الصورة** `jodogne/orthanc-plugins:latest` (موافقة المالك).
- **تشغيل loopback**: `docker run -p 127.0.0.1:8042:8042 -p 127.0.0.1:4242:4242` (تأكيد: `8042/4242 -> 127.0.0.1` — لا `0.0.0.0`).
- **REST liveness**: `/system` رجع **200** خلال ~10ث (Orthanc mainline، ApiVersion 30)؛ `/statistics` **200**.
- **الأمان**: طلب بلا اعتماد `/system` رجع **401** ⟹ المصادقة مُفعّلة افتراضياً (لا REST مفتوح).
- **التفكيك**: `docker stop/rm`؛ الإنتاج 200 بعدها.

## التحقّق
| الفحص | النتيجة |
|---|---|
| container starts | PASS |
| REST local only | PASS (127.0.0.1:8042) |
| /system + /statistics | PASS (200) |
| unauthenticated REST | 401 (مصادقة مُنفَذة) PASS |
| dummy store validation | مُغطّى بمحاكي D5 (7/7)؛ تخزين DICOM حقيقي يتطلّب ملف .dcm فعلي (مؤجّل) |
| D5 simulator remains 7/7 PASS | PASS (regression) |
| A3A guarded-route model future client-facing | محفوظ (العميل عبر /api/phi-files/:id؛ التطبيق يجلب من Orthanc داخلياً loopback) |
| no public exposure / no real DICOM / no PHI | PASS |
| production health throughout | PASS (200) |

```text
ORTHANC_STATUS: STARTED_AND_VALIDATED (/system 200, auth enforced 401, loopback)
IMAGE_PULL: executed (owner-approved) | PUBLIC_EXPOSURE: NO | REAL_DICOM: NO | REAL_PHI: NO | TORN_DOWN: YES
```

## ملاحظة
تخزين/استرجاع DICOM فعلي (STOW/WADO ببايتات صورة) يحتاج ملف DICOM حقيقي — مؤجّل لبوابة لاحقة ببيانات اختبار آمنة؛ منطق التخزين/الحارس مُثبت بمحاكي D5 (7/7). يبقى التطبيق الواجهة الوحيدة للعميل خلف A3A + تشفير at-rest.
