-- Migration: 001_create_gastro_hepato_tables.sql
-- Up
CREATE TABLE gastro_orders (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id NVARCHAR(20) NOT NULL,
    type NVARCHAR(50) NOT NULL,
    priority NVARCHAR(20) NOT NULL,
    status NVARCHAR(20) NOT NULL,
    notes NVARCHAR(MAX),
    ordered_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_gastro_orders_patients FOREIGN KEY (patient_id) REFERENCES patients(mrn)
);

CREATE TABLE gastro_endoscopy_reports (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    order_id UNIQUEIDENTIFIER NOT NULL,
    findings NVARCHAR(MAX) NOT NULL,
    biopsy_taken BIT DEFAULT 0,
    complications NVARCHAR(MAX),
    reported_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_gastro_endoscopy_orders FOREIGN KEY (order_id) REFERENCES gastro_orders(id)
);

-- Down
DROP TABLE gastro_endoscopy_reports;
DROP TABLE gastro_orders;
