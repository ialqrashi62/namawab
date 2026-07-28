-- 25_seed_data.sql
-- Dummy seed data for dev/staging only. NEVER run on production.
-- All identifiers are fake. No real PHI.

BEGIN;

-- Assumes a dev tenant exists; replace with actual ID or look up.
DO $$
DECLARE
  v_tenant UUID;
  v_patient UUID;
  v_doctor UUID;
  v_enc UUID;
BEGIN
  -- Pick first tenant (dev only)
  SELECT id INTO v_tenant FROM tenants ORDER BY created_at LIMIT 1;
  IF v_tenant IS NULL THEN
    RAISE NOTICE 'seed: no tenant found, skipping';
    RETURN;
  END IF;

  -- Pick or create a dummy patient
  INSERT INTO patients (id, tenant_id, mrn, name_ar, name_en, dob, sex, created_at)
  VALUES (gen_random_uuid(), v_tenant, 'MRN-DUMMY-001', 'مريض تجريبي', 'Dummy Patient', '1980-01-01', 'M', NOW())
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_patient;
  IF v_patient IS NULL THEN
    SELECT id INTO v_patient FROM patients WHERE tenant_id = v_tenant AND mrn = 'MRN-DUMMY-001' LIMIT 1;
  END IF;

  -- Pick first cardiology user
  SELECT u.id INTO v_doctor
  FROM users u
  JOIN user_roles ur ON ur.user_id = u.id
  JOIN roles r ON r.id = ur.role_id
  WHERE u.tenant_id = v_tenant AND r.name = 'cardiology'
  ORDER BY u.created_at
  LIMIT 1;
  IF v_doctor IS NULL THEN
    SELECT id INTO v_doctor FROM users WHERE tenant_id = v_tenant ORDER BY created_at LIMIT 1;
  END IF;

  -- Set app tenant context (for RLS)
  PERFORM set_config('app.tenant_id', v_tenant::text, false);

  -- Sample encounter
  INSERT INTO cardio_encounters (id, tenant_id, patient_id, doctor_id, type, status, chief_complaint, diagnosis_primary)
  VALUES (gen_random_uuid(), v_tenant, v_patient, v_doctor, 'outpatient', 'open', 'Chest pain on exertion', 'I20.9 Angina pectoris, unspecified')
  RETURNING id INTO v_enc;

  -- Sample ECG (normal sinus)
  INSERT INTO cardio_ecg (id, tenant_id, encounter_id, patient_id, interpreted_by, recorded_at, file_uri, file_hash, rate, rhythm, pr_ms, qrs_ms, qtc_ms, axis_deg, impression, urgency, red_flag)
  VALUES (gen_random_uuid(), v_tenant, v_enc, v_patient, v_doctor, NOW(), '/phi_vault/dev/ecg_dummy_001.dcm', 'sha256:dummy', 72, 'sinus', 160, 90, 410, 60, 'Normal sinus rhythm', 'routine', false);

  -- Sample echo (normal)
  INSERT INTO cardio_echo (id, tenant_id, encounter_id, patient_id, interpreted_by, performed_at, modality, measurements, impression, file_uri, red_flag)
  VALUES (gen_random_uuid(), v_tenant, v_enc, v_patient, v_doctor, NOW(), 'TTE', '{"lv_ef": 60, "lv_size": "normal", "rv_function": "normal", "mv": "mild_mr", "av": "normal"}'::jsonb, 'Normal LV function, mild MR', '/phi_vault/dev/echo_dummy_001.dcm', false);

  -- Sample HF GDMT copilot query
  INSERT INTO cardio_copilot_queries (id, tenant_id, user_id, encounter_id, patient_id, question, intent, answer_ar, evidence_level, red_flag, model, input_tokens, output_tokens, cost_usd)
  VALUES (gen_random_uuid(), v_tenant, v_doctor, v_enc, v_patient, 'ما هو GDMT الأمثل لمريض EF 30%؟', 'rx', 'إضافة SGLT2i + ARNI + beta-blocker + MRA حسب التحمل', 'A', false, 'gpt-4o', 1200, 350, 0.011);

  RAISE NOTICE 'seed: cardio sample data created for tenant %', v_tenant;
END $$;

COMMIT;
