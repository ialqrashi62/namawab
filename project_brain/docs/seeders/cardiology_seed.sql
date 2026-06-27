-- Cardiology seeder — synthetic cohort
-- Patients with CAD/AFib/HF profiles + ECG, echo, cath cases, devices, HF program.

USE master;
GO

-- 30 cardio orders (mix cath/echo/ecg/holter)
DECLARE @j INT = 1;
WHILE @j <= 30
BEGIN
    INSERT INTO cardio_orders (id, patient_id, visit_id, order_type, sub_type, priority,
                               indication, status, ordered_by, ordered_at, scheduled_for)
    VALUES (
        NEWID(),
        @j,
        @j * 10,
        CHOOSE(@j % 4 + 1, 'cath', 'echo', 'ecg', 'holter'),
        CHOOSE(@j % 4 + 1, 'diagnostic', 'tte', '12-lead', '24h'),
        CHOOSE(@j % 4 + 1, 'urgent', 'routine', 'routine', 'routine'),
        CHOOSE(@j % 5 + 1,
            'NSTEMI rule-out',
            'Heart failure follow-up',
            'Pre-op risk',
            'Atrial fibrillation new',
            'Chest pain workup'),
        CHOOSE(@j % 3 + 1, 'requested', 'scheduled', 'fulfilled'),
        14,
        SYSDATETIMEOFFSET(),
        DATEADD(DAY, @j % 10, SYSDATETIMEOFFSET())
    );
    SET @j = @j + 1;
END

-- 10 ECG studies with AI labels
DECLARE @k INT = 1;
WHILE @k <= 10
BEGIN
    INSERT INTO cardio_ecg_studies (id, patient_id, visit_id, captured_at,
                                    waveform_blob_url, machine_interpretation,
                                    ai_interpretation, ai_confidence)
    VALUES (
        NEWID(), @k, @k * 10,
        DATEADD(MINUTE, -(@k * 30), SYSDATETIMEOFFSET()),
        CONCAT('s3://nama-blobs/ecg/', NEWID(), '.dcm'),
        CHOOSE(@k % 4 + 1,
            'Sinus rhythm, normal axis',
            'Atrial fibrillation, controlled',
            'STEMI anterior',
            'NSTEMI possible'),
        CHOOSE(@k % 4 + 1,
            'normal',
            'afib_controlled',
            'stemi_anterior',
            'nstemi_suspected'),
        CHOOSE(@k % 4 + 1, 0.92, 0.88, 0.94, 0.78)
    );
    SET @k = @k + 1;
END

-- 5 echo studies
DECLARE @e INT = 1;
WHILE @e <= 5
BEGIN
    INSERT INTO cardio_echo_studies (id, patient_id, visit_id, study_date,
                                     ef_percent, lvids_mm, e_e_prime, rwma_segments,
                                     valves_json, findings, impression, reported_by, reported_at)
    VALUES (
        NEWID(), @e, @e * 10, DATEADD(DAY, -@e, GETDATE()),
        CHOOSE(@e % 5 + 1, 60, 45, 35, 55, 25),
        CHOOSE(@e % 5 + 1, 42, 50, 58, 45, 65),
        CHOOSE(@e % 5 + 1, 8.0, 12.0, 16.5, 9.5, 18.0),
        CHOOSE(@e % 3 + 1, 'none', 'apical hypokinesis', 'inferior akinesis'),
        '{"mv":"trivial MR","av":"normal","tv":"trivial TR","pv":"normal"}',
        CHOOSE(@e % 3 + 1, 'Normal LV size and function', 'LV systolic dysfunction', 'Severe LV dysfunction with apical hypokinesis'),
        CHOOSE(@e % 3 + 1, 'Normal echo', 'Mild HF', 'Severe HF — likely ischemic'),
        14, SYSDATETIMEOFFSET()
    );
    SET @e = @e + 1;
END

-- 3 cath cases
INSERT INTO cardio_cath_cases (id, patient_id, visit_id, case_date, operator_id,
                               access, contrast_ml, fluoro_min, syntax_score,
                               pci_done, stents_used, stent_types, complications, outcome)
VALUES
(NEWID(), 1, 10, DATEADD(DAY, -7, GETDATE()), 14, 'radial-r', 120, 18.5, 12, 1, 1, 'DES Promus', NULL, 'success'),
(NEWID(), 5, 50, DATEADD(DAY, -3, GETDATE()), 14, 'radial-r',  90, 12.2,  6, 0, 0, NULL, NULL, 'diagnostic_only'),
(NEWID(), 7, 70, DATEADD(DAY, -1, GETDATE()), 15, 'femoral-r',150, 25.0, 22, 1, 2, 'DES Xience x2', 'minor groin hematoma', 'success_complicated');

-- 5 implanted devices
INSERT INTO cardio_devices (id, patient_id, device_type, manufacturer, model, serial_no,
                            implanted_at, implanted_by, battery_eri_at, last_interrogation)
VALUES
(NEWID(), 2, 'pacemaker',  'Medtronic', 'Azure XT DR', 'MDT-001234', '2023-06-12', 14, '2031-06-12', '2026-04-15'),
(NEWID(), 4, 'icd',        'Boston Sci','Resonate X4', 'BSC-005678', '2024-02-18', 14, '2034-02-18', '2026-04-20'),
(NEWID(), 6, 'crt-d',      'Abbott',    'Quadra Assura','ABT-009012','2024-09-01', 15, '2034-09-01', '2026-04-22'),
(NEWID(), 8, 'crt-p',      'Medtronic', 'Percepta',    'MDT-013579', '2025-01-10', 15, '2035-01-10', '2026-05-01'),
(NEWID(),10, 'loop_recorder','Medtronic','LINQ II',    'MDT-024680', '2025-08-22', 14, '2028-08-22', '2026-05-10');

-- 8 HF program enrollments
DECLARE @h INT = 1;
WHILE @h <= 8
BEGIN
    INSERT INTO cardio_hf_program (id, patient_id, enrolled_at, nyha_class, aha_stage,
                                   ef_percent, on_arni, on_bb, on_mra, on_sglt2i,
                                   last_admission, next_visit)
    VALUES (
        NEWID(), @h * 2, DATEADD(MONTH, -3, GETDATE()),
        CHOOSE(@h % 4 + 1, 'I', 'II', 'III', 'IV'),
        CHOOSE(@h % 4 + 1, 'A', 'B', 'C', 'D'),
        CHOOSE(@h % 4 + 1, 60, 45, 35, 25),
        IIF(@h % 2 = 0, 1, 0),
        1,
        IIF(@h % 3 = 0, 1, 0),
        1,
        DATEADD(MONTH, -1, GETDATE()),
        DATEADD(MONTH, 1, GETDATE())
    );
    SET @h = @h + 1;
END

PRINT 'Cardiology seed loaded: 30 orders, 10 ECGs, 5 echos, 3 cath, 5 devices, 8 HF';
GO
