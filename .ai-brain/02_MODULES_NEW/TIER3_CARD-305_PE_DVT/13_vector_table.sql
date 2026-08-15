-- Vector store for PE/DVT knowledge

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS pe_dvt_knowledge (
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

CREATE INDEX IF NOT EXISTS idx_pe_kn_tenant ON pe_dvt_knowledge(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pe_kn_topic ON pe_dvt_knowledge(topic) WHERE topic IS NOT NULL;

INSERT INTO pe_dvt_knowledge (tenant_id, department_id, content_chunk, embedding, metadata, source, language, topic, citation_class) VALUES
  (1, 305, 'Massive PE is defined as SBP <90 mmHg or cardiac arrest. Treatment: systemic thrombolysis (Alteplase 100mg IV over 2 hours or Tenecteplase single bolus). If thrombolysis contraindicated, consider catheter-directed therapy or mechanical thrombectomy.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Massive PE"}', 'ESC_2019', 'en', 'massive_pe', 'Class I'),
  (1, 305, 'Submassive (intermediate-risk) PE has RV dysfunction or biomarker elevation without hypotension. Treatment: anticoagulation, monitor closely. Consider thrombolysis if deterioration.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Submassive PE"}', 'ESC_2019', 'en', 'submassive_pe', 'Class IIa'),
  (1, 305, 'Low-risk PE: hemodynamically stable, no RV dysfunction, normal biomarkers. Treatment: early discharge on DOAC.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Low-risk PE"}', 'ESC_2019', 'en', 'low_risk', 'Class I'),
  (1, 305, 'Pulmonary Embolism Response Team (PERT) is a multidisciplinary team for PE management. Activate for massive PE, submassive with deterioration, or thrombolysis candidates.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "PERT"}', 'AHA_2024', 'en', 'pert', 'Class I'),
  (1, 305, 'DOACs (Apixaban, Rivaroxaban, Edoxaban, Dabigatran) are first-line for PE/DVT in non-cancer patients. Cancer-associated VTE: LMWH first-line or DOAC (Apixaban).', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Anticoagulation"}', 'CHEST_2024', 'en', 'anticoag', 'Class I'),
  (1, 305, 'CTEPH (Chronic Thromboembolic Pulmonary Hypertension) workup: persistent dyspnea >3 months after PE, V/Q scan, right heart cath, PEA evaluation.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "CTEPH"}', 'ESC_2019', 'en', 'cteph', 'Class I'),
  (1, 305, 'IVC filter indications: contraindication to anticoagulation, recurrent PE on anticoagulation. Retrievable filter preferred. Retrieval within 30 days.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "IVC Filter"}', 'ACC_2024', 'en', 'ivc_filter', 'Class I'),
  (1, 305, 'Wells Score for DVT: Active cancer, paralysis/immobilization, recently bedridden, localized tenderness, entire leg swollen, calf swelling >3cm, pitting edema collateral, alternative diagnosis likely (-2), previous DVT.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Wells"}', 'ESC_2019', 'en', 'wells', 'Class I'),
  (1, 305, 'الصمة الرئوية (PE) هي انسداد الشريان الرئوي. Massive PE: SBP <90. العلاج: Thrombolysis. PERT Team تفعيل فوري.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "PE"}', 'MOH_2024_AR', 'ar', 'overview', 'Class I'),
  (1, 305, 'Tenecteplase is preferred over Alteplase for PE thrombolysis due to single bolus dosing. Dose: weight-based, 30-50 mg IV.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Tenecteplase"}', 'ACC_2024', 'en', 'thrombolysis', 'Class IIa');
