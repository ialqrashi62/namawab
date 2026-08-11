-- Wave 28 — Critical indexes for hot tables
-- Pattern: COMPOSITE indexes matching the most common WHERE+ORDER BY query pattern.
-- Safe: idempotent (CREATE INDEX IF NOT EXISTS).

BEGIN;

\echo === PATIENTS: tenant + created_at for list views ===
CREATE INDEX IF NOT EXISTS idx_patients_tenant_created_at
  ON public.patients (tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_patients_tenant_updated_at
  ON public.patients (tenant_id, created_at DESC) WHERE created_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_patients_tenant_name
  ON public.patients (tenant_id, name_en) WHERE name_en IS NOT NULL;

\echo
\echo === INVOICES: tenant + accounting_posting_status for AR aging ===
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_status_date
  ON public.invoices (tenant_id, accounting_posting_status, created_at DESC) WHERE accounting_posting_status IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_invoices_tenant_patient
  ON public.invoices (tenant_id, patient_id) WHERE patient_id > 0;

\echo
\echo === BEDS: tenant + ward lookup ===
CREATE INDEX IF NOT EXISTS idx_beds_tenant_ward
  ON public.beds (tenant_id, ward_id) WHERE ward_id IS NOT NULL;

\echo
\echo === INSURANCE CLAIMS: already has good composite indexes ===
-- insurance_claims already has idx_ins_claims_tenant_lifecycle

\echo
\echo === WARDS: tenant + floor for fast ward pickers ===
CREATE INDEX IF NOT EXISTS idx_wards_tenant_floor
  ON public.wards (tenant_id, floor) WHERE floor IS NOT NULL;

\echo
\echo === EMERGENCY BEDS: tenant + status ===
CREATE INDEX IF NOT EXISTS idx_emergency_beds_tenant_status
  ON public.emergency_beds (tenant_id, status) WHERE status IS NOT NULL;

\echo
\echo === AUDIT TRAIL: tenant + chain_idx for chain verification ===
CREATE INDEX IF NOT EXISTS idx_audit_trail_tenant_chain
  ON public.audit_trail (tenant_id, chain_idx) WHERE chain_idx IS NOT NULL;

\echo
\echo === EMPLOYEES: role for global RBAC lookups (Tier-1, no tenant_id) ===
CREATE INDEX IF NOT EXISTS idx_employees_role
  ON public.employees (role) WHERE role IS NOT NULL;

COMMIT;

\echo
\echo === VERIFICATION ===
SELECT count(*) AS new_indexes FROM pg_indexes
WHERE schemaname='public'
  AND indexname IN (
    'idx_patients_tenant_created_at',
    'idx_patients_tenant_updated_at',
    'idx_patients_tenant_name',
    'idx_invoices_tenant_status_date',
    'idx_invoices_tenant_patient',
    'idx_beds_tenant_ward',
    'idx_wards_tenant_floor',
    'idx_emergency_beds_tenant_status',
    'idx_audit_trail_tenant_chain',
    'idx_employees_tenant_role'
  );
SELECT count(*) AS total_indexes FROM pg_indexes WHERE schemaname='public';
