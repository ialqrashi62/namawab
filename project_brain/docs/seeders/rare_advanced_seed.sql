-- Rare & Advanced Diseases Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM rare_advanced_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO rare_advanced_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Rare & Advanced Diseases consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Rare & Advanced Diseases procedure');
END
GO
PRINT 'Seeded Rare & Advanced Diseases data';
GO
