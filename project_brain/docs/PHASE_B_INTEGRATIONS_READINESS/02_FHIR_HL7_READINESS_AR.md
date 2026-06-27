# Phase B — جاهزية FHIR و HL7 v2

> Discovery فقط. لا استدعاء endpoints حقيقية، لا كود، لا DDL.

## FHIR (R4)
- **Integration**: FHIR R4 (تبادل موارد Patient/Encounter/Observation/DiagnosticReport/MedicationRequest…).
- **Current implementation**: **لا يوجد** (0 إشارة). البيانات الإكلينيكية في جداول علائقية داخلية بلا تمثيل FHIR.
- **Existing routes/files**: لا شيء خاص بـFHIR. (المصادر المحتملة للتحويل: `patients`, `medical_records`, `lab_*`, `radiology_*`.)
- **Existing tables**: لا جداول FHIR. تُبنى طبقة تحويل (mapping) من الجداول الحالية.
- **Required external party**: المستهلك (HIE/بوابة/تطبيق) أو NPHIES (الذي يَستخدم FHIR KSA profiles).
- **Required credentials**: OAuth2 client (client_id/secret) أو mTLS حسب الطرف.
- **Required certificates**: شهادة TLS للطرف؛ mTLS إن طُلب.
- **Required environment variables**: `FHIR_BASE_URL`, `FHIR_AUTH_*` (خارج Git).
- **Requires DDL**: محتمل (جداول mapping/معرّفات FHIR، أو عمود fhir_id) — مؤجّل.
- **Requires code deploy**: نعم (طبقة موارد + serializer + auth).
- **Requires test sandbox**: نعم (خادم FHIR اختباري / HAPI FHIR).
- **Risk**: متوسط (تعقيد نمذجة + خصوصية PHI عبر الشبكة).
- **Readiness status**: **NOT_STARTED (greenfield)**.
- **Next safe action**: تصميم mapping للموارد الأساسية (Patient/Observation) كمرشّح ورقي + إعداد HAPI FHIR sandbox محلي للتجربة (بلا PHI حقيقي).

## HL7 v2.x
- **Integration**: HL7 v2 (ADT/ORM/ORU) عبر MLLP — التكامل التقليدي مع أنظمة المختبر/الأشعة/الأجهزة.
- **Current implementation**: **لا يوجد** (0 إشارة، لا parser، لا MLLP listener).
- **Existing routes/files**: لا شيء. (الأنسب: محرّك تكامل وسيط — انظر Mirth في التقرير 07.)
- **Existing tables**: لا شي; الطلبات الداخلية في `lab_radiology_orders`/`lab_results`.
- **Required external party**: نظام LIS/RIS/جهاز يرسل/يستقبل HL7.
- **Required credentials**: عادة شبكة موثوقة (VPN/IP allowlist) بدل اعتماد تطبيقي.
- **Required certificates**: TLS على MLLP (MLLPS) إن طُلب.
- **Required environment variables**: `HL7_MLLP_HOST/PORT`, allowlist — خارج Git.
- **Requires DDL**: محتمل (سجل رسائل/مخرجات) — مؤجّل.
- **Requires code deploy**: نعم (parser + MLLP + mapping).
- **Requires test sandbox**: نعم (محاكي HL7 / Mirth channel اختباري).
- **Risk**: متوسط (موثوقية الرسائل، ترتيب، إعادة المحاولة).
- **Readiness status**: **NOT_STARTED (greenfield)**.
- **Next safe action**: تقييم محرّك تكامل وسيط (Mirth/NextGen Connect) كمضيف لقنوات HL7 بدل بنائها داخل المونوليث — مرشّح في التقرير 07.

## توصية مشتركة
FHIR/HL7 يُفضّل تنفيذهما عبر **محرّك تكامل وسيط** معزول عن `server.js` (يقلّل سطح الخطر على التطبيق الإنتاجي ويوفّر إعادة المحاولة/التتبّع). يبقى كل ذلك NOT_STARTED حتى يختار المالك المرشّح الأول.
