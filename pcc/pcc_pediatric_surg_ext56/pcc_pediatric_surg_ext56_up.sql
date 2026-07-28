-- Auto-generated migration for pcc_pediatric_surg_ext56 (v3.166.0, P3-GX)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'pcc_pediatric_surg_ext56_records')
BEGIN CREATE TABLE pcc_pediatric_surg_ext56_records (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  tenant_id NVARCHAR(64) NOT NULL,
  fn_name NVARCHAR(128) NOT NULL,
  score DECIMAL(8,3) NULL,
  payload NVARCHAR(MAX) NULL,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME())
  CREATE INDEX ix_pcc_pediatric_surg_ext56_records_tenant_fn ON pcc_pediatric_surg_ext56_records(tenant_id, fn_name);
END GO