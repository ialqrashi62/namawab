-- group_d_tenant_id_backfill_candidate_down.sql — CANDIDATE ROLLBACK (الجداول الآمنة الأربعة).
-- يزيل index و tenant_id المضافين. للإنتاج: يُفضَّل backup restore إن وُجدت بيانات؛ هنا آمن (إضافة عمود فقط).
BEGIN;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['blood_bank_transfusions','blood_bank_crossmatch','package_sessions','approvals'] LOOP
    EXECUTE format('DROP INDEX IF EXISTS idx_%s_tenant', t);
    EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS tenant_id', t);
  END LOOP;
END $$;
COMMIT;
