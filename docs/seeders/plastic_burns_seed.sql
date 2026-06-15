-- Plastic Surgery & Burns Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM plastic_burns_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO plastic_burns_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Plastic Surgery & Burns consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Plastic Surgery & Burns procedure');
END
GO
PRINT 'Seeded Plastic Surgery & Burns data';
GO
