-- Seed data for PICU (DEP-024)
-- Generated: 2026-08-08
BEGIN;

-- Top 10 conditions with ICD-10 (placeholder; full ICD-10 must be sourced from official list)

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_1', 'pediatric_sepsis', 'pediatric_sepsis')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_2', 'severe_asthma', 'severe_asthma')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_3', 'status_epilepticus', 'status_epilepticus')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_4', 'diabetic_ketoacidosis', 'diabetic_ketoacidosis')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_5', 'post_cardiac_surgery', 'post_cardiac_surgery')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_6', 'severe_pneumonia', 'severe_pneumonia')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_7', 'traumatic_brain_injury', 'traumatic_brain_injury')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_8', 'anaphylaxis', 'anaphylaxis')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_9', 'ingestions', 'ingestions')
ON CONFLICT (code) DO NOTHING;

INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_10', 'burns_pediatric', 'burns_pediatric')
ON CONFLICT (code) DO NOTHING;


-- Top drugs (sample; full list must be sourced from SFDA)

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_1_epinephr', 'epinephrine', 'epinephrine', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_2_norepine', 'norepinephrine', 'norepinephrine', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_3_dopamine', 'dopamine', 'dopamine', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_4_midazola', 'midazolam', 'midazolam', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_5_fentanyl', 'fentanyl', 'fentanyl', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_6_propofol', 'propofol', 'propofol', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_7_ceftriax', 'ceftriaxone', 'ceftriaxone', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_8_vancomyc', 'vancomycin', 'vancomycin', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_9_methylpr', 'methylprednisolone', 'methylprednisolone', 'TBD')
ON CONFLICT (code) DO NOTHING;

INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_10_salbutam', 'salbutamol', 'salbutamol', 'TBD')
ON CONFLICT (code) DO NOTHING;


COMMIT;