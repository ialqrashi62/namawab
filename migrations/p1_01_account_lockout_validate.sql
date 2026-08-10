SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'system_users' 
  AND column_name IN ('failed_login_attempts', 'lockout_until');
