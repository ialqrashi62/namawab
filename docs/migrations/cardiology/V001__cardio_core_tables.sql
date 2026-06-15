-- V001 — Cardiology core tables
-- Author: Cardiology Tech Lead
-- Date:   2026-05-13
-- Reversible: NO (forward-only; rollback via snapshot)

USE master;
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'cardio_orders')
CREATE TABLE cardio_orders (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id      INT NOT NULL,
    visit_id        INT NOT NULL,
    order_type      VARCHAR(40) NOT NULL,
    sub_type        VARCHAR(60),
    priority        VARCHAR(10) CHECK (priority IN ('routine','urgent','stat','emergent')),
    indication      NVARCHAR(MAX),
    status          VARCHAR(20) NOT NULL DEFAULT 'requested',
    ordered_by      INT NOT NULL,
    ordered_at      DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    scheduled_for   DATETIMEOFFSET,
    fulfilled_at    DATETIMEOFFSET,
    notes           NVARCHAR(MAX),
    INDEX IX_cardio_orders_patient (patient_id, ordered_at DESC),
    INDEX IX_cardio_orders_status (status) WHERE status IN ('requested','scheduled')
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'cardio_ecg_studies')
CREATE TABLE cardio_ecg_studies (
    id                      UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id              INT NOT NULL,
    visit_id                INT NOT NULL,
    captured_at             DATETIMEOFFSET NOT NULL,
    waveform_blob_url       VARCHAR(500),
    machine_interpretation  NVARCHAR(MAX),
    ai_interpretation       NVARCHAR(MAX),
    ai_confidence           DECIMAL(3,2),
    physician_overread      NVARCHAR(MAX),
    overread_by             INT,
    overread_at             DATETIMEOFFSET,
    INDEX IX_cardio_ecg_patient (patient_id, captured_at DESC)
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'cardio_echo_studies')
CREATE TABLE cardio_echo_studies (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id      INT NOT NULL,
    visit_id        INT NOT NULL,
    study_date      DATE NOT NULL,
    ef_percent      INT,
    lvids_mm        INT,
    e_e_prime       DECIMAL(4,1),
    rwma_segments   NVARCHAR(200),
    valves_json     NVARCHAR(MAX),
    findings        NVARCHAR(MAX),
    impression      NVARCHAR(MAX),
    reported_by     INT,
    reported_at     DATETIMEOFFSET
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'cardio_cath_cases')
CREATE TABLE cardio_cath_cases (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id      INT NOT NULL,
    visit_id        INT NOT NULL,
    case_date       DATE NOT NULL,
    operator_id     INT,
    access          VARCHAR(20),
    contrast_ml     INT,
    fluoro_min      DECIMAL(5,1),
    syntax_score    INT,
    pci_done        BIT,
    stents_used     INT,
    stent_types     NVARCHAR(300),
    complications   NVARCHAR(MAX),
    outcome         VARCHAR(40)
);

PRINT 'V001 cardio core tables created.';
GO
