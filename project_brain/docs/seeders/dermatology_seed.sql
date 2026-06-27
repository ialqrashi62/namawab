-- Dermatology Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM dermatology_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO dermatology_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Dermatology consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Dermatology procedure');
END
GO
PRINT 'Seeded Dermatology data';
GO
