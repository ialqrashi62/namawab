-- V001 — Radiology core (orders, studies, reports, AI results, contrast safety, NM)

USE master;
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'rad_orders')
CREATE TABLE rad_orders (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id          INT NOT NULL,
    visit_id            INT NOT NULL,
    modality            VARCHAR(20),
    region              VARCHAR(40),
    priority            VARCHAR(10),
    indication          NVARCHAR(300),
    contraindications   NVARCHAR(MAX),
    approved_by         INT,
    scheduled_at        DATETIMEOFFSET
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'rad_studies')
CREATE TABLE rad_studies (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    order_id        UNIQUEIDENTIFIER NOT NULL REFERENCES rad_orders(id),
    performed_at    DATETIMEOFFSET,
    dicom_uid       VARCHAR(120),
    pacs_url        VARCHAR(500),
    dose_dlp        DECIMAL(8,2),
    ctdi            DECIMAL(6,2),
    contrast_ml     INT,
    technologist_id INT
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'rad_reports')
CREATE TABLE rad_reports (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    study_id        UNIQUEIDENTIFIER NOT NULL REFERENCES rad_studies(id),
    technique       NVARCHAR(MAX),
    findings        NVARCHAR(MAX),
    impression      NVARCHAR(MAX),
    reported_by     INT,
    reported_at     DATETIMEOFFSET,
    addendum        NVARCHAR(MAX)
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'rad_ai_results')
CREATE TABLE rad_ai_results (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    study_id        UNIQUEIDENTIFIER NOT NULL REFERENCES rad_studies(id),
    ai_model        VARCHAR(60),
    version         VARCHAR(20),
    result_json     NVARCHAR(MAX),
    confidence      DECIMAL(3,2),
    processed_at    DATETIMEOFFSET
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'rad_contrast_safety')
CREATE TABLE rad_contrast_safety (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id      INT NOT NULL,
    egfr            DECIMAL(4,1),
    allergies       NVARCHAR(300),
    thyroid_status  VARCHAR(20),
    metformin_held  BIT,
    cleared_at      DATETIMEOFFSET
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'nm_isotope_inventory')
CREATE TABLE nm_isotope_inventory (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    isotope         VARCHAR(20),
    activity_mci    DECIMAL(8,2),
    calibrated_at   DATETIMEOFFSET,
    lot             VARCHAR(40)
);

PRINT 'V001 Radiology core created.';
GO
