-- Seed data for Interventional_Radiology (DEP-041)
-- Generated: 2026-08-08
BEGIN;

-- Top 10 conditions with ICD-10 (placeholder; full ICD-10 must be sourced from official list)

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_1', 'peripheral_artery_disease_ir', 'peripheral_artery_disease_ir')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_2', 'aortic_aneurysm_ir', 'aortic_aneurysm_ir')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_3', 'GI_bleeding_ir', 'GI_bleeding_ir')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_4', 'tumor_ablation', 'tumor_ablation')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_5', 'biliary_obstruction', 'biliary_obstruction')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_6', 'venous_thrombosis_ir', 'venous_thrombosis_ir')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_7', 'dialysis_access_ir', 'dialysis_access_ir')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_8', 'uterine_fibroids_ir', 'uterine_fibroids_ir')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_9', 'pulmonary_embolism_ir', 'pulmonary_embolism_ir')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_10', 'stroke_ir', 'stroke_ir')
ON CONFLICT (code) DO NOTHING;


-- Top drugs (sample; full list must be sourced from SFDA)

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_1_heparin_', 'heparin_ir', 'heparin_ir', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_2_tPA_ir', 'tPA_ir', 'tPA_ir', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_3_ondanset', 'ondansetron', 'ondansetron', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_4_fentanyl', 'fentanyl_ir', 'fentanyl_ir', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_5_midazola', 'midazolam_ir', 'midazolam_ir', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_6_vancomyc', 'vancomycin_prophylaxis', 'vancomycin_prophylaxis', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_7_cefazoli', 'cefazolin_prophylaxis', 'cefazolin_prophylaxis', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_8_normal_s', 'normal_saline_contrast', 'normal_saline_contrast', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_9_iohexol', 'iohexol', 'iohexol', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_10_iodixano', 'iodixanol', 'iodixanol', 'TBD')
ON CONFLICT (code) DO NOTHING;


COMMIT;