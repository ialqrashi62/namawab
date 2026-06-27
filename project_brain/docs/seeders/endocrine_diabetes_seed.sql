-- Endocrinology & Diabetes Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM endocrine_diabetes_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO endocrine_diabetes_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial Endocrinology & Diabetes consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent Endocrinology & Diabetes procedure');
END
GO
PRINT 'Seeded Endocrinology & Diabetes data';
GO
