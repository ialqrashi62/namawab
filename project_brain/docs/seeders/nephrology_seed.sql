-- Nephrology Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM nephrology_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO nephrology_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Nephrology consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Nephrology procedure');
END
GO
PRINT 'Seeded Nephrology data';
GO
