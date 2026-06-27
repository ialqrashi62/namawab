-- daily_close_tenant_rls_candidate_validate.sql  (expect: force=t, policy present, tenant_id col + default)
select relforcerowsecurity as force,
  (select count(*) from pg_policy p where p.polrelid='daily_close'::regclass) as policies,
  exists(select 1 from information_schema.columns where table_name='daily_close' and column_name='tenant_id') as has_tenant_id
from pg_class where oid='daily_close'::regclass;
