-- 25_seed_data.sql
-- PULM-001 dummy seed data. NEVER contains PHI. All per AGENTS.md safety rails 1, 2.

BEGIN;

-- ===== Set tenant context =====
-- For local dev only; production seeds run per-tenant.
SELECT set_config('app.tenant_id', '00000000-0000-0000-0000-000000000001', false);

-- ===== Dummy patients (deidentified) =====
-- Real names/IDs are forbidden. Using TPL seed labels.
INSERT INTO patients (tenant_id, mrn, national_id_hash, name_ciphered, dob_encrypted, sex_encrypted, phone_ciphered, email_ciphered)
VALUES
  ('00000000-0000-0000-0000-000000000001','PULM-TEST-001', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00'),
  ('00000000-0000-0000-0000-000000000001','PULM-TEST-002', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00'),
  ('00000000-0000-0000-0000-000000000001','PULM-TEST-003', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00'),
  ('00000000-0000-0000-0000-000000000001','PULM-TEST-004', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00'),
  ('00000000-0000-0000-0000-000000000001','PULM-TEST-005', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00', E'\\x00');

-- Capture patient IDs into temp
CREATE TEMP TABLE _seed_patients AS
  SELECT id, mrn FROM patients
   WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
     AND mrn LIKE 'PULM-TEST-%';

-- ===== Dummy visits =====
INSERT INTO pulmonary_visits (tenant_id, patient_id, visit_type, chief_complaint, hpi, ros, exam, status)
SELECT '00000000-0000-0000-0000-000000000001', sp.id, 'initial',
       'shortness of breath', 'DUMMY HPI - 1wk dyspnea', 'DUMMY ROS', 'DUMMY EXAM - mild wheeze', 'open'
  FROM _seed_patients sp
 WHERE sp.mrn IN ('PULM-TEST-001','PULM-TEST-002');

INSERT INTO pulmonary_visits (tenant_id, patient_id, visit_type, chief_complaint, hpi, ros, exam, status)
SELECT '00000000-0000-0000-0000-000000000001', sp.id, 'follow_up',
       'asthma follow-up', 'DUMMY HPI - asthma', 'DUMMY ROS', 'DUMMY EXAM', 'completed'
  FROM _seed_patients sp
 WHERE sp.mrn IN ('PULM-TEST-003');

-- ===== Dummy orders =====
INSERT INTO pulmonary_orders (tenant_id, visit_id, order_set_id, orders, status)
SELECT '00000000-0000-0000-0000-000000000001', pv.id, 'OS:PULM:ASTHMA_ACUTE',
       '[{"type":"medication","drug":"salbutamol","dose":"5mg","route":"nebulizer","timing":"STAT"}]'::jsonb,
       'active'
  FROM pulmonary_visits pv
 WHERE pv.chief_complaint LIKE '%asthma%';

-- ===== Dummy PFTs =====
INSERT INTO pulmonary_function_tests (tenant_id, patient_id, test_date, fev1, fvc, fev1_fvc_ratio, dlco, bronchodilator_response, test_quality)
SELECT '00000000-0000-0000-0000-000000000001', sp.id, current_date - 30, 2.4, 3.8, 0.63, 22.0, true, 'acceptable'
  FROM _seed_patients sp
 WHERE sp.mrn = 'PULM-TEST-001';

-- ===== Dummy sleep study =====
INSERT INTO sleep_studies (tenant_id, patient_id, study_type, study_date, ahi, odi, interpretation)
SELECT '00000000-0000-0000-0000-000000000001', sp.id, 'diagnostic', current_date - 14, 18.0, 16.0,
       'DUMMY: moderate OSA — CPAP indicated'
  FROM _seed_patients sp
 WHERE sp.mrn = 'PULM-TEST-005';

-- ===== Dummy AI assessment =====
INSERT INTO ai_assessments (tenant_id, prompt_id, prompt_version, model_target, output, citations, red_flags, confidence_score)
VALUES
  ('00000000-0000-0000-0000-000000000001','PROMPT:PULM-001:initial_assessment','1.4.0','gpt-4o',
   '{"differential":[],"recommendations":[],"red_flags":[],"confidence":0.9}',
   '[{"id":1,"source_type":"gina","document":"GINA 2024"}]'::jsonb,
   '[]'::jsonb, 0.900
  );

-- ===== Dummy pathway run =====
INSERT INTO pulmonary_care_pathways (tenant_id, patient_id, pathway_id, status, current_step)
SELECT '00000000-0000-0000-0000-000000000001', sp.id, 'PATH:ASTHMA_EXACERBATION', 'active', 'trigger'
  FROM _seed_patients sp
 WHERE sp.mrn = 'PULM-TEST-003';

INSERT INTO pulmonary_pathway_steps (tenant_id, pathway_run_id, step_id, entered_at, outcome)
SELECT pcp.tenant_id, pcp.id, 'trigger', now() - INTERVAL '1 hour', 'success'
  FROM pulmonary_care_pathways pcp
 WHERE pcp.pathway_id = 'PATH:ASTHMA_EXACERBATION';

-- ===== Dummy tasks =====
INSERT INTO pulmonary_tasks_v2 (tenant_id, patient_id, visit_id, task_type, title, priority, status, due_at)
SELECT '00000000-0000-0000-0000-000000000001', pv.patient_id, pv.id, 'review',
       'Review CXR for PULM-TEST', 'urgent', 'open', now() + INTERVAL '4 hours'
  FROM pulmonary_visits pv
 WHERE pv.chief_complaint LIKE 'shortness%';

DROP TABLE _seed_patients;

COMMIT;

-- Verify
DO $$
DECLARE v_patients int; v_visits int; v_orders int; v_pfts int; v_sleep int; v_ai int; v_path int;
BEGIN
  SELECT COUNT(*) INTO v_patients FROM patients            WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND mrn LIKE 'PULM-TEST-%';
  SELECT COUNT(*) INTO v_visits   FROM pulmonary_visits   WHERE tenant_id = '00000000-0000-0000-0000-000000000001';
  SELECT COUNT(*) INTO v_orders   FROM pulmonary_orders   WHERE tenant_id = '00000000-0000-0000-0000-000000000001';
  SELECT COUNT(*) INTO v_pfts     FROM pulmonary_function_tests WHERE tenant_id = '00000000-0000-0000-0000-000000000001';
  SELECT COUNT(*) INTO v_sleep    FROM sleep_studies      WHERE tenant_id = '00000000-0000-0000-0000-000000000001';
  SELECT COUNT(*) INTO v_ai       FROM ai_assessments     WHERE tenant_id = '00000000-0000-0000-0000-000000000001';
  SELECT COUNT(*) INTO v_path     FROM pulmonary_care_pathways WHERE tenant_id = '00000000-0000-0000-0000-000000000001';
  RAISE NOTICE 'PULM-001 seed complete: patients=%, visits=%, orders=%, pfts=%, sleep=%, ai=%, pathways=%', v_patients,v_visits,v_orders,v_pfts,v_sleep,v_ai,v_path;
END $$;
