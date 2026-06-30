-- seed_staging_plans.sql — SYNTHETIC staging plans (starter/growth/enterprise). STAGING ONLY.
-- Run ONLY against jumanasoft_staging after e25_up + validate. No real customer data. Idempotent.
\set ON_ERROR_STOP on

INSERT INTO plans (plan_key, name_ar, name_en, currency, monthly_price, yearly_price, trial_days, active, sort_order) VALUES
  ('starter',    'المبتدئة', 'Starter',    'SAR',    0,     0, 14, true, 1),
  ('growth',     'النمو',    'Growth',     'SAR',  499,  4990, 14, true, 2),
  ('enterprise', 'المؤسسات', 'Enterprise', 'SAR', 1999, 19990,  0, true, 3)
ON CONFLICT (plan_key) DO NOTHING;

-- entitlements (1:1). NULL limit = unlimited. modules from the known-module allowlist in plans.js.
INSERT INTO plan_entitlements (plan_id, max_users, max_branches, max_invoices_per_month, modules_enabled, support_level, api_access, custom_domain)
SELECT id,
       CASE plan_key WHEN 'starter' THEN 5    WHEN 'growth' THEN 25   ELSE NULL END,
       CASE plan_key WHEN 'starter' THEN 1    WHEN 'growth' THEN 5    ELSE NULL END,
       CASE plan_key WHEN 'starter' THEN 500  WHEN 'growth' THEN 5000 ELSE NULL END,
       CASE plan_key
         WHEN 'starter' THEN 'dashboard,patients,appointments'
         WHEN 'growth'  THEN 'dashboard,patients,appointments,lab,radiology,pharmacy,invoices,reports'
         ELSE 'dashboard,patients,appointments,lab,radiology,pharmacy,invoices,reports,insurance,finance,hr,inventory,surgery,icu,emergency,inpatient'
       END,
       CASE plan_key WHEN 'starter' THEN 'basic' WHEN 'growth' THEN 'standard' ELSE 'priority' END,
       (plan_key = 'enterprise'),
       (plan_key = 'enterprise')
FROM plans WHERE plan_key IN ('starter','growth','enterprise')
ON CONFLICT (plan_id) DO NOTHING;

SELECT plan_key, currency, monthly_price, active FROM plans WHERE plan_key IN ('starter','growth','enterprise') ORDER BY sort_order;
