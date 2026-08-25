-- filepath: namaweb/migrations/e54_53dept_assessments_down.sql
-- e54 down: drop all 53 dept assessment tables
BEGIN;

DROP TABLE IF EXISTS allergy_assessments CASCADE;


DROP TABLE IF EXISTS anesthesia_assessments CASCADE;


DROP TABLE IF EXISTS audiology_assessments CASCADE;


DROP TABLE IF EXISTS burn_unit_assessments CASCADE;


DROP TABLE IF EXISTS cardiac_rehab_assessments CASCADE;


DROP TABLE IF EXISTS ccu_assessments CASCADE;


DROP TABLE IF EXISTS chaplaincy_assessments CASCADE;


DROP TABLE IF EXISTS cicu_assessments CASCADE;


DROP TABLE IF EXISTS ctu_assessments CASCADE;


DROP TABLE IF EXISTS dermatology_assessments CASCADE;


DROP TABLE IF EXISTS dialysis_assessments CASCADE;


DROP TABLE IF EXISTS epilepsy_assessments CASCADE;


DROP TABLE IF EXISTS fetal_medicine_assessments CASCADE;


DROP TABLE IF EXISTS genetics_assessments CASCADE;


DROP TABLE IF EXISTS headache_assessments CASCADE;


DROP TABLE IF EXISTS hematology_assessments CASCADE;


DROP TABLE IF EXISTS icu_assessments CASCADE;


DROP TABLE IF EXISTS immunology_assessments CASCADE;


DROP TABLE IF EXISTS infection_control_assessments CASCADE;


DROP TABLE IF EXISTS infectious_disease_assessments CASCADE;


DROP TABLE IF EXISTS ivf_assessments CASCADE;


DROP TABLE IF EXISTS maternal_fetal_assessments CASCADE;


DROP TABLE IF EXISTS memory_clinic_assessments CASCADE;


DROP TABLE IF EXISTS movement_disorders_assessments CASCADE;


DROP TABLE IF EXISTS movement_assessments CASCADE;


DROP TABLE IF EXISTS multiple_sclerosis_assessments CASCADE;


DROP TABLE IF EXISTS neonatology_assessments CASCADE;


DROP TABLE IF EXISTS neurosurgery_assessments CASCADE;


DROP TABLE IF EXISTS neuro_oncology_assessments CASCADE;


DROP TABLE IF EXISTS nicu_assessments CASCADE;


DROP TABLE IF EXISTS nuclear_medicine_assessments CASCADE;


DROP TABLE IF EXISTS nutrition_assessments CASCADE;


DROP TABLE IF EXISTS occupational_therapy_assessments CASCADE;


DROP TABLE IF EXISTS pain_management_assessments CASCADE;


DROP TABLE IF EXISTS palliative_care_assessments CASCADE;


DROP TABLE IF EXISTS pathology_assessments CASCADE;


DROP TABLE IF EXISTS physiotherapy_assessments CASCADE;


DROP TABLE IF EXISTS picu_assessments CASCADE;


DROP TABLE IF EXISTS plastic_surgery_assessments CASCADE;


DROP TABLE IF EXISTS psychiatry_assessments CASCADE;


DROP TABLE IF EXISTS pulmonary_rehab_assessments CASCADE;


DROP TABLE IF EXISTS radiology_assessments CASCADE;


DROP TABLE IF EXISTS rehabilitation_assessments CASCADE;


DROP TABLE IF EXISTS sleep_medicine_assessments CASCADE;


DROP TABLE IF EXISTS social_work_assessments CASCADE;


DROP TABLE IF EXISTS speech_therapy_assessments CASCADE;


DROP TABLE IF EXISTS stroke_unit_assessments CASCADE;


DROP TABLE IF EXISTS thoracic_surgery_assessments CASCADE;


DROP TABLE IF EXISTS transplant_assessments CASCADE;


DROP TABLE IF EXISTS trauma_surgery_assessments CASCADE;


DROP TABLE IF EXISTS urology_assessments CASCADE;


DROP TABLE IF EXISTS vascular_surgery_assessments CASCADE;


DROP TABLE IF EXISTS wound_care_assessments CASCADE;

COMMIT;
