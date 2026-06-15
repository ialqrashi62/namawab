-- ED seeder — synthetic visits across CTAS levels + 2 active codes for demo

USE master;
GO

-- 100 ED visits across 24 hours
DECLARE @i INT = 1;
WHILE @i <= 100
BEGIN
    DECLARE @vid UNIQUEIDENTIFIER = NEWID();
    DECLARE @arrived DATETIMEOFFSET = DATEADD(MINUTE, -(@i * 14), SYSDATETIMEOFFSET());
    DECLARE @ctas TINYINT = CHOOSE(@i % 5 + 1, 1, 2, 3, 4, 5);

    INSERT INTO ed_visits (id, visit_number, patient_id, arrival_mode, arrived_at,
                           triage_started_at, triage_completed_at, ctas_level,
                           chief_complaint, seen_by_doctor_at, doctor_id, bed_id,
                           disposition, disposition_at, los_minutes)
    VALUES (
        @vid,
        CONCAT('ED-2026-', RIGHT('000000' + CAST(@i AS VARCHAR), 6)),
        @i,
        CHOOSE(@i % 4 + 1, 'walk-in', 'ambulance', 'walk-in', 'self'),
        @arrived,
        DATEADD(MINUTE, 3, @arrived),
        DATEADD(MINUTE, 5, @arrived),
        @ctas,
        CHOOSE(@i % 8 + 1,
            'Chest pain', 'Shortness of breath', 'Abdominal pain', 'Headache',
            'Trauma — RTA', 'Fever', 'Vomiting', 'Back pain'),
        DATEADD(MINUTE, CHOOSE(@ctas, 5, 15, 30, 60, 120), @arrived),
        14 + (@i % 5),
        CONCAT('ED-B', @i % 20 + 1),
        CHOOSE(@i % 5 + 1, 'discharge', 'admit', 'icu', 'or', 'transfer'),
        DATEADD(MINUTE, CHOOSE(@ctas, 60, 120, 180, 240, 300), @arrived),
        CHOOSE(@ctas, 60, 120, 180, 240, 300)
    );

    -- triage row
    INSERT INTO ed_triage (id, ed_visit_id, nurse_id, pain_score, bp_sys, bp_dia,
                           hr, rr, spo2, temp_c, gcs, weight_kg,
                           ai_suggested_ctas, ai_confidence, final_ctas)
    VALUES (
        NEWID(), @vid, 21 + (@i % 4),
        CASE WHEN @ctas <= 2 THEN 8 ELSE 4 END,
        CASE WHEN @ctas = 1 THEN 90  ELSE 130 END,
        CASE WHEN @ctas = 1 THEN 60  ELSE 80  END,
        CASE WHEN @ctas <= 2 THEN 120 ELSE 80 END,
        CASE WHEN @ctas <= 2 THEN 28 ELSE 16 END,
        CASE WHEN @ctas <= 2 THEN 91 ELSE 98 END,
        CASE WHEN @ctas <= 2 THEN 38.7 ELSE 36.8 END,
        15,
        70 + (@i % 30),
        @ctas,
        0.85 + (@i % 10) * 0.01,
        @ctas
    );

    SET @i = @i + 1;
END

-- Two active codes for demo
INSERT INTO ed_codes (id, ed_visit_id, code_name, activated_at, activated_by)
VALUES
(NEWID(),
 (SELECT TOP 1 id FROM ed_visits WHERE ctas_level = 1 ORDER BY arrived_at DESC),
 'STEMI', DATEADD(MINUTE, -10, SYSDATETIMEOFFSET()), 14),
(NEWID(),
 (SELECT TOP 1 id FROM ed_visits WHERE ctas_level = 2 ORDER BY arrived_at DESC),
 'STROKE', DATEADD(MINUTE, -20, SYSDATETIMEOFFSET()), 14);

-- Sample order bundles
INSERT INTO ed_order_bundles (id, ed_visit_id, protocol_name, applied_by, applied_at, items_json)
VALUES
(NEWID(),
 (SELECT TOP 1 id FROM ed_visits WHERE ctas_level = 1 ORDER BY arrived_at DESC),
 'stemi', 14, SYSDATETIMEOFFSET(),
 '[{"code":"ASA-300","type":"med"},{"code":"NTG-SL","type":"med"},{"code":"TRP-T","type":"lab"},{"code":"ECG-12L","type":"procedure"}]'),
(NEWID(),
 (SELECT TOP 1 id FROM ed_visits WHERE chief_complaint LIKE '%Fever%' ORDER BY arrived_at DESC),
 'sepsis_1h', 14, SYSDATETIMEOFFSET(),
 '[{"code":"BC-x2","type":"lab"},{"code":"LACTATE","type":"lab"},{"code":"NS-30ML-KG","type":"med"},{"code":"PIPTAZ","type":"med"}]');

-- Board snapshot
INSERT INTO ed_board_snapshots (id, snapshot_at, capacity_pct, waiting_count,
                                ctas1_count, ctas2_count, ctas3_count, ctas4_count, ctas5_count,
                                avg_door_to_doctor_min)
VALUES (NEWID(), SYSDATETIMEOFFSET(), 78, 12, 1, 3, 7, 8, 1, 18);

PRINT 'ED seed loaded: 100 visits, 2 codes, 2 bundles, 1 board snapshot';
GO
