-- ============================================================
-- group_d_tenant_id_backfill_candidate_up.sql
-- CANDIDATE ONLY — DO NOT EXECUTE IN PRODUCTION WITHOUT APPROVAL + STAGING PASS + BACKUP.
-- يضيف tenant_id (nullable) لجداول Group D الآمنة فقط، ويعبّئه استنتاجاً من patients عبر patient_id.
-- الجداول الآمنة (مصدر tenant_id حتمي عبر patient_id -> patients.tenant_id):
--   blood_bank_transfusions, blood_bank_crossmatch, package_sessions, approvals
-- لا NOT NULL هنا (يُؤجَّل حتى إثبات backfill كامل في الإنتاج). الجداول غير الآمنة مؤجَّلة (انظر القرار).
-- ============================================================
BEGIN;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['blood_bank_transfusions','blood_bank_crossmatch','package_sessions','approvals'] LOOP
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS tenant_id INTEGER', t);
    -- backfill حتمي من المريض المرتبط (للصفوف ذات patient_id صالح فقط)
    EXECUTE format('UPDATE %I c SET tenant_id = p.tenant_id FROM patients p WHERE c.patient_id = p.id AND c.tenant_id IS NULL', t);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_tenant ON %I (tenant_id)', t, t);
  END LOOP;
END $$;
COMMIT;
-- ملاحظة: بعد إثبات أن (tenant_id IS NULL AND patient_id IS NOT NULL) = 0 في الإنتاج،
-- يمكن لاحقاً (مرحلة منفصلة) إضافة NOT NULL + FK إلى tenants. لا تفعل ذلك قبل الإثبات.
