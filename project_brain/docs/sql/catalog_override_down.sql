-- ============================================================================
-- SQL Script: catalog_override_down.sql
-- Description: Rollback catalog overrides tables.
-- Environment: Staging
-- ============================================================================

DROP TABLE IF EXISTS tenant_service_overrides CASCADE;
DROP TABLE IF EXISTS tenant_radiology_overrides CASCADE;
DROP TABLE IF EXISTS tenant_lab_test_overrides CASCADE;
