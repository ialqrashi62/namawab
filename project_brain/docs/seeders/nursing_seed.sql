-- Nursing Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM nursing_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO nursing_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Nursing consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Nursing procedure');
END
GO
PRINT 'Seeded Nursing data';
GO
