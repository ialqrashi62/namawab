-- ERD for Endocrinology (DEP-002)
-- Generated: 2026-08-08
-- Use: PostgreSQL 14+

BEGIN;

CREATE TABLE IF NOT EXISTS endocrinology_encounters (
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
ALTER TABLE endocrinology_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE endocrinology_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY endocrinology_encounters_tenant ON endocrinology_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON endocrinology_encounters(tenant_id, patient_id);
CREATE INDEX ON endocrinology_encounters(tenant_id, status);

CREATE TABLE IF NOT EXISTS endocrinology_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  encounter_id BIGINT REFERENCES endocrinology_encounters(id),
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
ALTER TABLE endocrinology_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE endocrinology_orders FORCE ROW LEVEL SECURITY;
CREATE POLICY endocrinology_orders_tenant ON endocrinology_orders
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON endocrinology_orders(tenant_id, patient_id);
CREATE INDEX ON endocrinology_orders(tenant_id, status);

CREATE TABLE IF NOT EXISTS endocrinology_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  encounter_id BIGINT REFERENCES endocrinology_encounters(id),
  order_id BIGINT REFERENCES endocrinology_orders(id),
  result_type TEXT NOT NULL,
  result_value TEXT,
  result_unit TEXT,
  reference_range TEXT,
  abnormal_flag TEXT,
  result_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE endocrinology_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE endocrinology_results FORCE ROW LEVEL SECURITY;
CREATE POLICY endocrinology_results_tenant ON endocrinology_results
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON endocrinology_results(tenant_id, patient_id);

CREATE TABLE IF NOT EXISTS endocrinology_notes (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  encounter_id BIGINT REFERENCES endocrinology_encounters(id),
  note_type TEXT NOT NULL DEFAULT 'progress',
  note_text TEXT NOT NULL,
  signed_at TIMESTAMPTZ,
  signed_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE endocrinology_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE endocrinology_notes FORCE ROW LEVEL SECURITY;
CREATE POLICY endocrinology_notes_tenant ON endocrinology_notes
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON endocrinology_notes(tenant_id, patient_id);

COMMIT;