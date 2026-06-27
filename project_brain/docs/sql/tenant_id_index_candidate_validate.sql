-- tenant_id_index_candidate_validate.sql
select t.relname, count(*) filter (where a.attname='tenant_id') as has_tenant_idx
from pg_class t left join pg_index i on i.indrelid=t.oid left join pg_attribute a on a.attrelid=t.oid and a.attnum=i.indkey[0]
where t.relforcerowsecurity and t.relkind='r' group by 1 order by 2,1;
