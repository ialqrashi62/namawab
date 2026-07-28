-- pcc_pediatric_neuro_ext34 v3.144.0 migration up
CREATE TABLE IF NOT EXISTS pcc_pediatric_neuro_ext34 (
  id BIGINT IDENTITY PRIMARY KEY,
  tenant_id NVARCHAR(64) NOT NULL,
  fn NVARCHAR(128),
  payload NVARCHAR(MAX),
  ts DATETIME2 DEFAULT SYSUTCDATETIME()
);
