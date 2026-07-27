-- pcc_pediatric_surg_ext3 v3.113.0 migration up
CREATE TABLE IF NOT EXISTS pcc_pediatric_surg_ext3 (
  id BIGINT IDENTITY PRIMARY KEY,
  tenant_id NVARCHAR(64),
  fn NVARCHAR(128),
  payload NVARCHAR(MAX),
  ts DATETIME2 DEFAULT SYSUTCDATETIME()
);
