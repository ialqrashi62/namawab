-- picu_up.sql
CREATE TABLE picu_admissions (id BIGSERIAL PK, tenant_id UUID, patient_id BIGINT, admitted_at TIMESTAMPTZ, primary_dx TEXT, prism_score INT, vents VARCHAR(20), status VARCHAR(20));
RLS + FORCE.
