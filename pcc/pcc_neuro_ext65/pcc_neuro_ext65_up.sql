-- Auto-generated migration for pcc_neuro_ext65 (v3.164.0, P3-GV)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'pcc_neuro_ext65_records')
BEGIN CREATE TABLE pcc_neuro_ext65_records (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  tenant_id NVARCHAR(64) NOT NULL,
  fn_name NVARCHAR(128) NOT NULL,
  score DECIMAL(8,3) NULL,
  payload NVARCHAR(MAX) NULL,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME())
  CREATE INDEX ix_pcc_neuro_ext65_records_tenant_fn ON pcc_neuro_ext65_records(tenant_id, fn_name);
END GO