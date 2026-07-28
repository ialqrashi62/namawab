-- Auto-generated migration for pcc_neuro_ext88 (v3.187.0, P3-IG)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'pcc_neuro_ext88_records')
BEGIN CREATE TABLE pcc_neuro_ext88_records (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  tenant_id NVARCHAR(64) NOT NULL,
  fn_name NVARCHAR(128) NOT NULL,
  score DECIMAL(8,3) NULL,
  payload NVARCHAR(MAX) NULL,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME())
  CREATE INDEX ix_pcc_neuro_ext88_records_tenant_fn ON pcc_neuro_ext88_records(tenant_id, fn_name);
END GO