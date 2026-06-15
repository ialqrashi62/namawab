-- Rheumatology & Immunology Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM rheum_immunology_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO rheum_immunology_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Rheumatology & Immunology consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Rheumatology & Immunology procedure');
END
GO
PRINT 'Seeded Rheumatology & Immunology data';
GO
