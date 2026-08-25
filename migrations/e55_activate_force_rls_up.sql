-- filepath: namaweb/migrations/e55_activate_force_rls_up.sql
-- e55: Activate FORCE RLS on tenant-scoped tables that have tenant_id
-- Pattern: nm-sql-table-template + FORCE_RLS pattern
-- Note: uses per-table savepoints so one failure doesn't rollback others

BEGIN;

DO $$
DECLARE
    tbl TEXT;
    tables_with_tenant TEXT[] := ARRAY['appointments', 'patients', 'invoices', 'insurance_claims', 'insurance_authorizations', 'lab_orders', 'lab_results', 'pharmacy_prescriptions', 'radiology_studies', 'vital_signs', 'nursing_assessments', 'preop_assessments', 'discharge_summaries', 'emergency_visits', 'icu_visits', 'nicu_stays', 'picu_visits', 'surgical_cases', 'anesthesia_records', 'blood_bank_transfusions', 'infection_surveillance', 'quality_indicators', 'handoffs', 'medication_administration', 'patient_allergies', 'immunizations', 'clinical_notes', 'orders', 'results', 'encounters', 'users', 'audit_log', 'sessions', 'device_tokens', 'family_medicine_patients', 'family_medicine_visits', 'family_medicine_wellness', 'ai_document_chunks', 'ai_prompt_log', 'ai_cost_log', 'staff_schedules', 'facilities', 'facility_modules', 'patient_demographics', 'house_keeping', 'allergy_assessments', 'anesthesia_assessments', 'audiology_assessments', 'burn_unit_assessments', 'cardiac_rehab_assessments', 'ccu_assessments', 'chaplaincy_assessments', 'cicu_assessments', 'ctu_assessments', 'dermatology_assessments', 'dialysis_assessments', 'epilepsy_assessments', 'fetal_medicine_assessments', 'genetics_assessments', 'headache_assessments', 'hematology_assessments', 'icu_assessments', 'immunology_assessments', 'infection_control_assessments', 'infectious_disease_assessments', 'ivf_assessments', 'maternal_fetal_assessments', 'memory_clinic_assessments', 'movement_assessments', 'movement_disorders_assessments', 'multiple_sclerosis_assessments', 'neonatology_assessments', 'neuro_oncology_assessments', 'neurosurgery_assessments', 'nicu_assessments', 'nuclear_medicine_assessments', 'nutrition_assessments', 'occupational_therapy_assessments', 'pain_management_assessments', 'palliative_care_assessments', 'pathology_assessments', 'physiotherapy_assessments', 'picu_assessments', 'plastic_surgery_assessments', 'psychiatry_assessments', 'pulmonary_rehab_assessments', 'radiology_assessments', 'rehabilitation_assessments', 'sleep_medicine_assessments', 'social_work_assessments', 'speech_therapy_assessments', 'stroke_unit_assessments', 'thoracic_surgery_assessments', 'transplant_assessments', 'trauma_surgery_assessments', 'urology_assessments', 'vascular_surgery_assessments', 'wound_care_assessments'];
BEGIN
    FOREACH tbl IN ARRAY tables_with_tenant
    LOOP
        -- Check if table exists and has tenant_id column
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = tbl AND column_name = 'tenant_id' AND table_schema = 'public'
        ) THEN
            -- ENABLE RLS (may fail if not owner)
            BEGIN
                EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
            EXCEPTION WHEN insufficient_privilege THEN
                RAISE NOTICE 'ENABLE RLS failed for % - not owner', tbl;
            END;
            -- FORCE RLS
            BEGIN
                EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', tbl);
            EXCEPTION WHEN insufficient_privilege THEN
                RAISE NOTICE 'FORCE RLS failed for % - not owner', tbl;
            END;
            -- DROP policy
            BEGIN
                EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', tbl || '_tenant_isolation', tbl);
            EXCEPTION WHEN insufficient_privilege THEN
                RAISE NOTICE 'DROP POLICY failed for %', tbl;
            END;
            -- CREATE policy (may fail if tenant_id is TEXT not BIGINT)
            BEGIN
                EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO PUBLIC USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint) WITH CHECK (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)', tbl || '_tenant_isolation', tbl);
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'CREATE POLICY failed for % - tenant_id may be TEXT', tbl;
            END;
        ELSE
            RAISE NOTICE 'Skipping % - no tenant_id column', tbl;
        END IF;
    END LOOP;
END $$;

COMMIT;
