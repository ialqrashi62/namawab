-- Migration: 001_create_anesthesia_pain_tables.sql
-- Up
CREATE TABLE anesthesia_pain_orders (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id NVARCHAR(20) NOT NULL,
    type NVARCHAR(50) NOT NULL,
    priority NVARCHAR(20) NOT NULL,
    status NVARCHAR(20) NOT NULL,
    notes NVARCHAR(MAX),
    ordered_at DATETIME DEFAULT GETDATE()
);

-- Down
DROP TABLE anesthesia_pain_orders;
