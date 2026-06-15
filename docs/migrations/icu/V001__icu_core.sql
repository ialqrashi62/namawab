-- V001 — ICU core tables

USE master;
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'icu_admissions')
CREATE TABLE icu_admissions (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id      INT NOT NULL,
    visit_id        INT NOT NULL,
    unit            VARCHAR(20),
    admit_at        DATETIMEOFFSET NOT NULL,
    discharge_at    DATETIMEOFFSET,
    source          VARCHAR(20),
    apache_ii       INT,
    sofa_admit      INT,
    outcome         VARCHAR(20)
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'icu_vital_streams')
CREATE TABLE icu_vital_streams (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    admission_id    UNIQUEIDENTIFIER NOT NULL REFERENCES icu_admissions(id),
    recorded_at     DATETIMEOFFSET NOT NULL,
    hr              INT,
    bp_sys          INT,
    bp_dia          INT,
    map             INT,
    rr              INT,
    spo2            INT,
    temp_c          DECIMAL(3,1),
    etco2           INT,
    cvp             INT,
    INDEX IX_icu_vital_admission_time (admission_id, recorded_at DESC)
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'icu_vent_settings')
CREATE TABLE icu_vent_settings (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    admission_id    UNIQUEIDENTIFIER NOT NULL REFERENCES icu_admissions(id),
    set_at          DATETIMEOFFSET NOT NULL,
    mode            VARCHAR(20),
    tv_ml           INT,
    rr              INT,
    peep            INT,
    fio2            DECIMAL(3,2),
    pinsp           INT,
    pplat           INT,
    p_driving       INT
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'icu_sedation')
CREATE TABLE icu_sedation (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    admission_id    UNIQUEIDENTIFIER NOT NULL REFERENCES icu_admissions(id),
    recorded_at     DATETIMEOFFSET NOT NULL,
    rass            INT,
    cpot            INT,
    drug            VARCHAR(40),
    rate            VARCHAR(20),
    sat_today       BIT,
    sbt_today       BIT
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'icu_drips')
CREATE TABLE icu_drips (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    admission_id    UNIQUEIDENTIFIER NOT NULL REFERENCES icu_admissions(id),
    drug            VARCHAR(40),
    rate            VARCHAR(40),
    changed_at      DATETIMEOFFSET,
    changed_by      INT
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'icu_scores_stream')
CREATE TABLE icu_scores_stream (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    admission_id        UNIQUEIDENTIFIER NOT NULL REFERENCES icu_admissions(id),
    computed_at         DATETIMEOFFSET NOT NULL,
    sofa                INT,
    news2               INT,
    qsofa               INT,
    gcs                 INT,
    fast_hug_bid_json   NVARCHAR(MAX)
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'icu_handover')
CREATE TABLE icu_handover (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    admission_id    UNIQUEIDENTIFIER NOT NULL REFERENCES icu_admissions(id),
    done_at         DATETIMEOFFSET,
    from_user_id    INT,
    to_user_id      INT,
    sbar            NVARCHAR(MAX)
);

PRINT 'V001 ICU core tables created.';
GO
