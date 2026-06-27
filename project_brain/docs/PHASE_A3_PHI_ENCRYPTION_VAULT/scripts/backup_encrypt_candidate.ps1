# backup_encrypt_candidate.ps1 — CANDIDATE, DO NOT EXECUTE as-is. Encrypted DB backup (Windows host variant).
# Key MUST come from a secret store at runtime (e.g. Windows DPAPI / Key Vault); never hardcode/commit a key.
param([string]$Db = "nama_medical_web", [string]$OutDir = "C:\nama_backups")
# Pseudocode (fill key retrieval from KMS/DPAPI; do not store key in this file or .env):
# $key = Get-NamaBackupKeyFromVault   # implement against your secret store
# $out = Join-Path $OutDir ("nama_{0}.sql.enc" -f (Get-Date -Format yyyyMMdd_HHmmss))
# pg_dump $Db | openssl enc -aes-256-cbc -pbkdf2 -pass "pass:$key" -out $out
# Then copy $out offsite and verify restore in an isolated drill.
Write-Output "CANDIDATE only — wire key retrieval from a secret store before use. No key is stored here."
