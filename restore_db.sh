#!/bin/bash
chmod 666 /var/opt/mssql/data/backup_nama_medical.bak
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'NamaMedical@2026!' -Q "RESTORE DATABASE NAMA_MEDICAL FROM DISK='/var/opt/mssql/data/backup_nama_medical.bak' WITH REPLACE, RECOVERY, MOVE 'NAMA_MEDICAL' TO '/var/opt/mssql/data/NAMA_MEDICAL.mdf', MOVE 'NAMA_MEDICAL_log' TO '/var/opt/mssql/data/NAMA_MEDICAL_log.ldf';"
