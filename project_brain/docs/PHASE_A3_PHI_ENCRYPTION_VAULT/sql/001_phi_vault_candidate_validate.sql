-- 001_phi_vault_candidate_validate.sql (read-only)
select 'phi_files' t,
  exists(select 1 from information_schema.tables where table_name='phi_files') as exists,
  (select relforcerowsecurity from pg_class where relname='phi_files') as force,
  (select count(*) from pg_policy where polrelid='phi_files'::regclass) as policies,
  exists(select 1 from information_schema.columns where table_name='phi_files' and column_name='tenant_id') as has_tid
union all
select 'encryption_metadata',
  exists(select 1 from information_schema.tables where table_name='encryption_metadata'),
  null, 0,
  exists(select 1 from information_schema.columns where table_name='encryption_metadata' and column_name='key_version');
-- expect phi_files force=t, policies=1, has_tid=t; tables empty on first apply.
