-- adm_110 seed (PHI-free dummy data)
BEGIN;
SELECT set_config('app.tenant_id','00000000-0000-0000-0000-000000000001', false);

INSERT INTO patients (tenant_id, mrn, national_id_hash, name_ciphered, dob_encrypted, sex_encrypted, phone_ciphered, email_ciphered)
VALUES ('00000000-0000-0000-0000-000000000001','ADM110-TEST-001', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00')
ON CONFLICT DO NOTHING;

CREATE TEMP TABLE _seed_adm_110_pat AS
  SELECT id, mrn FROM patients WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND mrn='ADM110-TEST-001';

INSERT INTO adm_110_visits (tenant_id, patient_id, status, chief_complaint)
SELECT '00000000-0000-0000-0000-000000000001', sp.id, 'open', 'DUMMY complaint'
  FROM _seed_adm_110_pat sp;

INSERT INTO adm_110_results (tenant_id, visit_id, test_name, value_text)
SELECT '00000000-0000-0000-0000-000000000001', v.id, 'dummy_test', 'NORMAL'
  FROM adm_110_visits v;

DROP TABLE _seed_adm_110_pat;
COMMIT;
