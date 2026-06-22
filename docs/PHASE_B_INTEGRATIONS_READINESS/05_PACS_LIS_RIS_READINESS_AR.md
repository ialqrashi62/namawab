# Phase B — جاهزية PACS و LIS/RIS

> Discovery فقط. لا اتصال أجهزة/PACS، لا كود، لا DDL.

## PACS (أرشفة وتواصل الصور)
- **Integration**: PACS عبر DICOM (C-STORE/C-FIND/WADO) + Modality Worklist (MWL).
- **Current implementation**: **لا يوجد اتصال PACS**. الإشارة الوحيدة لـDICOM = امتداد `.dcm/.dicom` مسموح في رفع ملف الأشعة (multer fileFilter) + تثبيت content-type — أي **تخزين ملف يدوي محمي (A3A)**، ليس تكامل شبكة DICOM.
- **Existing routes/files**: `POST /api/radiology/orders/:id/upload` + `GET /api/phi-files/:id` (A3A). لا C-STORE/WADO.
- **Existing tables**: `lab_radiology_orders` (الصور كوسوم `[IMG:/api/phi-files/:id]`)، `phi_files`.
- **Required external party**: خادم PACS / أجهزة التصوير (modalities).
- **Required credentials**: AE Title + شبكة موثوقة؛ غالباً لا اعتماد تطبيقي.
- **Required certificates**: TLS على DICOM إن طُلب.
- **Required environment variables**: `PACS_AE_TITLE/HOST/PORT` — خارج Git.
- **Requires DDL**: محتمل (ربط study/series/instance UID) — مؤجّل.
- **Requires code deploy**: نعم (مكدّس DICOM/خدمة منفصلة؛ يُفضّل خارج المونوليث).
- **Requires test sandbox**: نعم (Orthanc/dcm4che كـPACS اختباري).
- **Risk**: متوسط–عالٍ (PHI صور، أحجام كبيرة، شبكة).
- **Readiness status**: **NOT_STARTED (greenfield)**.
- **Next safe action**: (ورقي) تقييم Orthanc/dcm4che كـPACS مرجعي + WADO-RS لعرض الصور عبر المسار المحمي؛ لا كود حتى قرار المالك.

## LIS (نظام معلومات المختبر)
- **Current implementation**: طلبات/نتائج مختبر **داخلية** (`/api/lab/orders`, `/api/lab/orders/direct`, `lab_results`, `lab_samples`, `lab_tests_catalog`, `reference-ranges`) — لا واجهة أجهزة/محلّلات خارجية.
- **Required external party**: محلّلات المختبر / LIS مورّد.
- **Interface**: عادة HL7 v2 (ORM/ORU) أو ASTM — يعتمد على طبقة HL7 (التقرير 02).
- **Requires**: code deploy + sandbox (محاكي محلّل)؛ DDL محتمل (سجل رسائل). **Risk** متوسط.
- **Readiness status**: **NOT_STARTED**. **Next safe action**: تحديد بروتوكول المحلّلات المستهدفة + توجيهها عبر محرّك تكامل.

## RIS (نظام معلومات الأشعة)
- **Current implementation**: طلبات أشعة داخلية (`/api/radiology/orders`, `radiology_catalog`) + رفع صور محمي. لا MWL/RIS خارجي.
- **Interface**: HL7 (طلبات/تقارير) + DICOM MWL (قوائم عمل الأجهزة).
- **Requires**: code deploy + sandbox؛ يرتبط بـPACS وHL7. **Risk** متوسط.
- **Readiness status**: **NOT_STARTED**. **Next safe action**: ربط RIS↔PACS↔HL7 ضمن مخطّط واحد عبر محرّك التكامل.

## توصية مشتركة
PACS/LIS/RIS كلها تستفيد من **محرّك تكامل وسيط + خدمة DICOM منفصلة** بدل حشوها في `server.js`. الكل NOT_STARTED حتى اختيار المالك.
