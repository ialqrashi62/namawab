-- NamaMedical — Seeder template
-- Synthetic data ONLY. No real PHI. Replace {{...}} placeholders.
-- Idempotent: safe to re-run (uses MERGE / IF NOT EXISTS patterns).

USE master;
GO

-- Pseudonymous patients (Faker-style; KSA-flavored synthetic names)
DECLARE @i INT = 1;
WHILE @i <= 50
BEGIN
    DECLARE @mrn NVARCHAR(20) = CONCAT('P-9', RIGHT('00000' + CAST(@i AS VARCHAR), 5));
    IF NOT EXISTS (SELECT 1 FROM patients WHERE mrn = @mrn)
    BEGIN
        INSERT INTO patients (mrn, name_ar, name_en, dob, sex, nationality, phone)
        VALUES (
            @mrn,
            CHOOSE(@i % 5 + 1, N'محمد العمري', N'فاطمة الزهراني', N'علي القحطاني', N'سارة الشمري', N'عبدالله الدوسري'),
            CHOOSE(@i % 5 + 1, 'Mohammed Al-Omari', 'Fatimah Al-Zahrani', 'Ali Al-Qahtani', 'Sarah Al-Shammari', 'Abdullah Al-Dosari'),
            DATEADD(YEAR, -(20 + @i % 60), GETDATE()),
            CHOOSE(@i % 2 + 1, 'male', 'female'),
            'SA',
            CONCAT('+9665', RIGHT('00000000' + CAST(10000000 + @i AS VARCHAR), 8))
        );
    END
    SET @i = @i + 1;
END
GO

-- Replace below with department-specific seed inserts:
-- INSERT INTO {{dept_key}}_orders (...) VALUES (...);

PRINT 'Seeded {{dept_key}}: 50 patients + dept-specific rows';
GO
