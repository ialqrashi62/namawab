-- Education & Research Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM education_research_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO education_research_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Education & Research consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Education & Research procedure');
END
GO
PRINT 'Seeded Education & Research data';
GO
