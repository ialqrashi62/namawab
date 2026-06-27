-- Rehabilitation & PT Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM rehab_pt_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO rehab_pt_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Rehabilitation & PT consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Rehabilitation & PT procedure');
END
GO
PRINT 'Seeded Rehabilitation & PT data';
GO
