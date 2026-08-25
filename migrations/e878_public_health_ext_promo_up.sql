CREATE TABLE IF NOT EXISTS public_health_ext_promo (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_public_health_ext_promo_t ON public_health_ext_promo(tenant_id, patient_id);
ALTER TABLE public_health_ext_promo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_health_ext_promo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_public_health_ext_promo_t ON public_health_ext_promo;
CREATE POLICY p_public_health_ext_promo_t ON public_health_ext_promo USING (tenant_id = current_setting('app.tenant_id', true));
