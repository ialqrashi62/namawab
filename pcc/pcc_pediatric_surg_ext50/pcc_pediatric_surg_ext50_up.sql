-- pcc_pediatric_surg_ext50 v3.160.0 migration up
CREATE TABLE IF NOT EXISTS pcc_pediatric_surg_ext50 (
  id BIGINT IDENTITY PRIMARY KEY,
  tenant_id NVARCHAR(64) NOT NULL,
  fn NVARCHAR(128),
  payload NVARCHAR(MAX),
  ts DATETIME2 DEFAULT SYSUTCDATETIME()
);
