-- Centers of Excellence Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM centers_of_excellence_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO centers_of_excellence_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Centers of Excellence consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Centers of Excellence procedure');
END
GO
PRINT 'Seeded Centers of Excellence data';
GO
