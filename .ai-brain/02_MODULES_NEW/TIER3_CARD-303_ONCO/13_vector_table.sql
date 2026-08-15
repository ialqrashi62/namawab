-- Vector store for Cardio-Onc clinical knowledge

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS cardio_onc_knowledge (
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

CREATE INDEX IF NOT EXISTS idx_coo_kn_tenant ON cardio_onc_knowledge(tenant_id);
CREATE INDEX IF NOT EXISTS idx_coo_kn_topic ON cardio_onc_knowledge(topic) WHERE topic IS NOT NULL;

INSERT INTO cardio_onc_knowledge (tenant_id, department_id, content_chunk, embedding, metadata, source, language, topic, citation_class) VALUES
  (1, 303, 'Anthracycline cardiotoxicity is dose-dependent. Cumulative doxorubicin >250 mg/m² increases risk, >400 mg/m² without cardioprotection is high-risk. Mechanisms: free radical generation, topoisomerase II inhibition. Surveillance: Echo every 3 months for 1 year, then annually.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Anthracycline"}', 'ESC_2022', 'en', 'cardiotoxicity', 'Class I'),
  (1, 303, 'Trastuzumab causes reversible cardiotoxicity (unlike anthracyclines). Risk factors: prior anthracycline, age >65, baseline EF <60%. Surveillance: Echo every 3 months during treatment. EF drop >10% to <50% → hold trastuzumab, optimize cardioprotection.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Trastuzumab"}', 'ESC_2022', 'en', 'cardiotoxicity', 'Class I'),
  (1, 303, 'Immune checkpoint inhibitor (ICI) myocarditis is rare but fatal. Incidence 1-2%, mortality 50%. Symptoms: fatigue, dyspnea, chest pain. Diagnosis: troponin elevation, ECG abnormalities, MRI LGE. Treatment: high-dose corticosteroids (Methylprednisolone 1-2 mg/kg) immediately on suspicion.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "ICI Myocarditis"}', 'ICOS_2024', 'en', 'ici_myocarditis', 'Class I'),
  (1, 303, 'Cancer-associated VTE: LMWH and DOAC are first-line. Apixaban 5mg BID is preferred DOAC (ADAM-VTE trial). Avoid DOAC in gastric/pancreatic cancer (GI bleeding risk). Edoxaban 60mg daily (Hokusai-VTE Cancer). Duration: minimum 3-6 months, indefinite while on chemo.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "VTE in Cancer"}', 'NCCN_2024', 'en', 'vte', 'Class I'),
  (1, 303, 'LVEF alone is insufficient for early detection. Global Longitudinal Strain (GLS) detects cardiotoxicity earlier. GLS drop >15% relative is Class I indication to hold chemo. Reference ranges: GLS >-18% = normal, -16 to -18% = borderline, <-16% = abnormal.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "GLS"}', 'ESC_2022', 'en', 'gls', 'Class I'),
  (1, 303, 'HFA-ICOS Risk Stratification categorizes cancer patients into Low/Moderate/High/Very High risk. Very High risk factors: baseline EF <50%, prior cardiotoxicity, cumulative doxorubicin >400 mg/m², AL amyloidosis. All Very High risk patients MUST have Cardio-Onc consult before cancer therapy.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "HFA-ICOS"}', 'HFA_ICOS_2022', 'en', 'risk_stratification', 'Class I'),
  (1, 303, 'Cardiac amyloidosis (AL, ATTR) is increasingly recognized. AL: plasma cell dyscrasia, urgent hematology + chemotherapy. ATTR: TTR gene mutation, tafamidis therapy. Pyrophosphate scan distinguishes ATTR (Grade 2-3) from AL. Cardiac MRI LGE pattern is characteristic.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Cardiac Amyloid"}', 'ESC_2022', 'en', 'amyloid', 'Class I'),
  (1, 303, 'VEGF inhibitors (Sunitinib, Pazopanib, Sorafenib) cause HTN in 20-30%. BP monitoring weekly first cycle, then every 2-4 weeks. Goal BP <130/80. First-line: ACEi/ARB. Avoid CCB (DDI with sorafenib). Hypertensive crisis → hold agent.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "HTN"}', 'ESC_2022', 'en', 'htn', 'Class I'),
  (1, 303, 'QTc-prolonging chemo agents: Vandetanib, Sunitinib, Sorafenib, Bosutinib, Lapatinib, Dasatinib. Monitor QTc at baseline + weekly first cycle. QTc >500ms → hold drug, check electrolytes (K+, Mg++), correct. Permanent discontinuation if recurrent.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "QTc"}', 'ESC_2022', 'en', 'qtc', 'Class I'),
  (1, 303, 'Cardioprotection for high-risk patients: ACEi (Enalapril), Beta-blocker (Carvedilol, Nebivolol), Statin (Atorvastatin). Dexrazoxane for high-dose anthracycline (>300 mg/m²). Per ESC 2022, primary prevention recommended for Very High risk patients.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Cardioprotection"}', 'ESC_2022', 'en', 'cardioprotection', 'Class IIa'),
  (1, 303, 'Anthracyclines هي كيمياء تسبب سمية قلبية. الكتلة المجمعة >250 mg/m² تزيد الخطر. المراقبة: صدى القلب كل 3 أشهر. Dexrazoxane للوقاية.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "الأنثراسيكلين"}', 'MOH_2024_AR', 'ar', 'cardiotoxicity', 'Class I'),
  (1, 303, 'التهاب عضلة القلب من العلاج المناعي (ICI) نادر لكن خطير. العلاج: Methylprednisolone 1-2 mg/kg فوراً عند الاشتباه.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "ICI"}', 'MOH_2024_AR', 'ar', 'ici_myocarditis', 'Class I');
