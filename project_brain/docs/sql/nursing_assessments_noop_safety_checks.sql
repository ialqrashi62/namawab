-- ============================================================================
-- SQL Script: nursing_assessments_noop_safety_checks.sql
-- Description: Transaction-scoped isolation safety checks for nursing_assessments
-- Environment: Staging
-- WARNING: RUNS WITHIN TRANSACTION AND DECLARES ROLLBACK. NO PERMANENT CHANGES.
-- ============================================================================

BEGIN;

-- 1. Setup temporary testing context for Tenant 1
SELECT set_config('app.tenant_id', '1', true) AS tenant_context;

-- 2. Simulate SELECT isolation using the derived tenant logic
-- This query returns only assessments for patients belonging to Tenant 1.
SELECT a.id AS assessment_id, a.patient_name, p.tenant_id
FROM nursing_assessments a
JOIN patients p ON a.patient_id = p.id
WHERE p.tenant_id = (current_setting('app.tenant_id', true))::integer;

-- 3. Simulate no-op IDOR detection for cross-tenant insert
-- We verify that if we query a patient, we restrict it by the active tenant_id.
-- Let's simulate checking if Patient 22 (Tenant 2) belongs to Tenant 1 (current context).
-- Expected count: 0 (which would trigger a 404/403 in the application layer).
SELECT COUNT(*) AS is_authorized
FROM patients
WHERE id = 22 -- Simulating Tenant 2 patient lookup
  AND tenant_id = (current_setting('app.tenant_id', true))::integer;

-- 4. Rollback transaction to ensure no modifications are saved
ROLLBACK;
