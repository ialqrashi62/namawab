-- V001 — Lab extensions (panels, critical calls, microbiology, genetics, blood bank)

USE master;
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'lab_panels')
CREATE TABLE lab_panels (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name            VARCHAR(60),
    tests_json      NVARCHAR(MAX)
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'lab_critical_calls')
CREATE TABLE lab_critical_calls (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    result_id           INT,
    called_at           DATETIMEOFFSET,
    called_to_user_id   INT,
    read_back_ok        BIT,
    caller_id           INT
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'micro_cultures')
CREATE TABLE micro_cultures (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    sample_id           INT,
    source              VARCHAR(40),
    organism            VARCHAR(80),
    preliminary_at      DATETIMEOFFSET,
    final_at            DATETIMEOFFSET,
    sensitivities_json  NVARCHAR(MAX),
    mdro                BIT
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'lab_genetics_reports')
CREATE TABLE lab_genetics_reports (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id          INT NOT NULL,
    test_type           VARCHAR(40),
    result_json         NVARCHAR(MAX),
    variants_acmg       NVARCHAR(MAX),
    reported_at         DATETIMEOFFSET,
    counsel_required    BIT
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'bb_units')
CREATE TABLE bb_units (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    unit_no         VARCHAR(40) UNIQUE NOT NULL,
    product         VARCHAR(20),
    abo             CHAR(2),
    rh              CHAR(3),
    volume_ml       INT,
    collected_at    DATETIMEOFFSET,
    expiry          DATETIMEOFFSET,
    status          VARCHAR(20)
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'bb_crossmatch')
CREATE TABLE bb_crossmatch (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id      INT NOT NULL,
    unit_id         UNIQUEIDENTIFIER NOT NULL REFERENCES bb_units(id),
    abo_compat      BIT,
    ab_screen_neg   BIT,
    crossmatch_ok   BIT,
    performed_at    DATETIMEOFFSET
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'bb_transfusions')
CREATE TABLE bb_transfusions (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id      INT NOT NULL,
    unit_id         UNIQUEIDENTIFIER NOT NULL REFERENCES bb_units(id),
    start_at        DATETIMEOFFSET,
    end_at          DATETIMEOFFSET,
    reaction        VARCHAR(40),
    notes           NVARCHAR(MAX)
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'lab_apheresis')
CREATE TABLE lab_apheresis (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id          INT NOT NULL,
    type                VARCHAR(40),
    date                DATE,
    volume_processed_ml INT,
    replacement         VARCHAR(40)
);

PRINT 'V001 Lab extensions created.';
GO
