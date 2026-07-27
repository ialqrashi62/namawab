-- pcc_pediatric_surg_ext22 v3.132.0 migration up
CREATE TABLE IF NOT EXISTS pcc_pediatric_surg_ext22 (
  id BIGINT IDENTITY PRIMARY KEY,
  tenant_id NVARCHAR(64) NOT NULL,
  fn NVARCHAR(128),
  payload NVARCHAR(MAX),
  ts DATETIME2 DEFAULT SYSUTCDATETIME()
);
