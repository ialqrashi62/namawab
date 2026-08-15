-- Vector store for stroke clinical knowledge (RAG)
-- pgvector extension + HNSW index

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS stroke_clinical_knowledge (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  department_id INTEGER NOT NULL,
  content_chunk TEXT NOT NULL,
  embedding REAL[] NOT NULL,
  metadata JSONB,
  source VARCHAR(255),
  language VARCHAR(10) DEFAULT 'en',
  topic VARCHAR(100),
  citation_class VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stroke_kn_tenant ON stroke_clinical_knowledge(tenant_id);
CREATE INDEX IF NOT EXISTS idx_stroke_kn_topic ON stroke_clinical_knowledge(topic) WHERE topic IS NOT NULL;

-- Sample seed (real chunks need to be ingested from AHA/ASA/MoH PDFs)
INSERT INTO stroke_clinical_knowledge (tenant_id, department_id, content_chunk, embedding, metadata, source, language, topic, citation_class)
VALUES
  (1, 301, 'IV Alteplase is indicated for acute ischemic stroke within 4.5 hours of symptom onset in eligible patients. Standard dose is 0.9 mg/kg (max 90 mg), 10% bolus over 1 minute, remainder over 60 minutes.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "IV Thrombolysis"}', 'AHA_ASA_2019', 'en', 'thrombolysis', 'Class I'),
  (1, 301, 'IV Tenecteplase 0.25 mg/kg single bolus (max 25 mg) is now Saudi MoH-approved alternative to Alteplase for AIS within 4.5 hours. Non-inferior efficacy, easier administration.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "IV Thrombolysis"}', 'MOH_2024', 'en', 'thrombolysis', 'Class I'),
  (1, 301, 'Mechanical thrombectomy is indicated for acute ischemic stroke due to large vessel occlusion (LVO) in the internal carotid artery or proximal MCA (M1) within 6 hours of symptom onset. Extended window 6-24h requires favorable perfusion imaging.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Mechanical Thrombectomy"}', 'AHA_ASA_2019', 'en', 'thrombectomy', 'Class I'),
  (1, 301, 'Target door-to-needle time for IV thrombolysis is ≤60 minutes for ≥75% of eligible patients. Target door-to-groin puncture for thrombectomy is ≤90 minutes.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Quality Metrics"}', 'AHA_ASA_2019', 'en', 'quality_sla', 'Class I'),
  (1, 301, 'Long-term dual antiplatelet therapy (aspirin + clopidogrel) for 21-90 days is recommended after minor stroke (NIHSS ≤3) or high-risk TIA to reduce 90-day stroke risk (CHANCE/POINT trials).', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Secondary Prevention"}', 'AHA_ASA_2019', 'en', 'secondary_prevention', 'Class IIa'),
  (1, 301, 'High-intensity statin therapy (atorvastatin 40-80 mg or rosuvastatin 20-40 mg) is recommended for all ischemic stroke/TIA patients regardless of baseline LDL to reduce recurrent stroke risk (SPARCL trial).', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Secondary Prevention"}', 'AHA_ASA_2019', 'en', 'secondary_prevention', 'Class I');

-- Arabic translations (sample)
INSERT INTO stroke_clinical_knowledge (tenant_id, department_id, content_chunk, embedding, metadata, source, language, topic, citation_class)
VALUES
  (1, 301, 'العلاج بالبلازمين الوريدي (Alteplase) للسكتة الدماغية الحادة خلال 4.5 ساعات من ظهور الأعراض. الجرعة القياسية 0.9 ملغ/كغ (حد أقصى 90 ملغ).', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "الإذابة الوريدية"}', 'MOH_2024_AR', 'ar', 'thrombolysis', 'Class I'),
  (1, 301, 'Tenecteplase 0.25 ملغ/كغ جرعة واحدة (حد أقصى 25 ملغ) معتمد من وزارة الصحة السعودية كبديل لـ Alteplase.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "الإذابة الوريدية"}', 'MOH_2024_AR', 'ar', 'thrombolysis', 'Class I');
