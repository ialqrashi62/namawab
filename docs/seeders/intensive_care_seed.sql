-- Intensive Care Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM intensive_care_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO intensive_care_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Intensive Care consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Intensive Care procedure');
END
GO
PRINT 'Seeded Intensive Care data';
GO
