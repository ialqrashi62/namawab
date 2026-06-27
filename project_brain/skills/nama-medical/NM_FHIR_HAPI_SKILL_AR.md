# NM_FHIR_HAPI_SKILL

**الغرض**: تحويل/إدخال FHIR R4 على HAPI محلي. **التفعيل**: بوابات FHIR/HAPI/D2.

## الحالة: COMPLETED (محلي، dummy)
- المابر `tools/fhir-sandbox/mappers.js`: Patient · Encounter · Observation · DiagnosticReport · MedicationRequest · Claim. صور التقرير = مرجع محمي `/api/phi-files/:id` (لا بايتات).
- `$validate` على HAPI = 200 (FHIR R4 صالح). transaction ingest = `tools/fhir-sandbox/transaction_bundle.js` (urn:uuid + POST + reference rewrite) → 10/10 entries 201 + read-back 200 + reference integrity. test: `hapi_transaction_test.js` (7/7).
- HAPI loopback `127.0.0.1:8090`، image cached، teardown بعد.

## القواعد
الكتابة المفردة تفشل (HAPI referential integrity) → استخدم transaction Bundle (urn:uuid). dummy فقط، loopback، NO real PHI، NO NPHIES calls. HAPI base يجب أن يكون 127.0.0.1/localhost (الـtest يرفض غيره).

## حقول الإغلاق
`HAPI_STATUS · TRANSACTION_RESULT · READ_BACK_STATUS · REFERENCE_INTEGRITY · REAL_PHI_USED(NO) · EXTERNAL_HEALTHCARE_CALLS(NO) · LOOPBACK_ONLY(YES)`.
