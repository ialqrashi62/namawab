-- Auto-generated migration for pcc_pediatric_neuro_ext59 (v3.169.0, P3-HA)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'pcc_pediatric_neuro_ext59_records')
BEGIN CREATE TABLE pcc_pediatric_neuro_ext59_records (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  tenant_id NVARCHAR(64) NOT NULL,
  fn_name NVARCHAR(128) NOT NULL,
  score DECIMAL(8,3) NULL,
  payload NVARCHAR(MAX) NULL,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME())
  CREATE INDEX ix_pcc_pediatric_neuro_ext59_records_tenant_fn ON pcc_pediatric_neuro_ext59_records(tenant_id, fn_name);
END GO