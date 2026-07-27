-- pcc_pediatric_neuro_ext19 v3.129.0 migration up
CREATE TABLE IF NOT EXISTS pcc_pediatric_neuro_ext19 (
  id BIGINT IDENTITY PRIMARY KEY,
  tenant_id NVARCHAR(64) NOT NULL,
  fn NVARCHAR(128),
  payload NVARCHAR(MAX),
  ts DATETIME2 DEFAULT SYSUTCDATETIME()
);
