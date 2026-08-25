-- UP Radiology & Imaging
CREATE TABLE IF NOT EXISTS rad_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rad_orders_tenant ON rad_orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rad_orders_patient ON rad_orders(patient_id);
ALTER TABLE rad_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_rad_orders_tenant ON rad_orders;
CREATE POLICY p_rad_orders_tenant ON rad_orders USING (tenant_id = current_setting('app.tenant_id')::uuid);
