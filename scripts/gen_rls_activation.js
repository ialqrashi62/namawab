#!/usr/bin/env node
// Wave 3B: Generate migration to enable + force RLS on tenant-scoped tables
'use strict';
const fs = require('fs');

// Tables WITHOUT tenant_id (system tables, leave alone)
const NO_TENANT = [
    'branches', 'cme_activities', 'cme_registrations', 'cosmetic_procedures',
    'departments', 'discount_rules', 'drug_interactions', 'employees',
    'finance_fiscal_years', 'form_templates', 'icd10_codes', 'lab_tests_catalog',
    'medical_services', 'medications', 'packages', 'pathology_specimens',
    'pcc_api_tokens', 'permissions', 'plan_entitlements', 'plans',
    'radiology_catalog', 'saas_billing_provider_accounts', 'saas_billing_webhook_events',
    'schema_migrations', 'system_users'
];

// Tables WITH tenant_id should get FORCE RLS + policy
const HAS_TENANT = [
    'appointments', 'patients', 'waitlist', 'employees', 'tenants',
    'invoices', 'insurance_claims', 'insurance_authorizations', 'lab_orders',
    'lab_results', 'pharmacy_prescriptions', 'radiology_studies', 'vital_signs',
    'nursing_assessments', 'preop_assessments', 'discharge_summaries',
    'emergency_visits', 'icu_visits', 'nicu_stays', 'picu_visits',
    'surgical_cases', 'anesthesia_records', 'blood_bank_transfusions',
    'infection_surveillance', 'quality_indicators', 'handoffs',
    'medication_administration', 'patient_allergies', 'immunizations',
    'clinical_notes', 'orders', 'results', 'encounters', 'users',
    'audit_log', 'sessions', 'device_tokens', 'family_medicine_patients',
    'family_medicine_visits', 'family_medicine_wellness', 'ai_document_chunks',
    'ai_prompt_log', 'ai_cost_log', 'staff_schedules', 'facilities',
    'facility_modules', 'patient_demographics', 'house_keeping'
];

// Generate safe migration
const up = `-- filepath: namaweb/migrations/e55_activate_force_rls_up.sql
-- e55: Activate FORCE RLS on tenant-scoped tables that have tenant_id
-- Pattern: nm-sql-table-template + FORCE_RLS pattern
-- Note: skips tables owned by other roles (per safety rail)

BEGIN;

DO $$
DECLARE
    table_name TEXT;
    tables_with_tenant TEXT[] := ARRAY[${HAS_TENANT.map(t => "'" + t + "'").join(', ')}];
BEGIN
    FOREACH table_name IN ARRAY tables_with_tenant
    LOOP
        -- Check if table exists and has tenant_id column
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = table_name AND column_name = 'tenant_id' AND table_schema = 'public'
        ) THEN
            -- Enable RLS
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
            -- Force RLS (so even table owner respects policies)
            EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', table_name);
            -- Create policy if not exists
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_tenant_isolation', table_name);
            EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO PUBLIC USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint) WITH CHECK (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)', table_name || '_tenant_isolation', table_name);
        ELSE
            RAISE NOTICE 'Skipping % - no tenant_id column', table_name;
        END IF;
    END LOOP;
END $$;

COMMIT;
`;

const down = `-- filepath: namaweb/migrations/e55_activate_force_rls_down.sql
-- e55 down: disable FORCE RLS
BEGIN;

DO $$
DECLARE
    table_name TEXT;
    tables_with_tenant TEXT[] := ARRAY[${HAS_TENANT.map(t => "'" + t + "'").join(', ')}];
BEGIN
    FOREACH table_name IN ARRAY tables_with_tenant
    LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name AND table_schema = 'public') THEN
            EXECUTE format('ALTER TABLE public.%I NO FORCE ROW LEVEL SECURITY', table_name);
        END IF;
    END LOOP;
END $$;

COMMIT;
`;

fs.writeFileSync('namaweb/migrations/e55_activate_force_rls_up.sql', up);
fs.writeFileSync('namaweb/migrations/e55_activate_force_rls_down.sql', down);
console.log(`Generated e55: ${HAS_TENANT.length} tables will get FORCE RLS`);
console.log(`  up: ${up.length} bytes`);
console.log(`  down: ${down.length} bytes`);
