-- V002 — HF program + Device registry

USE master;
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'cardio_hf_program')
CREATE TABLE cardio_hf_program (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id          INT NOT NULL,
    enrolled_at         DATE,
    nyha_class          CHAR(3),
    aha_stage           CHAR(1),
    ef_percent          INT,
    on_arni             BIT,
    on_bb               BIT,
    on_mra              BIT,
    on_sglt2i           BIT,
    last_admission      DATE,
    next_visit          DATE,
    INDEX IX_hf_patient (patient_id),
    INDEX IX_hf_next_visit (next_visit) WHERE next_visit IS NOT NULL
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'cardio_devices')
CREATE TABLE cardio_devices (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id          INT NOT NULL,
    device_type         VARCHAR(20),
    manufacturer        VARCHAR(80),
    model               VARCHAR(80),
    serial_no           VARCHAR(80) UNIQUE,
    implanted_at        DATE,
    implanted_by        INT,
    battery_eri_at      DATE,
    last_interrogation  DATE,
    INDEX IX_dev_patient (patient_id)
);

PRINT 'V002 HF program + Device registry created.';
GO
