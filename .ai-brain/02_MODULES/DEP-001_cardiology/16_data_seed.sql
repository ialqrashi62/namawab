-- Seed data for Cardiology (DEP-001)
-- Generated: 2026-08-08
BEGIN;

-- Top 10 conditions with ICD-10 (placeholder; full ICD-10 must be sourced from official list)

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_1', 'ACS', 'ACS')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_2', 'heart_failure', 'heart_failure')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_3', 'atrial_fibrillation', 'atrial_fibrillation')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_4', 'hypertension', 'hypertension')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_5', 'valve_disease', 'valve_disease')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_6', 'hyperlipidemia', 'hyperlipidemia')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_7', 'syncope', 'syncope')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_8', 'endocarditis', 'endocarditis')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_9', 'myocarditis', 'myocarditis')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_10', 'pulmonary_embolism', 'pulmonary_embolism')
ON CONFLICT (code) DO NOTHING;


-- Top drugs (sample; full list must be sourced from SFDA)

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_1_aspirin', 'aspirin', 'aspirin', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_2_clopidog', 'clopidogrel', 'clopidogrel', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_3_warfarin', 'warfarin', 'warfarin', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_4_apixaban', 'apixaban', 'apixaban', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_5_metoprol', 'metoprolol', 'metoprolol', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_6_lisinopr', 'lisinopril', 'lisinopril', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_7_atorvast', 'atorvastatin', 'atorvastatin', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_8_amiodaro', 'amiodarone', 'amiodarone', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_9_digoxin', 'digoxin', 'digoxin', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_10_furosemi', 'furosemide', 'furosemide', 'TBD')
ON CONFLICT (code) DO NOTHING;


COMMIT;