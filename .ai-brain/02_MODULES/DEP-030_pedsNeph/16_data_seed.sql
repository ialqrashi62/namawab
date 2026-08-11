-- Seed data for Pediatric_Nephrology (DEP-030)
-- Generated: 2026-08-08
BEGIN;

-- Top 10 conditions with ICD-10 (placeholder; full ICD-10 must be sourced from official list)

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_1', 'nephrotic_syndrome_pediatric', 'nephrotic_syndrome_pediatric')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_2', 'UTI_pediatric', 'UTI_pediatric')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_3', 'hemolytic_uremic_syndrome', 'hemolytic_uremic_syndrome')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_4', 'glomerulonephritis_pediatric', 'glomerulonephritis_pediatric')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_5', 'renal_failure_pediatric', 'renal_failure_pediatric')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_6', 'hydronephrosis', 'hydronephrosis')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_7', 'VUR', 'VUR')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_8', 'polycystic_kidney_pediatric', 'polycystic_kidney_pediatric')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_9', 'renal_tubular_acidosis', 'renal_tubular_acidosis')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_10', 'hypertension_pediatric', 'hypertension_pediatric')
ON CONFLICT (code) DO NOTHING;


-- Top drugs (sample; full list must be sourced from SFDA)

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_1_predniso', 'prednisone_pediatric', 'prednisone_pediatric', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_2_cyclopho', 'cyclophosphamide_pediatric', 'cyclophosphamide_pediatric', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_3_mycophen', 'mycophenolate_pediatric', 'mycophenolate_pediatric', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_4_tacrolim', 'tacrolimus_pediatric', 'tacrolimus_pediatric', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_5_lisinopr', 'lisinopril_pediatric', 'lisinopril_pediatric', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_6_enalapri', 'enalapril_pediatric', 'enalapril_pediatric', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_7_amlodipi', 'amlodipine_pediatric', 'amlodipine_pediatric', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_8_furosemi', 'furosemide_pediatric', 'furosemide_pediatric', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_9_sodium_b', 'sodium_bicarbonate_pediatric', 'sodium_bicarbonate_pediatric', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_10_sevelame', 'sevelamer_pediatric', 'sevelamer_pediatric', 'TBD')
ON CONFLICT (code) DO NOTHING;


COMMIT;