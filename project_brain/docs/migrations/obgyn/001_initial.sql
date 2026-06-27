-- Migration: 001_create_obgyn_tables.sql
-- Up
CREATE TABLE obgyn_orders (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id NVARCHAR(20) NOT NULL,
    type NVARCHAR(50) NOT NULL,
    priority NVARCHAR(20) NOT NULL,
    status NVARCHAR(20) NOT NULL,
    notes NVARCHAR(MAX),
    ordered_at DATETIME DEFAULT GETDATE()
);

-- Down
DROP TABLE obgyn_orders;
