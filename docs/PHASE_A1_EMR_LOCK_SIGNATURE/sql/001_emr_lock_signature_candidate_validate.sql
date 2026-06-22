-- 001_emr_lock_signature_candidate_validate.sql  (read-only)
-- Expect: each target table has the 6 new columns; emr_amendments exists with FORCE RLS + 1 policy + tenant_id.
select t as table_name,
  (select count(*) from information_schema.columns c
     where c.table_name = t and c.column_name in
     ('emr_status','signed_by_user_id','signed_at','locked_at','integrity_hash','lock_reason')) as lock_cols_present
from unnest(ARRAY['medical_records','nursing_assessments','medical_reports','medical_certificates','surgery_anesthesia_records']) as t
order by t;

select relname, relforcerowsecurity as force,
  (select count(*) from pg_policy p where p.polrelid = c.oid) as policies,
  exists(select 1 from information_schema.columns where table_name='emr_amendments' and column_name='tenant_id') as has_tenant_id
from pg_class c where c.relname = 'emr_amendments';
