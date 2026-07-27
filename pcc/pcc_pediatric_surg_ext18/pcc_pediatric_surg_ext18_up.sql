-- pcc_pediatric_surg_ext18 v3.128.0 migration up
CREATE TABLE IF NOT EXISTS pcc_pediatric_surg_ext18 (
  id BIGINT IDENTITY PRIMARY KEY,
  tenant_id NVARCHAR(64) NOT NULL,
  fn NVARCHAR(128),
  payload NVARCHAR(MAX),
  ts DATETIME2 DEFAULT SYSUTCDATETIME()
);
