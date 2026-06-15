-- Radiology & Imaging Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM radiology_imaging_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO radiology_imaging_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Radiology & Imaging consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Radiology & Imaging procedure');
END
GO
PRINT 'Seeded Radiology & Imaging data';
GO
