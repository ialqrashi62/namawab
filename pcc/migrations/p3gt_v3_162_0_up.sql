-- Combined package migration for v3.162.0 / P3-GT
IF OBJECT_ID('pcc_neuro_ext63_records') IS NULL
  CREATE TABLE pcc_neuro_ext63_records (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    tenant_id NVARCHAR(64) NOT NULL,
    fn_name NVARCHAR(128) NOT NULL,
    score DECIMAL(8,3) NULL,
    payload NVARCHAR(MAX) NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
IF OBJECT_ID('pcc_pediatric_neuro_ext52_records') IS NULL
  CREATE TABLE pcc_pediatric_neuro_ext52_records (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    tenant_id NVARCHAR(64) NOT NULL,
    fn_name NVARCHAR(128) NOT NULL,
    score DECIMAL(8,3) NULL,
    payload NVARCHAR(MAX) NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
IF OBJECT_ID('pcc_pediatric_surg_ext52_records') IS NULL
  CREATE TABLE pcc_pediatric_surg_ext52_records (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    tenant_id NVARCHAR(64) NOT NULL,
    fn_name NVARCHAR(128) NOT NULL,
    score DECIMAL(8,3) NULL,
    payload NVARCHAR(MAX) NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );