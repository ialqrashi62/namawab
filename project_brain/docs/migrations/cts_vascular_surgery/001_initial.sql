-- Migration: 001_create_cts_vascular_surgery_tables.sql
-- Up
CREATE TABLE cts_vascular_surgery_orders (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id NVARCHAR(20) NOT NULL,
    type NVARCHAR(50) NOT NULL,
    priority NVARCHAR(20) NOT NULL,
    status NVARCHAR(20) NOT NULL,
    notes NVARCHAR(MAX),
    ordered_at DATETIME DEFAULT GETDATE()
);

-- Down
DROP TABLE cts_vascular_surgery_orders;
