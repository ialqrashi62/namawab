# Database Operations Runbook
v1.0 — Owner: DBA + Platform — MSSQL 2022 primary

## Daily checks
- [ ] Backup completed + verified (auto-restore-test in DR)
- [ ] Replication lag < 5 s
- [ ] CPU < 70% sustained
- [ ] No deadlocks > threshold
- [ ] No long-running transactions > 5 min
- [ ] Disk free > 20%
- [ ] TDE certificate validity > 30 d

## Common diagnostics

### Connection pressure
```sql
SELECT COUNT(*) AS connections, status
FROM sys.dm_exec_sessions
GROUP BY status;

EXEC sp_who2;

SELECT TOP 10 *
FROM sys.dm_exec_requests
ORDER BY total_elapsed_time DESC;
```

### Slow queries
```sql
SELECT TOP 20
    qs.total_elapsed_time / qs.execution_count AS avg_ms,
    qs.execution_count,
    SUBSTRING(qt.text, qs.statement_start_offset/2 + 1,
              (CASE qs.statement_end_offset WHEN -1 THEN DATALENGTH(qt.text)
               ELSE qs.statement_end_offset END - qs.statement_start_offset)/2) AS query
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
ORDER BY avg_ms DESC;
```

### Index usage
```sql
SELECT
    OBJECT_SCHEMA_NAME(s.object_id) AS schema_name,
    OBJECT_NAME(s.object_id) AS table_name,
    i.name AS index_name,
    s.user_seeks, s.user_scans, s.user_lookups, s.user_updates
FROM sys.dm_db_index_usage_stats s
JOIN sys.indexes i ON i.object_id = s.object_id AND i.index_id = s.index_id
WHERE s.database_id = DB_ID()
ORDER BY s.user_updates DESC;
```

### Missing indexes (advisory)
```sql
SELECT TOP 20
    avg_total_user_cost * avg_user_impact * (user_seeks + user_scans) AS Score,
    statement,
    equality_columns, inequality_columns, included_columns
FROM sys.dm_db_missing_index_groups g
JOIN sys.dm_db_missing_index_group_stats s ON g.index_group_handle = s.group_handle
JOIN sys.dm_db_missing_index_details d ON g.index_handle = d.index_handle
ORDER BY Score DESC;
```

### Blocking
```sql
SELECT
    blocking_session_id, session_id, wait_type, wait_time, wait_resource,
    SUBSTRING(t.text, r.statement_start_offset/2+1,
              (CASE r.statement_end_offset WHEN -1 THEN DATALENGTH(t.text)
               ELSE r.statement_end_offset END - r.statement_start_offset)/2) AS sql_text
FROM sys.dm_exec_requests r
CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t
WHERE blocking_session_id <> 0;
```

## Maintenance

### Index rebuild (off-peak)
```sql
-- via Ola Hallengren or Microsoft Maintenance plan
EXEC dbo.IndexOptimize
   @Databases = 'USER_DATABASES',
   @FragmentationLow = NULL,
   @FragmentationMedium = 'INDEX_REORGANIZE',
   @FragmentationHigh = 'INDEX_REBUILD_ONLINE,INDEX_REBUILD_OFFLINE',
   @UpdateStatistics = 'ALL';
```

### Statistics
```sql
EXEC sp_updatestats;
```

### Integrity
```sql
DBCC CHECKDB WITH NO_INFOMSGS, ALL_ERRORMSGS;
```

## Backups
- Full backup: nightly 02:00 KSA → MinIO immutable bucket.
- Differential: every 6 h.
- Log backup: every 15 min (RPO 15 min).
- Restore drill: monthly to staging.

## Failover (Always-On AG)
```sql
ALTER AVAILABILITY GROUP nama_ag FAILOVER;
```
Followed by validation: query, audit row write, app health check.

## TDE rotation
```sql
USE master;
CREATE CERTIFICATE NamaTDECertNew WITH SUBJECT = 'NamaMedical TDE';
ALTER DATABASE nama_prod SET ENCRYPTION ON;
ALTER DATABASE ENCRYPTION KEY ENCRYPTION BY SERVER CERTIFICATE NamaTDECertNew;
-- Backup new cert + key to Vault.
```

## Compliance
- All admin actions audited (XEvents) + retained 7 y.
- DBA access via PAM + session recording.
- No PHI in non-prod without IRB-approved de-identification.
