-- SQL Read-Only Validation Checks for Authentication Database State
-- NamaMedical System
-- Note: This script runs READ-ONLY queries to verify the system user and admin mapping state.
-- Do NOT execute modifying commands (UPDATE, DELETE, ALTER, CREATE).
-- NEVER select or output password_hash or password in reports.

-- 1. Check if system_users table exists and display its structure (excluding sensitive columns)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'system_users'
  AND column_name NOT IN ('password', 'password_hash');

-- 2. Count total active and inactive users in system_users
SELECT is_active, COUNT(*) as user_count
FROM system_users
GROUP BY is_active;

-- 3. Check for the presence of the 'admin' user and verify its metadata (display_name, role, speciality)
-- Excludes password_hash for security.
SELECT id, username, display_name, role, speciality, is_active
FROM system_users
WHERE username = 'admin';

-- 4. Verify user tenant mappings for the admin user (checking that it is linked to tenant 1)
SELECT ut.id, ut.user_id, ut.tenant_id, ut.is_active, su.username
FROM user_tenants ut
JOIN system_users su ON ut.user_id = su.id
WHERE su.username = 'admin';

-- 5. Verify user facility mappings for the admin user (checking branch and facility links)
SELECT uf.id, uf.user_id, uf.facility_id, uf.branch_id, uf.is_active, su.username
FROM user_facilities uf
JOIN system_users su ON uf.user_id = su.id
WHERE su.username = 'admin';

-- 6. Check for duplicate accounts with 'Admin' role to prevent backdoor accounts
SELECT role, COUNT(*), array_to_string(array_agg(username), ', ') as usernames
FROM system_users
WHERE role = 'Admin'
GROUP BY role;

-- 7. List all roles present in system_users to ensure permissions alignment
SELECT DISTINCT role
FROM system_users;
