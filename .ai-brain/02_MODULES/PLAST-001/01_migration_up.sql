-- plast_up.sql
CREATE TABLE plast_consults (id BIGSERIAL PK, tenant_id UUID, patient_id BIGINT, consult_at TIMESTAMPTZ, defect_type VARCHAR(50), flap_planned VARCHAR(50), status VARCHAR(20));
RLS+FORCE.
