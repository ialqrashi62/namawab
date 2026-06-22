-- 001_mfa_candidate_validate.sql (read-only)
select 'user_mfa' as t,
  exists(select 1 from information_schema.tables where table_name='user_mfa') as exists,
  exists(select 1 from information_schema.columns where table_name='user_mfa' and column_name='mfa_enabled') as has_flag
union all
select 'user_mfa_recovery_codes',
  exists(select 1 from information_schema.tables where table_name='user_mfa_recovery_codes'),
  exists(select 1 from information_schema.columns where table_name='user_mfa_recovery_codes' and column_name='code_hash');
-- expect both exist=t, flags=t; both tables empty on first apply.
