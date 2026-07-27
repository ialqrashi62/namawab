-- pcc_pediatric_neuro_ext4 v3.114.0 migration up
CREATE TABLE IF NOT EXISTS pcc_pediatric_neuro_ext4 (
  id BIGINT IDENTITY PRIMARY KEY,
  tenant_id NVARCHAR(64) NOT NULL,
  fn NVARCHAR(128),
  payload NVARCHAR(MAX),
  ts DATETIME2 DEFAULT SYSUTCDATETIME()
);
