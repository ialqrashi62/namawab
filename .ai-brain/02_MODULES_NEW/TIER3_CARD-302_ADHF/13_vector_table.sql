-- Vector store for Advanced HF clinical knowledge

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS hf_clinical_knowledge (
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

CREATE INDEX IF NOT EXISTS idx_hf_kn_tenant ON hf_clinical_knowledge(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hf_kn_topic ON hf_clinical_knowledge(topic) WHERE topic IS NOT NULL;

INSERT INTO hf_clinical_knowledge (tenant_id, department_id, content_chunk, embedding, metadata, source, language, topic, citation_class) VALUES
  (1, 302, 'Sacubitril/Valsartan (Entresto) is a first-in-class ARNI (angiotensin receptor-neprilysin inhibitor) recommended for all HFrEF patients with EF <40% to reduce mortality (PARADIGM-HF trial). Start 24/26 mg BID, target 97/103 mg BID. Must washout from ACEi for 36 hours.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "GDMT"}', 'PARADIGM_HF_2014', 'en', 'gdmt', 'Class I'),
  (1, 302, 'SGLT2 inhibitors (Dapagliflozin, Empagliflozin) are the 4th pillar of HF therapy for HFrEF. Both reduce CV death and hospitalization (DAPA-HF, EMPEROR-Reduced). Can be used down to eGFR 20.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "GDMT"}', 'DAPA_HF_2019', 'en', 'gdmt', 'Class I'),
  (1, 302, 'Mineralocorticoid receptor antagonists (Spironolactone, Eplerenone) reduce mortality in HFrEF (RALES, EMPHASIS-HF). Target 25 mg daily. Avoid if K+ >5.0 or GFR <30.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "GDMT"}', 'RALES_1999', 'en', 'gdmt', 'Class I'),
  (1, 302, 'Beta-blockers (Bisoprolol, Carvedilol, Metoprolol succinate) reduce mortality in HFrEF. Three agents proven: CIBIS-II, COPERNICUS, MERIT-HF. Target doses: Bisoprolol 10 mg, Carvedilol 25 mg BID, Metoprolol 200 mg.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "GDMT"}', 'CIBIS_II_1999', 'en', 'gdmt', 'Class I'),
  (1, 302, 'Cardiogenic shock is grouped by SCAI stages A-E. Stage C: SBP <90 + lactate >2 + need for inotropic support. Stage D: deteriorating despite support. Stage E: cardiac arrest. DRIPS protocol for intervention: Definitive, Revascularization, Intra-aortic balloon pump, Percutaneous VAD, Surgical.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Cardiogenic Shock"}', 'SCAI_2022', 'en', 'shock', 'Class I'),
  (1, 302, 'INTERMACS profiles classify advanced HF candidates for mechanical circulatory support. Profile 1: Critical shock. Profile 2: Progressive decline. Profile 3: Stable on inotropes. Profiles 4-7: Less urgent but advanced HF.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "INTERMACS"}', 'INTERMACS_2023', 'en', 'intermacs', 'Class I'),
  (1, 302, 'Heart transplant is indicated for ACC Stage D HF with severe symptoms despite optimal medical therapy. Listing status: 1A (ICU+MCS), 1B (LVAD or complications), 2 (stable). Contraindications: PVR >5 Wood Units, malignancy within 5 years, active infection, severe comorbidity.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Transplant"}', 'ISHLT_2023', 'en', 'transplant', 'Class I'),
  (1, 302, 'HeartMate 3 LVAD is the current standard LVAD with improved survival and reduced pump thrombosis (MOMENTUM 3 trial). 1-year survival 85%, 5-year survival 50%. Complications: driveline infection, GI bleeding, stroke, RV failure.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "LVAD"}', 'MOMENTUM_3_2018', 'en', 'lvad', 'Class I'),
  (1, 302, 'MAGGIC risk score predicts 1-year mortality in HF patients. Components: age, EF, BP, BMI, creatinine, NYHA, diabetes, COPD, smoking, duration. Score ranges 0-50. Higher score = higher mortality.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "Risk Scores"}', 'MAGGIC_2013', 'en', 'risk_score', 'Class IIa'),
  (1, 302, 'Sacubitril/Valsartan is a first-line therapy for HFrEF in patients who tolerate ACEi. For elderly patients (>75), start lower dose and titrate slowly. Renal function and potassium must be monitored.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "GDMT"}', 'AHA_2022', 'ar', 'gdmt', 'Class I'),
  (1, 302, 'ARNI هو العلاج الأول من نوعه لفشل القلب (Sacubitril/Valsartan). ابدأ 24/26 ملغ مرتين يومياً، الهدف 97/103 ملغ. يجب التوقف عن ACEi لمدة 36 ساعة قبل البدء.', ARRAY_FILL(0, ARRAY[3072])::REAL[], '{"section": "GDMT"}', 'MOH_2024_AR', 'ar', 'gdmt', 'Class I');
