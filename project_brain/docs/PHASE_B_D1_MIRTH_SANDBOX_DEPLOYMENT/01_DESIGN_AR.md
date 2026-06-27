# Phase B D1 — Mirth Sandbox Deployment — التصميم

> 2026-06-23 | محرّك تكامل محلي معزول. **لا PHI، لا شهادات، لا endpoints خارجية، لا ربط إنتاجي، لا تعريض عام.** تشغيل Mirth الفعلي = candidate (سحب الصورة = استدعاء خارجي مُنع في هذه البوابة)؛ نُفِّذ محاكي قنوات محلي بدلاً عنه.

## وضع التنفيذ المختار
- **Mirth الفعلي**: `tools/mirth-sandbox/docker-compose.candidate.yml` — جاهز لكن **غير مُشغَّل** (سحب الصورة من registry = شبكة خارجية، يخالف NO_EXTERNAL_CALLS). منافذه loopback فقط (`127.0.0.1:8443`/`6661`)، بلا شهادات/PHI، restart: no، تخزين Derby مدمج، تراجع `down -v`.
- **منفّذ الآن (آمن، بلا شبكة)**: `tools/mirth-sandbox/channel_sim.js` — محاكي تدفّق قنوات محلي يحاكي نموذج Mirth (استقبال→تحويل→توجيه→DLQ + retry + audit) باستخدام dummy من D2، يكتب لـtmp ويُنظّف، مع tripwire يمنع أي خروج شبكي.

## الطوبولوجيا
```
[tools/fhir-sandbox dummy bundle] --in-process--> [channel_sim]
   SBX_FHIR_BUNDLE_IN -> transform -> out/
   SBX_HL7_ADT_IN (ADT^A01 dummy) -> ACK -> out/
   malformed -> SBX_DLQ -> dlq/
   transient fail -> SBX_RETRY -> delivered
   كل الأحداث -> audit/channel.log (بلا PHI)
```
loopback/in-process فقط؛ لا منفذ خارجي؛ لا DB؛ لا شبكة.

## القنوات الوهمية
`SBX_FHIR_BUNDLE_IN` · `SBX_HL7_ADT_IN` · `SBX_DLQ` (dead-letter) · `SBX_RETRY` · سجلّ تدقيق. بادئة `SBX_` تميّز الـsandbox.

## الربط مع D2
يستهلك `buildBundle(fixtures)` من `tools/fhir-sandbox/` كبيانات dummy فقط — لا DB، لا PHI، لا شبكة، لا route إنتاجي.

## نموذج الأسرار/الشهادات
لا أسرار/شهادات في الـsandbox أو Git؛ أي mTLS/توقيع لاحق (NPHIES) عبر نموذج المفاتيح (المرحلة 2 Vault/HSM) بالمرجع.

## أنماط الفشل + الطابور
at-least-once + idempotency؛ فشل عابر → retry (حتى maxRetry) → تسليم أو DLQ؛ رسالة مشوّهة → DLQ + audit؛ عزل المحرّك يحمي التطبيق.
