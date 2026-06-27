-- OBGYN Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM obgyn_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO obgyn_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial OBGYN consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent OBGYN procedure');
END
GO
PRINT 'Seeded OBGYN data';
GO
