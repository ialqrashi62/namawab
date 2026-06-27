-- SQL No-Op Safety Checks for Authentication System
-- NamaMedical System
-- This script runs inside a transaction block and performs validation checks.
-- It ends with a ROLLBACK to guarantee absolutely no persistent database modification (NO-OP).

BEGIN;

-- 1. Verify existence and integrity of system_users table metadata
SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND tablename = 'system_users';

-- 2. Verify there are no null values in system_users roles or active status
SELECT id, username, role, is_active 
FROM system_users 
WHERE role IS NULL OR is_active IS NULL;

-- 3. Check mapped user scopes count to ensure database consistency
SELECT 
    (SELECT COUNT(*) FROM user_tenants) as tenant_mappings_count,
    (SELECT COUNT(*) FROM user_facilities) as facility_mappings_count;

-- 4. Check that no user exists without being mapped to at least one active tenant
SELECT id, username 
FROM system_users 
WHERE id NOT IN (SELECT DISTINCT user_id FROM user_tenants WHERE is_active = true);

-- Rollback transaction to ensure no modifications are persisted under any circumstances
ROLLBACK;
