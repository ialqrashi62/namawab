-- Rollback: Drop orthopedics tables and RLS policies.
BEGIN;

DROP TABLE IF EXISTS orthopedic_implants CASCADE;
DROP TABLE IF EXISTS joint_rom_assessments CASCADE;

COMMIT;
