-- e145 P0-12 Patient Engagement UP
-- Tables: pe_goals, pe_badges, pe_leaderboards, pe_reminders

CREATE TABLE IF NOT EXISTS pe_goals (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  goal_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  goal_type VARCHAR(50),
  target_value NUMERIC(12,4),
  current_value NUMERIC(12,4),
  deadline_days INTEGER,
  progress_pct NUMERIC(5,2),
  achieved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pe_goals_tenant ON pe_goals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pe_goals_patient ON pe_goals(patient_id);
ALTER TABLE pe_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pe_goals FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pe_goals_tenant_isolation ON pe_goals;
CREATE POLICY pe_goals_tenant_isolation ON pe_goals
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pe_badges (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  badge_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  achievement_type VARCHAR(50),
  badge_name VARCHAR(100),
  icon VARCHAR(20),
  rarity VARCHAR(20),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE pe_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE pe_badges FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pe_badges_tenant_isolation ON pe_badges;
CREATE POLICY pe_badges_tenant_isolation ON pe_badges
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pe_leaderboards (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  leaderboard_id VARCHAR(50) UNIQUE NOT NULL,
  scope VARCHAR(30),
  period VARCHAR(20) DEFAULT 'monthly',
  anonymized BOOLEAN DEFAULT true,
  entries JSONB,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE pe_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE pe_leaderboards FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pe_lb_tenant_isolation ON pe_leaderboards;
CREATE POLICY pe_lb_tenant_isolation ON pe_leaderboards
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pe_reminders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  reminder_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  appointment_date TIMESTAMPTZ,
  channel VARCHAR(20) DEFAULT 'sms',
  message TEXT,
  locale VARCHAR(5) DEFAULT 'ar',
  sent_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'scheduled'
);
ALTER TABLE pe_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pe_reminders FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pe_rem_tenant_isolation ON pe_reminders;
CREATE POLICY pe_rem_tenant_isolation ON pe_reminders
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));