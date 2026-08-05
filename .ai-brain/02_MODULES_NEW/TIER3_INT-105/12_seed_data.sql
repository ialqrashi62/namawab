-- int_105 seed (PHI-free dummy data)
BEGIN;
SELECT set_config('app.tenant_id','00000000-0000-0000-0000-000000000001', false);

INSERT INTO patients (tenant_id, mrn, national_id_hash, name_ciphered, dob_encrypted, sex_encrypted, phone_ciphered, email_ciphered)
VALUES ('00000000-0000-0000-0000-000000000001','INT105-TEST-001', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00')
ON CONFLICT DO NOTHING;

CREATE TEMP TABLE _seed_int_105_pat AS
  SELECT id, mrn FROM patients WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND mrn='INT105-TEST-001';

INSERT INTO int_105_visits (tenant_id, patient_id, status, chief_complaint)
SELECT '00000000-0000-0000-0000-000000000001', sp.id, 'open', 'DUMMY complaint'
  FROM _seed_int_105_pat sp;

INSERT INTO int_105_results (tenant_id, visit_id, test_name, value_text)
SELECT '00000000-0000-0000-0000-000000000001', v.id, 'dummy_test', 'NORMAL'
  FROM int_105_visits v;

DROP TABLE _seed_int_105_pat;
COMMIT;
