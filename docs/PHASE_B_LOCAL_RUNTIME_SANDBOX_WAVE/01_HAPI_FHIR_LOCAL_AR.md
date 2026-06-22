# Wave 1 — HAPI FHIR Local Server (runtime sandbox)

> 2026-06-23 | شُغّل HAPI FHIR فعلياً محلياً (loopback)، dummy فقط، ثم فُكّك. الإنتاج بقي 200 طوال الوقت.

## ما نُفِّذ
- **سحب الصورة** `hapiproject/hapi:latest` (موافقة المالك لهذه البوابة فقط).
- **تشغيل loopback**: `docker run -p 127.0.0.1:8090:8080` (تأكيد الربط: `8080/tcp -> 127.0.0.1:8090` — لا `0.0.0.0`).
- **الإقلاع**: `/fhir/metadata` رجع **200** خلال ~30 ثانية (الخادم حيّ، CapabilityStatement محلي).
- **تحقّق الصحّة (FHIR validator الرسمي عبر `$validate`)**: مورد Observation المُولَّد من المابر رجع **200** ⟹ المابر يُنتج **FHIR R4 صالحاً**.
- **الكتابة (POST/PUT/transaction)**: رجعت 400 بسبب **إنفاذ HAPI للتكامل المرجعي/التحقّق عند الكتابة** (`HAPI-1094: Resource Organization/tenant-1 not found`) — سلوك إعداد الخادم، وليس خطأ في المابر (الذي يجتاز `$validate`). المسار الصحيح للإدخال الحقيقي = transaction Bundle مع conditional create أو إنشاء الـOrganizations أولاً، أو تخفيف RI في الـsandbox.
- **التفكيك**: `docker stop/rm`؛ الإنتاج 200 بعدها.

## التحقّق
| الفحص | النتيجة |
|---|---|
| server starts | PASS (metadata 200 ~30s) |
| metadata endpoint local only | PASS (127.0.0.1:8090) |
| dummy resource VALID (validation documented) | PASS (`$validate` 200 على Observation) |
| dummy write accepted | موثّق: 400 بسبب HAPI referential-integrity (ليس عيب مابر؛ يلزم transaction/RI-config) |
| no external calls except approved image pull | PASS |
| no real PHI | PASS (dummy؛ ids 9001/9002) |
| loopback-only / no public exposure | PASS |
| production health throughout | PASS (200) |

```text
HAPI_STATUS: STARTED_AND_VALIDATED (metadata 200 + $validate 200); write needs HAPI RI/transaction config (documented)
IMAGE_PULL: executed (owner-approved) | PUBLIC_EXPOSURE: NO | REAL_PHI: NO | TORN_DOWN: YES
```

## ملاحظة للتنفيذ الفعلي لاحقاً
استيراد البيانات إلى HAPI عبر **transaction Bundle** (مع `request.method` + `fullUrl` + conditional references) أو إنشاء موارد Organization المرجعية أولاً، أو ضبط إعداد HAPI (تعطيل referential integrity في الـsandbox). المابر نفسه صالح (مثبت بـ`$validate`).
