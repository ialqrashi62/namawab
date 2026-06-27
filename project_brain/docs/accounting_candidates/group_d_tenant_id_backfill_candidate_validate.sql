-- group_d_tenant_id_backfill_candidate_validate.sql — READ-ONLY.
-- (1) صفوف لها patient_id صالح لكن tenant_id بقي NULL بعد backfill (يجب = 0)
SELECT 'unbackfilled_with_patient' AS check, (
  (SELECT count(*) FROM blood_bank_transfusions c JOIN patients p ON c.patient_id=p.id WHERE c.tenant_id IS NULL)
+ (SELECT count(*) FROM blood_bank_crossmatch  c JOIN patients p ON c.patient_id=p.id WHERE c.tenant_id IS NULL)
+ (SELECT count(*) FROM package_sessions       c JOIN patients p ON c.patient_id=p.id WHERE c.tenant_id IS NULL)
+ (SELECT count(*) FROM approvals              c JOIN patients p ON c.patient_id=p.id WHERE c.tenant_id IS NULL)
) AS n;
-- (2) عدم تطابق tenant: صف tenant_id != tenant مالكه (يجب = 0)
SELECT 'tenant_mismatch' AS check, (
  (SELECT count(*) FROM blood_bank_transfusions c JOIN patients p ON c.patient_id=p.id WHERE c.tenant_id IS DISTINCT FROM p.tenant_id)
+ (SELECT count(*) FROM blood_bank_crossmatch  c JOIN patients p ON c.patient_id=p.id WHERE c.tenant_id IS DISTINCT FROM p.tenant_id)
+ (SELECT count(*) FROM package_sessions       c JOIN patients p ON c.patient_id=p.id WHERE c.tenant_id IS DISTINCT FROM p.tenant_id)
+ (SELECT count(*) FROM approvals              c JOIN patients p ON c.patient_id=p.id WHERE c.tenant_id IS DISTINCT FROM p.tenant_id)
) AS n;
-- (3) صفوف بلا patient_id (تبقى tenant_id=NULL؛ تحتاج قراراً يدوياً قبل NOT NULL)
SELECT 'rows_without_patient' AS check, (
  (SELECT count(*) FROM blood_bank_transfusions WHERE patient_id IS NULL)
+ (SELECT count(*) FROM blood_bank_crossmatch  WHERE patient_id IS NULL)
+ (SELECT count(*) FROM package_sessions       WHERE patient_id IS NULL)
+ (SELECT count(*) FROM approvals              WHERE patient_id IS NULL)
) AS n;
-- (4) فهارس tenant_id موجودة (يجب = 4)
SELECT 'tenant_indexes' AS check, count(*) AS n FROM pg_indexes
WHERE indexname IN ('idx_blood_bank_transfusions_tenant','idx_blood_bank_crossmatch_tenant','idx_package_sessions_tenant','idx_approvals_tenant');
