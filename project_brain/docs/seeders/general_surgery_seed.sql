-- General Surgery Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM general_surgery_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO general_surgery_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial General Surgery consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent General Surgery procedure');
END
GO
PRINT 'Seeded General Surgery data';
GO
