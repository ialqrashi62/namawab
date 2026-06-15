-- Anesthesia & Pain Management Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM anesthesia_pain_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO anesthesia_pain_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Anesthesia & Pain Management consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Anesthesia & Pain Management procedure');
END
GO
PRINT 'Seeded Anesthesia & Pain Management data';
GO
