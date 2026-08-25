-- e516 TIER4_SLEEP-104 Parasomnia
CREATE TABLE IF NOT EXISTS tier4_sleep_104_rbd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  rem_acting_out BOOLEAN,
  dream_enacting BOOLEAN,
  age NUMERIC NOT NULL,
  male BOOLEAN,
  neurodegenerative BOOLEAN,
  diagnosis TEXT,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_sleep_104_rbd ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_sleep_104_rbd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_sleep_104_rbd_t ON tier4_sleep_104_rbd;
CREATE POLICY tier4_sleep_104_rbd_t ON tier4_sleep_104_rbd
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_sleep_104_rls (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  urge_to_move_legs BOOLEAN,
  worse_at_rest BOOLEAN,
  relieved_by_movement BOOLEAN,
  evening_worse BOOLEAN,
  score NUMERIC,
  diagnosis TEXT,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_sleep_104_rls ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_sleep_104_rls FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_sleep_104_rls_t ON tier4_sleep_104_rls;
CREATE POLICY tier4_sleep_104_rls_t ON tier4_sleep_104_rls
  USING (tenant_id = current_setting('app.tenant_id', true));