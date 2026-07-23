-- rad_up.sql
CREATE TABLE rad_studies (id BIGSERIAL PK, tenant_id UUID, patient_id BIGINT, modality VARCHAR(10), body_part VARCHAR(50), study_at TIMESTAMPTZ, status VARCHAR(20), report TEXT, radiologist_id BIGINT);
RLS + FORCE enabled.
