-- Quality & Accreditation Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM quality_accreditation_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO quality_accreditation_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Quality & Accreditation consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Quality & Accreditation procedure');
END
GO
PRINT 'Seeded Quality & Accreditation data';
GO
