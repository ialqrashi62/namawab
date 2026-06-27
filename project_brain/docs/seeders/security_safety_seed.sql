-- Security & Safety Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM security_safety_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO security_safety_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Security & Safety consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Security & Safety procedure');
END
GO
PRINT 'Seeded Security & Safety data';
GO
