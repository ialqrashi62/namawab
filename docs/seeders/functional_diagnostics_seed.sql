-- Functional Diagnostics Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM functional_diagnostics_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO functional_diagnostics_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Functional Diagnostics consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Functional Diagnostics procedure');
END
GO
PRINT 'Seeded Functional Diagnostics data';
GO
