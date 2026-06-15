-- ENT Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM ent_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO ent_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial ENT consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent ENT procedure');
END
GO
PRINT 'Seeded ENT data';
GO
