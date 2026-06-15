-- Neonatal & Pediatrics Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM neonatal_pediatrics_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO neonatal_pediatrics_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Neonatal & Pediatrics consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Neonatal & Pediatrics procedure');
END
GO
PRINT 'Seeded Neonatal & Pediatrics data';
GO
