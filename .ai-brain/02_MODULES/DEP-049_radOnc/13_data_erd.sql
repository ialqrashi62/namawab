-- ERD for Radiation_Oncology (DEP-049)
-- Generated: 2026-08-08
-- Use: PostgreSQL 14+

BEGIN;

CREATE TABLE IF NOT EXISTS radOnc_encounters (
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
ALTER TABLE radOnc_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE radOnc_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY radOnc_encounters_tenant ON radOnc_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON radOnc_encounters(tenant_id, patient_id);
CREATE INDEX ON radOnc_encounters(tenant_id, status);

CREATE TABLE IF NOT EXISTS radOnc_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  encounter_id BIGINT REFERENCES radOnc_encounters(id),
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
ALTER TABLE radOnc_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE radOnc_orders FORCE ROW LEVEL SECURITY;
CREATE POLICY radOnc_orders_tenant ON radOnc_orders
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON radOnc_orders(tenant_id, patient_id);
CREATE INDEX ON radOnc_orders(tenant_id, status);

CREATE TABLE IF NOT EXISTS radOnc_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  encounter_id BIGINT REFERENCES radOnc_encounters(id),
  order_id BIGINT REFERENCES radOnc_orders(id),
  result_type TEXT NOT NULL,
  result_value TEXT,
  result_unit TEXT,
  reference_range TEXT,
  abnormal_flag TEXT,
  result_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE radOnc_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE radOnc_results FORCE ROW LEVEL SECURITY;
CREATE POLICY radOnc_results_tenant ON radOnc_results
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON radOnc_results(tenant_id, patient_id);

CREATE TABLE IF NOT EXISTS radOnc_notes (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  encounter_id BIGINT REFERENCES radOnc_encounters(id),
  note_type TEXT NOT NULL DEFAULT 'progress',
  note_text TEXT NOT NULL,
  signed_at TIMESTAMPTZ,
  signed_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE radOnc_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE radOnc_notes FORCE ROW LEVEL SECURITY;
CREATE POLICY radOnc_notes_tenant ON radOnc_notes
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON radOnc_notes(tenant_id, patient_id);

COMMIT;