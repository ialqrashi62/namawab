-- Social & Psychology Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM social_psych_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO social_psych_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Social & Psychology consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Social & Psychology procedure');
END
GO
PRINT 'Seeded Social & Psychology data';
GO
