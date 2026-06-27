-- Pediatric Subspecialties Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM pediatric_subspec_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO pediatric_subspec_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Pediatric Subspecialties consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Pediatric Subspecialties procedure');
END
GO
PRINT 'Seeded Pediatric Subspecialties data';
GO
