-- Neurosurgery & Spine Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM neurosurgery_spine_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO neurosurgery_spine_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Neurosurgery & Spine consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Neurosurgery & Spine procedure');
END
GO
PRINT 'Seeded Neurosurgery & Spine data';
GO
