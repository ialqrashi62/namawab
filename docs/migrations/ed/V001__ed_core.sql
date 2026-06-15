-- V001 — ED core tables

USE master;
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'ed_visits')
CREATE TABLE ed_visits (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    visit_number        VARCHAR(20) UNIQUE NOT NULL,
    patient_id          INT NOT NULL,
    arrival_mode        VARCHAR(20),
    arrived_at          DATETIMEOFFSET NOT NULL,
    triage_started_at   DATETIMEOFFSET,
    triage_completed_at DATETIMEOFFSET,
    ctas_level          TINYINT CHECK (ctas_level BETWEEN 1 AND 5),
    chief_complaint     NVARCHAR(500),
    seen_by_doctor_at   DATETIMEOFFSET,
    doctor_id           INT,
    bed_id              VARCHAR(20),
    disposition         VARCHAR(30),
    disposition_at      DATETIMEOFFSET,
    los_minutes         INT,
    INDEX IX_ed_visits_arrived (arrived_at DESC),
    INDEX IX_ed_visits_active (disposition) WHERE disposition IS NULL
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'ed_triage')
CREATE TABLE ed_triage (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ed_visit_id         UNIQUEIDENTIFIER NOT NULL REFERENCES ed_visits(id),
    nurse_id            INT,
    pain_score          TINYINT,
    bp_sys              INT,
    bp_dia              INT,
    hr                  INT,
    rr                  INT,
    spo2                INT,
    temp_c              DECIMAL(3,1),
    gcs                 TINYINT,
    weight_kg           DECIMAL(5,2),
    allergies_text      NVARCHAR(MAX),
    ai_suggested_ctas   TINYINT,
    ai_confidence       DECIMAL(3,2),
    final_ctas          TINYINT
);

PRINT 'V001 ED core tables created.';
GO
