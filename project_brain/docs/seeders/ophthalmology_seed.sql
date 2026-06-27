-- Ophthalmology Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM ophthalmology_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO ophthalmology_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Ophthalmology consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Ophthalmology procedure');
END
GO
PRINT 'Seeded Ophthalmology data';
GO
