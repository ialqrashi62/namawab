# Phase B — Channel Artifact — SBX_FHIR_BUNDLE_IN

> artifact قابل للاستيراد في Mirth (sandbox). loopback، dummy، بلا PHI/شهادات.

## الملف
`tools/mirth-sandbox/SBX_FHIR_BUNDLE_IN.channel.xml`

## الخصائص الأساسية
- **Source**: HTTP Listener على `127.0.0.1:6663` مسار `/sbx/fhir-bundle`، استجابة `application/fhir+json`.
- **Filter**: قاعدة JS تقبل فقط `resourceType==='Bundle' && type==='transaction'`.
- **Destination**: HTTP Sender → `http://127.0.0.1:8090/fhir` (HAPI المحلي)، POST، `Content-Type: application/fhir+json`، المحتوى = الرسالة الخام.
- **Queue/Retry**: queueEnabled + retryCount=3 (محدود).
- **Scripts**: pre/post بلا PHI (audit metadata فقط).

## الاستيراد (إجراء مالك لاحق، بمصادقة admin)
1. تشغيل Mirth loopback (image cached): `docker compose -f tools/mirth-sandbox/docker-compose.candidate.yml up -d`.
2. الدخول لواجهة admin (loopback) واستيراد `SBX_FHIR_BUNDLE_IN.channel.xml`.
3. ضبط `Destination host` على HAPI المحلي، تفعيل القناة.
4. إرسال Bundle تجريبي إلى `127.0.0.1:6663/sbx/fhir-bundle` والتحقّق من transaction-response في HAPI.

## ملاحظة توافق
schema قناة Mirth يختلف بين الإصدارات؛ يُراجَع/يُعدّل الـXML عند الاستيراد ضد نسخة Mirth الفعلية. منطق القناة (filter/forward/DLQ/retry) مُثبت عبر `channel_relay.js` مقابل HAPI الحقيقي (7/7).

```text
CHANNEL_NAME: SBX_FHIR_BUNDLE_IN
CHANNEL_IMPORT_STATUS: CANDIDATE_READY_PENDING_OWNER_ADMIN_AUTH (XML import-ready; deploy needs Mirth admin auth — not bypassed)
ARTIFACT: tools/mirth-sandbox/SBX_FHIR_BUNDLE_IN.channel.xml
```
