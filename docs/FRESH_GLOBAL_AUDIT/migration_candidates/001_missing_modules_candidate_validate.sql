-- 001_missing_modules_candidate_validate.sql  (CANDIDATE — read-only validation)
-- Expect: each new table exists, FORCE RLS on, exactly 1 policy, tenant_id column + default present.
select t.relname,
       t.relrowsecurity   as rls,
       t.relforcerowsecurity as force,
       (select count(*) from pg_policy p where p.polrelid = t.oid) as policies,
       exists(select 1 from information_schema.columns c
              where c.table_name = t.relname and c.column_name = 'tenant_id') as has_tenant_id
from pg_class t
where t.relname in ('document_signatures','fhir_resources','hl7_messages')
order by t.relname;
