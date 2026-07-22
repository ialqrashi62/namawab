# Seed Data — Cardiology (DUMMY ONLY, no real PHI)

> **Owner:** Architect
> **Date:** 2026-07-22
> **Purpose:** Load test data + demos
> **Safety:** All names, IDs, dates are fictional. No real PHI.

---

```sql
-- Tenant 1: demo hospital
-- All patient_ids are fake. All names are obviously fake.

-- Test patient 1: heart failure
INSERT INTO echo_reports (tenant_id, patient_id, study_date, study_type, lvef_percent, valve_assessment, signed_by, signed_at)
VALUES
  (1, 9001, '2026-07-15 10:00:00+03', 'tte', 30, 'Mild MR', 100, '2026-07-15 14:00:00+03'),
  (1, 9001, '2026-04-15 10:00:00+03', 'tte', 35, 'Mild MR', 100, '2026-04-15 14:00:00+03'),
  (1, 9001, '2026-01-15 10:00:00+03', 'tte', 40, 'Trace MR', 100, '2026-01-15 14:00:00+03');

-- Test patient 2: AF on anticoagulation
INSERT INTO ecg_archive (tenant_id, patient_id, study_date, ecg_type, rhythm, rate_bpm, pr_ms, qrs_ms, qt_ms, qtc_ms, signed_by)
VALUES
  (1, 9002, '2026-07-22 10:15:00+03', '12_lead', 'Atrial fibrillation', 112, NULL, 88, 360, 442, 100),
  (1, 9002, '2026-07-15 09:00:00+03', '12_lead', 'Sinus rhythm', 72, 160, 90, 380, 415, 100);

-- Test patient 3: post-PCI
INSERT INTO cardiac_procedures (tenant_id, patient_id, procedure_type, indication, status, scheduled_at, started_at, completed_at, operator_id, cpt_code)
VALUES
  (1, 9003, 'pci', 'STEMI — LAD occlusion', 'completed', '2026-07-20 14:00:00+03', '2026-07-20 14:35:00+03', '2026-07-20 15:30:00+03', 101, '92928'),
  (1, 9003, 'cath', 'STEMI workup', 'completed', '2026-07-20 14:00:00+03', '2026-07-20 14:35:00+03', '2026-07-20 15:30:00+03', 101, '93458');

-- Test patient 4: scheduled for TAVR
INSERT INTO cardiac_procedures (tenant_id, patient_id, procedure_type, indication, status, scheduled_at, operator_id)
VALUES
  (1, 9004, 'tavr', 'Severe AS, NYHA III, high surgical risk', 'scheduled', '2026-08-05 09:00:00+03', 102);

-- Test patient 5: anticoagulation clinic
INSERT INTO anticoagulation_clinic_visits (tenant_id, patient_id, visit_date, inr_value, warfarin_dose_mg, trend_arrow, next_visit_date)
VALUES
  (1, 9005, '2026-07-22', 2.4, 5.0, 'stable', '2026-07-29'),
  (1, 9005, '2026-07-15', 2.6, 5.0, 'stable', '2026-07-22'),
  (1, 9005, '2026-07-08', 2.2, 5.0, 'up', '2026-07-15'),
  (1, 9005, '2026-07-01', 1.8, 5.0, 'down', '2026-07-08');

-- Test patient 6: cardiac rehab
INSERT INTO cardiac_rehab_enrollment (tenant_id, patient_id, enrollment_date, indication, sessions_attended, sessions_total, completion_status)
VALUES
  (1, 9006, '2026-07-01', 'post_pci', 8, 36, 'active'),
  (1, 9007, '2026-06-15', 'post_cabg', 12, 36, 'active'),
  (1, 9008, '2026-04-01', 'post_mi', 24, 36, 'active');

-- Test patient 9: stress test
INSERT INTO stress_tests (tenant_id, patient_id, study_date, test_type, protocol, duration_minutes, max_hr_achieved, max_hr_predicted, hr_percent_predicted, result, signed_by)
VALUES
  (1, 9009, '2026-07-20 14:00:00+03', 'exercise_treadmill', 'bruce', 9.5, 156, 170, 92, 'negative', 100);
```

## Test patient profile (for demos)

| ID | Name (fake) | Age | Condition |
|---|---|---|---|
| 9001 | TEST-PT-A | 62 | HFrEF, LVEF 30% |
| 9002 | TEST-PT-B | 65 | New AF, RVR |
| 9003 | TEST-PT-C | 58 | Post-STEMI, s/p PCI |
| 9004 | TEST-PT-D | 78 | Severe AS, scheduled TAVR |
| 9005 | TEST-PT-E | 71 | AF on warfarin |
| 9006 | TEST-PT-F | 55 | Post-PCI, in rehab |
| 9007 | TEST-PT-G | 67 | Post-CABG |
| 9008 | TEST-PT-H | 50 | Recent MI |
| 9009 | TEST-PT-I | 60 | Abnormal stress test, normal cath |

---

End of seed data.
