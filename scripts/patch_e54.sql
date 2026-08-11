-- Patch e54 migration: add ownership transfer + idempotent CREATE
-- Re-apply after fixing burn_assessments ownership

-- Transfer ownership of pre-existing tables to nama_medical_app
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename IN (
            'allergy_assessments', 'anesthesia_preops', 'audiology_tests',
            'burn_assessments', 'cardiac_rehab_sessions', 'ccu_visits',
            'chaplaincy_visits', 'cicu_visits', 'ctu_visits', 'dermatology_lesions',
            'dialysis_sessions', 'epilepsy_seizures', 'fetal_assessments',
            'genetic_consults', 'headache_diary', 'hematology_results', 'icu_visits',
            'immunology_workups', 'infection_surveillance', 'id_consults',
            'ivf_cycles', 'maternal_fetal_visits', 'memory_clinic_assessments',
            'movement_assessments', 'movement_disorders_clinical', 'ms_relapses',
            'neonatal_assessments', 'neuro_oncology_visits', 'neurosurgery_ops',
            'nicu_stays', 'nuclear_med_studies', 'nutrition_assessments',
            'ot_sessions', 'pain_clinic_visits', 'palliative_visits',
            'pathology_reports', 'physio_sessions', 'picu_visits',
            'plastic_surgery_cases', 'psychiatry_visits', 'pulm_rehab_sessions',
            'radiology_studies', 'rehab_plans', 'sleep_studies',
            'social_work_assessments', 'speech_therapy_sessions',
            'stroke_admissions', 'thoracic_surgery_cases', 'transplant_records',
            'trauma_assessments', 'urology_visits', 'vascular_surgery_cases',
            'wound_assessments'
        )
        AND tableowner <> 'nama_medical_app'
    LOOP
        EXECUTE format('ALTER TABLE %I OWNER TO nama_medical_app', r.tablename);
        RAISE NOTICE 'Transferred % to nama_medical_app', r.tablename;
    END LOOP;
END $$;
