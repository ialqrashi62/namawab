# NamaMedical — scheduled local DB backup (ops; not app code). No secret embedded.
# Auth: relies on a secured pgpass file (PGPASSFILE) OR PGPASSWORD set by the operator/Scheduled Task env.
# NEVER hardcode the DB password here. Output stays outside the git repo. Logs contain no secrets.
$ErrorActionPreference = 'Stop'
$pgDump = 'C:\Program Files\PostgreSQL\16\bin\pg_dump.exe'
$db     = 'nama_medical_web'
$user   = 'postgres'
$dest   = 'C:\Users\ice\nama_deploy_backups\scheduled'
$log    = 'C:\Users\ice\nama_deploy_backups\scheduled\backup.log'
$retain = 14   # keep last 14 daily dumps
New-Item -ItemType Directory -Force -Path $dest | Out-Null
function L($m){ "$(Get-Date -Format s) $m" | Out-File -Append -FilePath $log -Encoding utf8 }
$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$out   = Join-Path $dest "nama_$stamp.dump"
try {
  & $pgDump -U $user -h localhost -Fc -f $out $db    # custom format; password from PGPASSFILE/PGPASSWORD (not stored here)
  if ($LASTEXITCODE -ne 0) { throw "pg_dump exit $LASTEXITCODE" }
  $sizeKB = [int]((Get-Item $out).Length / 1KB)
  L "OK backup $out (${sizeKB}KB)"
  # retention: delete dumps older than the newest $retain
  Get-ChildItem $dest -Filter 'nama_*.dump' | Sort-Object LastWriteTime -Descending | Select-Object -Skip $retain | Remove-Item -Force -ErrorAction SilentlyContinue
} catch {
  L "FAIL backup: $($_.Exception.Message)"
  exit 1
}
# Restore drill (manual, isolated DB only):
#   & 'C:\Program Files\PostgreSQL\16\bin\pg_restore.exe' -U postgres -h localhost -d <isolated_db> <dump>
