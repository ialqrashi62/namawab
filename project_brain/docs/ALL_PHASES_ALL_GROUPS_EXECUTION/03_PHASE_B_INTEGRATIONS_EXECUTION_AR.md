# Phase B Integrations — تنفيذ وتصنيف

> sandbox فقط، لا استدعاء خارجي، لا شهادات حقيقية، لا PHI حقيقي.

| البند | الإجراء | التصنيف | مالك | مفتاح/شهادة | خارجي | DDL | نشر | PHI | مخاطرة | البوابة |
|---|---|---|---|---|---|---|---|---|---|---|
| D1 Mirth/NextGen sandbox deploy | تقييم معماري مكتمل (SAFE_WAVE/02) | CANDIDATE_READY | نعم | لا | لا(محلي) | لا | نعم(خدمة معزولة) | لا | منخفضة | APPROVE_PHASE_B_D1_MIRTH_SANDBOX_DEPLOYMENT |
| D2 FHIR local sandbox code | candidate + mapping مكتمل (SAFE_WAVE/03) | CANDIDATE_READY | نعم | لا | لا(محلي) | لا | نعم(لاحقاً) | لا(dummy) | متوسطة | APPROVE_PHASE_B_D2_FHIR_LOCAL_SANDBOX_CODE |
| D3 ZATCA Phase 2 | جاهزية مكتملة (PHASE_B/04)؛ يحتاج CSID/شهادة | BLOCKED_PENDING_KEY_OR_CERTIFICATE | نعم | نعم(CSID) | نعم(Fatoora) | محتمل | نعم | لا | عالية | APPROVE_ZATCA_PHASE2_READINESS_ONLY ثم ..._SANDBOX_AFTER_CERTS |
| D4 NPHIES | جاهزية مكتملة (PHASE_B/03)؛ يحتاج onboarding+mTLS | BLOCKED_PENDING_EXTERNAL_PARTY | نعم | نعم(mTLS) | نعم(NPHIES) | نعم | نعم | نعم | عالية | APPROVE_NPHIES_READINESS_ONLY ثم ..._SANDBOX_AFTER_CERTS |
| D5 PACS Orthanc sandbox | تقييم؛ قرار اعتماد Orthanc | CANDIDATE_READY | نعم | لا | لا(محلي) | محتمل | نعم(خدمة) | لا(dummy) | متوسطة | APPROVE_PHASE_B_D5_ORTHANC_PACS_SANDBOX |
| D6 LIS/RIS integration | تصميم عبر D1+D2 | BLOCKED_PENDING_EXTERNAL_PARTY | نعم | لا | نعم(أجهزة) | محتمل | نعم | نعم | متوسطة | يعتمد D1+D2+أجهزة |
| D7 Insurance payer | في KSA = NPHIES | BLOCKED_PENDING_EXTERNAL_PARTY | نعم | نعم | نعم(payer) | نعم | نعم | نعم | عالية | = D4 |
| D8 integration queue/retry/audit | نموذج موثّق ضمن D1 | COMPLETED_DOCS_ONLY | لا | لا | لا | لا | لا | لا | منخفضة | ضمن D1 |
| D9 integration monitoring dashboard | تصميم candidate (يبني على observability) | CANDIDATE_READY | نعم | لا | لا | لا | نعم(لاحقاً) | لا | منخفضة | ضمن observability |

## قواعد مطبّقة
لم يُجرَ أي استدعاء خارجي؛ لا شهادات؛ لا PHI. المسموح (docs/candidate/sandbox محلي بلا PHI) فقط — وكل ذلك بقي candidate حتى بوابة تنفيذ، إذ التنصيب الفعلي (Mirth/HAPI/Orthanc) خارج نطاق "وثائق آمنة" ويتطلّب موافقة بوابة.

## الخلاصة
أساس B (D1/D2/D5/D8/D9) **جاهز candidate** بلا حواجز خارجية للبدء. التنظيمي (D3 ZATCA Ph2، D4 NPHIES، D7) محجوب على مفاتيح/شهادات/طرف خارجي — جاهزيته الورقية مكتملة.
