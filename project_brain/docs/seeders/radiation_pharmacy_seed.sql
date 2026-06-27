-- Radiation & Pharmacy Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM radiation_pharmacy_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO radiation_pharmacy_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Radiation & Pharmacy consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Radiation & Pharmacy procedure');
END
GO
PRINT 'Seeded Radiation & Pharmacy data';
GO
