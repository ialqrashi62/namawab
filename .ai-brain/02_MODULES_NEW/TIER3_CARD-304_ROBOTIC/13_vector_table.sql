-- Vector store for Robotic CV Surgery knowledge

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS robotic_cv_knowledge (
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

CREATE INDEX IF NOT EXISTS idx_rcv_kn_tenant ON robotic_cv_knowledge(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rcv_kn_topic ON robotic_cv_knowledge(topic) WHERE topic IS NOT NULL;

INSERT INTO robotic_cv_knowledge (tenant_id, department_id, content_chunk, embedding, metadata, source, language, topic, citation_class) VALUES
  (1, 304, 'STS Risk Score predicts 30-day mortality after cardiac surgery. Components: age, EF, creatinine, dialysis, emergency, prior cardiac surgery, female, diabetes, hypertension, COPD. Score >8% = high risk. High risk patients may benefit from TAVI or transcatheter approach.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Risk"}', 'STS_2024', 'en', 'risk_score', 'Class I'),
  (1, 304, 'TAVI is first-line for severe aortic stenosis in patients age ≥65 with STS ≥4% or age ≥80. Femoral access is preferred. Sapien 3 and Evolut are approved devices. Post-TAVI DAPT 1-6 months.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "TAVI"}', 'ACC_AHA_2024', 'en', 'tavi', 'Class I'),
  (1, 304, 'MitraClip (transcatheter mitral repair) is indicated for patients with severe MR (Grade ≥3+) and high surgical risk (STS ≥8%). EF must be 30-60%. Symptomatic despite optimal GDMT.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "MitraClip"}', 'COAPT_2023', 'en', 'mitraclip', 'Class I'),
  (1, 304, 'WATCHMAN FLX is indicated for AF patients with CHA2DS2-VASc ≥2 and contraindication to anticoagulation. LAA ostium must be 17-31 mm. Post-implant TEE at 45 days to confirm seal.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "WATCHMAN"}', 'PROTECT_AF_2023', 'en', 'watchman', 'Class I'),
  (1, 304, 'Robotic mitral valve repair using DaVinci platform has 99% success rate in experienced centers. Repair techniques include neo-chordae placement, annuloplasty ring, leaflet resection. Mortality <1% in experienced centers.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Robotic Mitral"}', 'STS_2024', 'en', 'robotic_surgery', 'Class I'),
  (1, 304, 'Robotic CABG (TECAB) is feasible for single-vessel LAD disease. Multi-vessel disease may need hybrid approach with PCI. Recovery faster than sternotomy.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Robotic CABG"}', 'STS_2024', 'en', 'robotic_surgery', 'Class IIa'),
  (1, 304, 'Conversion to open during robotic surgery occurs in 2-5% of cases. Risk factors: obesity, prior cardiac surgery, complex anatomy. Sternotomy set must be ready.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Conversion"}', 'STS_2024', 'en', 'complications', 'Class I'),
  (1, 304, 'جراحة القلب الروبوتية هي مستقبل الجراحة القلبية. دافنشي يوفر دقة عالية. TAVI للمرضى كبار السن. MitraClip للارتجاع التاجي عالي الخطر.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Robot"}', 'MOH_2024_AR', 'ar', 'overview', 'Class I'),
  (1, 304, 'The Heart Team (cardiologist, cardiac surgeon, anesthesia) must review all cases before TAVI or robotic surgery. STS score must be calculated.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Heart Team"}', 'ACC_AHA_2024', 'en', 'heart_team', 'Class I');
