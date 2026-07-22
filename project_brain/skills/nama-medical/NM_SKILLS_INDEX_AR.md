# NM_SKILLS_INDEX — فهرس Skill Pack المراحل المتبقية (NamaMedical)

> استشهد بهذه المهارات بدل تكرار القواعد في البرومنتات. **فعّل دائماً `NM_GLOBAL_GATES`** + المهارة الخاصة بالبوابة.

| Skill | الغرض | متى يُفعَّل | عمليات محظورة | حقول الإغلاق المتوقّعة |
|---|---|---|---|---|
| **NM_GLOBAL_GATES** | القواعد الدائمة + Gate 0 baseline + نمط النشر/Git | **كل بوابة** | force push · طباعة أسرار/مفاتيح · env/keys/PHI في git · merge R17 | FINAL_STATUS · PRODUCTION_CHANGES · ACCOUNTING(OFF) · JOURNAL(0) · GIT_PUSH(FF) · NEXT |
| **NM_SECURITY_DR_KEY_MANAGEMENT** | KEK/escrow/Vault/KMS/تشفير/DR | بوابات المفاتيح/التشفير/النسخ | طباعة KEK/DPAPI blob · re-wrap إنتاجي بلا بنية+موافقة · ALTER عشوائي | KEY_MODEL · KEK_PROVIDER · REHEARSAL_STATUS · RESTORE_IMPLICATIONS |
| **NM_INTEGRATION_SANDBOX** | قواعد كل sandbox تكامل | أي container/sandbox | تعريض عام · PHI · سحب صورة بلا موافقة · ربط إنتاجي | CONTAINER_STATUS · LOOPBACK_ONLY · TEARDOWN_STATUS · regression |
| **NM_FHIR_HAPI** | تحويل/إدخال FHIR R4 على HAPI | بوابات FHIR/D2 | PHI حقيقي · NPHIES calls · كتابة بلا transaction | TRANSACTION_RESULT · READ_BACK · REFERENCE_INTEGRITY |
| **NM_MIRTH_NEXTGEN** | قنوات Mirth/HL7/FHIR | بوابات Mirth/D1 | تجاوز admin auth · endpoints خارجية · PHI | CHANNEL_IMPORT_STATUS · END_TO_END · DLQ |
| **NM_ORTHANC_PACS** | PACS/DICOM (Orthanc) | بوابات PACS/D5 | بايتات/صور DICOM حقيقية · تعريض المتصفّح · معرّفات حقيقية | ORTHANC_STATUS · DUMMY_DICOM · A3A_MODEL |
| **NM_ZATCA_PHASE2** | الفوترة ZATCA Phase 2 | بوابات ZATCA | CSR/OTP/شهادة حقيقية · اتصال ZATCA بلا موافقة | ZATCA_PHASE2_STATUS · CSR_GENERATED(NO) · ZATCA_CALLS(NO) |
| **NM_NPHIES** | تكامل NPHIES | بوابات NPHIES/تأمين خارجي | شهادة حقيقية · اتصال NPHIES · PHI حقيقي | NPHIES_STATUS · REAL_CERT(NO) · NPHIES_CALLS(NO) |
| **NM_CLINICAL_ADVANCED** | الميزات السريرية المتقدمة | بوابات Phase C | أتمتة قرار سريري إنتاجي غير مختبَر · PHI حقيقي | PHASE_C_STATUS · REAL_PHI(NO) · NEXT_GATE |
| **NM_OBSERVABILITY_OPS** | التشغيل/المراقبة/التعافي | بوابات Phase D ops | أسرار في السجلّات · تغيير app/DB | DOCKER_DAEMON_RECOVERY · WATCHDOG · REDIS_NATIVE |
| **NM_FINANCE_ACCOUNTING_GUARD** | حارس المحاسبة | أي بوابة مالية | تفعيل posting · توليد journal · بلا موافقة صريحة | ACCOUNTING(OFF) · JOURNAL(0) · FINANCE_STATUS |
| **NM_GOVERNANCE_CLOSEOUT** | نظافة الإغلاق/التقارير | نهاية كل بوابة | mojibake · ملفات خارج النطاق · non-FF | hygiene + حقول الإغلاق القياسية |
| **NM_STITCH_STATIONS** | 28 محطة Stitch لـ 28 تخصص سريري (Stitch Google) + 18 حاسبة سريرية | تفعيل E2 stations + calculators | فتح مختبرات بأسماء خاطئة · تعريض PHI · طباعة نتائج calculator | STATIONS_LOADED=30/30 · CALCULATOR_TESTS=69/69 · ENDPOINTS=19/19 · RLS_OK |

## E2 — Stitch Stations + Clinical Calculators (محدّثة 2026-07-22)
- **28 محطة متخصصة**: `anesthesia`, `cardiology`, `cardiothoracic`, `critical`, `derm`, `diagnostics`, `endocrinology`, `ent`, `er`, `functional-tests`, `gastroenterology`, `general-surgery`, `icu`, `infectious`, `lab`, `nephrology`, `neurosurgery`, `nicu`, `obgyn-peds`, `oncology`, `ophthalmology`, `orthopedics`, `pacu`, `plastic-surgery`, `pulmonology`, `radiology`, `rheumatology`, `urology`. كل واحدة بصيغة `Station.render(patientId)`.
- **18 حاسبة REST API** على `/api/calculators/` (`GET /` + 18 POST): TBSA Rule of Nines, Parkland, APGAR, GCS, Aldrete, ESI, IOL SRK/T, Child-Pugh, MELD, CHA₂DS₂-VASc, HAS-BLED, CURB-65, qSOFA, Wells DVT, Centor, ROM, EWS, CPB. كلها pure deterministic engines في `namaweb/clinical_calculators.js`.
- **Migration plan**: `docs/E2_STITCH_STATIONS_MIGRATION_PLAN.md` — 15 candidate migration files (e70–e84) للـ persistence layer.

## التفعيل النموذجي
`NM_GLOBAL_GATES` + `NM_GOVERNANCE_CLOSEOUT` (دائماً) + المهارة الخاصة بالبوابة (+ `NM_INTEGRATION_SANDBOX` لأي container).

## الحالة المرجعية (محدّثة 2026-07-22)
A1/A2/A3A/A3(DPAPI) منشورة · Phase B sandboxes (D2/D1/D5 + HAPI transaction + Mirth relay) مُثبتة محلياً · Vault/KMS المرحلة 2 candidate · KEK escrow + Redis-native معلّقان (مالك). FORCE_RLS=150 · accounting OFF · journal 0 · R17 سليمة. **E2 stations**: 30/30 station files محمّلة، 28/28 موصولة في routing-patch، NAV_ITEMS 48-75 مُضافة. **Clinical calculators**: 18 engine + 19 REST endpoint، 69/69 tests PASS. Migration plan (e70-e84) مُعدّ معلّق.
