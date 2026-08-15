-- Vector store for Patient Portal knowledge

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS patient_portal_knowledge (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  department_id INTEGER NOT NULL,
  content_chunk TEXT NOT NULL,
  embedding REAL[] NOT NULL,
  metadata JSONB,
  source VARCHAR(255),
  language VARCHAR(10) DEFAULT 'en',
  topic VARCHAR(100),
  audience VARCHAR(50) DEFAULT 'patient',
  citation_class VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pp_kn_tenant ON patient_portal_knowledge(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pp_kn_topic ON patient_portal_knowledge(topic) WHERE topic IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pp_kn_lang ON patient_portal_knowledge(language);

INSERT INTO patient_portal_knowledge (tenant_id, department_id, content_chunk, embedding, metadata, source, language, topic, audience, citation_class) VALUES
  (1, 100, 'PDPL (Personal Data Protection Law) gives patients the right to: access their data, correct inaccurate data, request erasure, restrict processing, data portability, and withdraw consent at any time. All healthcare providers must comply.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "PDPL"}', 'PDPL_2024', 'en', 'privacy', 'patient', 'Class I'),
  (1, 100, 'نظام حماية البيانات الشخصية يمنح المرضى الحق في: الوصول إلى بياناتهم، تصحيح البيانات غير الدقيقة، طلب محو البيانات، تقييد المعالجة، نقل البيانات، وسحب الموافقة في أي وقت.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "PDPL"}', 'PDPL_2024_AR', 'ar', 'privacy', 'patient', 'Class I'),
  (1, 100, 'Sehhaty is the Saudi national unified health record platform. Patients can view their medical history, lab results, medications, and allergies through Sehhaty. Healthcare providers share data with Sehhaty per CBAHI standards.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Sehhaty"}', 'NHIA_2024', 'en', 'national_integration', 'patient', 'Class I'),
  (1, 100, 'صحتي هي منصة السجل الصحي الموحد الوطني. يمكن للمرضى عرض تاريخهم الطبي ونتائج المختبر والأدوية والحساسية.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "صحتي"}', 'NHIA_2024_AR', 'ar', 'national_integration', 'patient', 'Class I'),
  (1, 100, 'Mawid is the Saudi MoH appointment booking system. Patients can book, reschedule, or cancel appointments at MoH facilities. Patient must have Absher/Nafath verified account.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Mawid"}', 'MOH_MAWID_2024', 'en', 'appointments', 'patient', 'Class I'),
  (1, 100, 'موعد هو نظام حجز المواعيد لوزارة الصحة. يمكن للمرضى حجز أو إعادة جدولة أو إلغاء المواعيد.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "موعد"}', 'MOH_MAWID_2024_AR', 'ar', 'appointments', 'patient', 'Class I'),
  (1, 100, 'Nafath is the Saudi national identity verification system. All healthcare apps must use Nafath for patient login. Biometric verification provides L3 security.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Identity"}', 'NAFATH_2024', 'en', 'identity', 'patient', 'Class I'),
  (1, 100, 'نفذ هو نظام التحقق من الهوية الوطنية السعودي. جميع تطبيقات الرعاية الصحية يجب أن تستخدم نفذ لتسجيل دخول المرضى.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Identity"}', 'NAFATH_2024_AR', 'ar', 'identity', 'patient', 'Class I'),
  (1, 100, 'Telehealth is appropriate for: routine follow-ups, medication reviews, mental health counseling, minor complaints, lab/imaging review. NOT appropriate for: chest pain, severe injuries, emergencies.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Telehealth"}', 'MOH_TELEHEALTH_2024', 'en', 'telehealth', 'patient', 'Class I'),
  (1, 100, 'التطبيب عن بعد مناسب لـ: المتابعة الروتينية، مراجعة الأدوية، الاستشارة النفسية، الشكاوى البسيطة. غير مناسب لـ: ألم الصدر، الإصابات الشديدة، الطوارئ.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Telehealth"}', 'MOH_TELEHEALTH_2024_AR', 'ar', 'telehealth', 'patient', 'Class I'),
  (1, 100, 'Critical lab results must be communicated by a clinician within 1 hour. Patients will be contacted by phone. Normal lab results are auto-disclosed after 24 hours per PDPL.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Lab Results"}', 'PDPL_CBAHI_2024', 'en', 'lab_results', 'patient', 'Class I'),
  (1, 100, 'نتائج المختبر الحرجة يجب أن يتم التواصل بها من قبل الطبيب خلال ساعة. النتائج العادية يتم الكشف عنها تلقائياً بعد 24 ساعة.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Lab Results"}', 'PDPL_CBAHI_2024_AR', 'ar', 'lab_results', 'patient', 'Class I'),
  (1, 100, 'Refill requests for controlled substances (e.g., opioids, benzodiazepines) require an in-person doctor visit and CANNOT be requested through the portal. This is per SFDA regulations.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Refills"}', 'SFDA_2024', 'en', 'medications', 'patient', 'Class I'),
  (1, 100, 'طلبات إعادة صرف الأدوية الخاضعة للرقابة تتطلب زيارة شخصية للطبيب ولا يمكن طلبها عبر البوابة.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Refills"}', 'SFDA_2024_AR', 'ar', 'medications', 'patient', 'Class I'),
  (1, 100, 'Insurance verification uses Wateen platform. Patients pay only copay if insurance is verified. Unverified patients pay full cost at point of service.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Insurance"}', 'WATEEN_2024', 'en', 'billing', 'patient', 'Class I'),
  (1, 100, 'Caregiver proxy access requires: PDPL consent document signed by both patient and caregiver, relationship verification (spouse/parent/child/sibling/legal_guardian), expiration date.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Caregiver"}', 'PDPL_2024', 'en', 'caregiver', 'patient', 'Class I'),
  (1, 100, 'FHIR R4 (Fast Healthcare Interoperability Resources) is the international standard for healthcare data exchange. Patients can export their records in FHIR R4 format.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "FHIR"}', 'HL7_FHIR_R4', 'en', 'interoperability', 'patient', 'Class I'),
  (1, 100, 'FHIR R4 هو المعيار الدولي لتبادل البيانات الصحية. يمكن للمرضى تصدير سجلاتهم بصيغة FHIR R4.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "FHIR"}', 'HL7_FHIR_R4_AR', 'ar', 'interoperability', 'patient', 'Class I');
