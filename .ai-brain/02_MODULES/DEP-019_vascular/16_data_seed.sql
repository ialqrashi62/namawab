-- Seed data for Vascular_Surgery (DEP-019)
-- Generated: 2026-08-08
BEGIN;

-- Top 10 conditions with ICD-10 (placeholder; full ICD-10 must be sourced from official list)

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_1', 'AAA', 'AAA')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_2', 'carotid_stenosis', 'carotid_stenosis')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_3', 'peripheral_artery_disease', 'peripheral_artery_disease')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_4', 'DVT', 'DVT')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_5', 'varicose_veins', 'varicose_veins')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_6', 'aortic_dissection', 'aortic_dissection')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_7', 'mesenteric_ischemia', 'mesenteric_ischemia')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_8', 'AV_fistula', 'AV_fistula')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_9', 'lymphedema', 'lymphedema')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_10', 'vasculitis', 'vasculitis')
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
  ('TBD_4_rivaroxa', 'rivaroxaban', 'rivaroxaban', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_5_atorvast', 'atorvastatin', 'atorvastatin', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_6_metoprol', 'metoprolol', 'metoprolol', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_7_lisinopr', 'lisinopril', 'lisinopril', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_8_cilostaz', 'cilostazol', 'cilostazol', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_9_pentoxif', 'pentoxifylline', 'pentoxifylline', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_10_heparin', 'heparin', 'heparin', 'TBD')
ON CONFLICT (code) DO NOTHING;


COMMIT;