-- Integrative Medicine Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM integrative_medicine_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO integrative_medicine_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Integrative Medicine consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Integrative Medicine procedure');
END
GO
PRINT 'Seeded Integrative Medicine data';
GO
