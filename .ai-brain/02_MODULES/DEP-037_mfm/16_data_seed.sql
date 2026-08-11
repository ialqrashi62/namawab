-- Seed data for Maternal_Fetal_Medicine (DEP-037)
-- Generated: 2026-08-08
BEGIN;

-- Top 10 conditions with ICD-10 (placeholder; full ICD-10 must be sourced from official list)

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_1', 'high_risk_pregnancy', 'high_risk_pregnancy')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_2', 'fetal_anomaly', 'fetal_anomaly')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_3', 'twins_pregnancy', 'twins_pregnancy')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_4', 'preeclampsia_severe', 'preeclampsia_severe')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_5', 'gestational_diabetes_complicated', 'gestational_diabetes_complicated')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_6', 'fetal_growth_restriction', 'fetal_growth_restriction')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_7', 'RH_incompatibility', 'RH_incompatibility')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_8', 'preterm_labor_history', 'preterm_labor_history')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_9', 'placenta_accreta', 'placenta_accreta')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_10', 'recurrent_miscarriage', 'recurrent_miscarriage')
ON CONFLICT (code) DO NOTHING;


-- Top drugs (sample; full list must be sourced from SFDA)

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_1_magnesiu', 'magnesium_sulfate', 'magnesium_sulfate', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_2_betameth', 'betamethasone', 'betamethasone', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_3_nifedipi', 'nifedipine', 'nifedipine', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_4_atosiban', 'atosiban', 'atosiban', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_5_indometh', 'indomethacin', 'indomethacin', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_6_labetalo', 'labetalol', 'labetalol', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_7_aspirin_', 'aspirin_low_dose', 'aspirin_low_dose', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_8_heparin_', 'heparin_pregnancy', 'heparin_pregnancy', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_9_Rh_immun', 'Rh_immunoglobulin', 'Rh_immunoglobulin', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_10_insulin_', 'insulin_pregnancy', 'insulin_pregnancy', 'TBD')
ON CONFLICT (code) DO NOTHING;


COMMIT;