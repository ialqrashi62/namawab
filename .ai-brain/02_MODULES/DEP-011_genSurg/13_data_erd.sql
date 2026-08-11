-- ERD for General_Surgery (DEP-011)
-- Generated: 2026-08-08
-- Use: PostgreSQL 14+

BEGIN;

CREATE TABLE IF NOT EXISTS genSurg_encounters (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  encounter_type TEXT NOT NULL DEFAULT 'outpatient',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  chief_complaint TEXT,
  diagnosis_codes TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
ALTER TABLE genSurg_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE genSurg_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY genSurg_encounters_tenant ON genSurg_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON genSurg_encounters(tenant_id, patient_id);
CREATE INDEX ON genSurg_encounters(tenant_id, status);

CREATE TABLE IF NOT EXISTS genSurg_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  encounter_id BIGINT REFERENCES genSurg_encounters(id),
  order_type TEXT NOT NULL,
  order_code TEXT NOT NULL,
  order_detail JSONB NOT NULL DEFAULT '{}',
  priority TEXT NOT NULL DEFAULT 'routine',
  status TEXT NOT NULL DEFAULT 'pending',
  ordered_by BIGINT NOT NULL REFERENCES users(id),
  ordered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE genSurg_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE genSurg_orders FORCE ROW LEVEL SECURITY;
CREATE POLICY genSurg_orders_tenant ON genSurg_orders
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON genSurg_orders(tenant_id, patient_id);
CREATE INDEX ON genSurg_orders(tenant_id, status);

CREATE TABLE IF NOT EXISTS genSurg_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  encounter_id BIGINT REFERENCES genSurg_encounters(id),
  order_id BIGINT REFERENCES genSurg_orders(id),
  result_type TEXT NOT NULL,
  result_value TEXT,
  result_unit TEXT,
  reference_range TEXT,
  abnormal_flag TEXT,
  result_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE genSurg_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE genSurg_results FORCE ROW LEVEL SECURITY;
CREATE POLICY genSurg_results_tenant ON genSurg_results
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON genSurg_results(tenant_id, patient_id);

CREATE TABLE IF NOT EXISTS genSurg_notes (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  encounter_id BIGINT REFERENCES genSurg_encounters(id),
  note_type TEXT NOT NULL DEFAULT 'progress',
  note_text TEXT NOT NULL,
  signed_at TIMESTAMPTZ,
  signed_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE genSurg_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE genSurg_notes FORCE ROW LEVEL SECURITY;
CREATE POLICY genSurg_notes_tenant ON genSurg_notes
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON genSurg_notes(tenant_id, patient_id);

COMMIT;