-- derm_001 seed (PHI-free dummy data)
BEGIN;
SELECT set_config('app.tenant_id','00000000-0000-0000-0000-000000000001', false);

INSERT INTO patients (tenant_id, mrn, national_id_hash, name_ciphered, dob_encrypted, sex_encrypted, phone_ciphered, email_ciphered)
VALUES ('00000000-0000-0000-0000-000000000001','DERM001-TEST-001', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00')
ON CONFLICT DO NOTHING;

CREATE TEMP TABLE _seed_derm_001_pat AS
  SELECT id, mrn FROM patients
   WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND mrn = 'DERM001-TEST-001';

INSERT INTO derm_001_visits (tenant_id, patient_id, visit_type, chief_complaint, status)
SELECT '00000000-0000-0000-0000-000000000001', sp.id, 'initial', 'DUMMY complaint', 'open'
  FROM _seed_derm_001_pat sp;

INSERT INTO derm_001_results (tenant_id, visit_id, test_type, test_name, value_num, value_text, abnormal_flag, resulted_at)
SELECT '00000000-0000-0000-0000-000000000001', v.id, 'lab', 'dummy_test', 1.0, 'NORMAL', 'N', now()
  FROM derm_001_visits v;

DROP TABLE _seed_derm_001_pat;
COMMIT;
