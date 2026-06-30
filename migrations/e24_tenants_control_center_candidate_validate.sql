-- e24_tenants_control_center_candidate_validate.sql — after the candidate up, all_ok must be t.
SELECT (
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tenants' AND column_name='last_activity_at')
AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tenants' AND column_name='trial_ends_at')
AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tenants' AND column_name='suspended_at')
AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tenants' AND column_name='suspended_reason')
) AS all_ok;
