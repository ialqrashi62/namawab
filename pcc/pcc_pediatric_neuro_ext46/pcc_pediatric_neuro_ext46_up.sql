-- pcc_pediatric_neuro_ext46 v3.156.0 migration up
CREATE TABLE IF NOT EXISTS pcc_pediatric_neuro_ext46 (
  id BIGINT IDENTITY PRIMARY KEY,
  tenant_id NVARCHAR(64) NOT NULL,
  fn NVARCHAR(128),
  payload NVARCHAR(MAX),
  ts DATETIME2 DEFAULT SYSUTCDATETIME()
);
