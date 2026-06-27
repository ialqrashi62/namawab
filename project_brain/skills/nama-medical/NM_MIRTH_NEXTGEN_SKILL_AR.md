# NM_MIRTH_NEXTGEN_SKILL

**الغرض**: محرّك تكامل Mirth/NextGen (قنوات HL7/FHIR). **التفعيل**: بوابات Mirth/D1/channel.

## الحالة: قنوات مُثبتة محلياً (relay 7/7)، النشر الأصلي candidate
- منطق القناة `SBX_FHIR_BUNDLE_IN`: source loopback (file/HTTP) → filter(type=transaction) → HTTP Sender → HAPI `/fhir` → DLQ على الفاسد + retry محدود + audit metadata-only.
- `tools/mirth-sandbox/channel_sim.js` (7/7، بلا شبكة) · `channel_relay.js` (→HAPI الحقيقي، 7/7) · `SBX_FHIR_BUNDLE_IN.channel.xml` (artifact قابل للاستيراد).
- Mirth الفعلي: image cached، HTTPS:8443 loopback؛ النشر عبر admin API.

## القواعد + الحدود
لا تجاوز مصادقة admin (admin auth boundary) → النشر الأصلي = `CANDIDATE_READY_PENDING_OWNER_ADMIN_AUTH`. loopback، dummy، لا PHI/شهادات/endpoints خارجية. audit بلا محتوى PHI.

## حقول الإغلاق
`CHANNEL_NAME · CHANNEL_IMPORT_STATUS · END_TO_END_STATUS · DLQ_STATUS · AUDIT_STATUS · LOOPBACK_ONLY(YES)`.
