-- Hematology & Oncology Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM hemato_oncology_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO hemato_oncology_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Hematology & Oncology consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Hematology & Oncology procedure');
END
GO
PRINT 'Seeded Hematology & Oncology data';
GO
