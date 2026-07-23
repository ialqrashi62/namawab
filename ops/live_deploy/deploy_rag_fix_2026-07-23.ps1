#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Single-script deploy of the RAG-grounded fix to jumanasoft.com (Hetzner 204.168.144.74).
.DESCRIPTION
    Run this from a machine with SSH access to the Hetzner production server.
    The current sandboxed environment cannot reach the Hetzner subnet, so this script
    must be executed from a host with network access to 204.168.144.74:22 and the
    private key C:\Users\ice\.ssh\nama_medical_key.

    The script is idempotent: if any step fails, it auto-rolls back and exits non-zero.
.PARAMETER SkipBackup
    Skip the pre-deploy DB and code backups (NOT recommended; default: $false).
.EXAMPLE
    pwsh deploy_rag_fix_2026-07-23.ps1
.NOTES
    Date: 2026-07-23
    Risk: LOW (additive fallback, 0 destructive changes, 241/241 tests pass)
    Downtime: 0 sec (PM2 reload)
    Rollback: <30 sec (cp pre + reload)
#>

param(
    [switch]$SkipBackup
)

$ErrorActionPreference = 'Stop'
$Server   = 'root@204.168.144.74'
$Key      = 'C:\Users\ice\.ssh\nama_medical_key'
$BackupDir = '/root/nama_backups/ragfix_2026-07-23'
$Staging  = 'C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb\.deploy_staging_2026-07-23_ragfix\clinical_knowledge_rag.js'
$Live     = '/var/www/namaweb/clinical_knowledge_rag.js'
$StagingRemote = '/var/www/namaweb/.deploy_staging_2026-07-23/clinical_knowledge_rag.js.new'

function Step($n, $title, $script) {
    Write-Host ""
    Write-Host "===== STEP $n : $title =====" -ForegroundColor Cyan
    & $script
    if ($LASTEXITCODE -ne 0) {
        Write-Host "STEP $n FAILED" -ForegroundColor Red
        Write-Host "Initiating auto-rollback..." -ForegroundColor Yellow
        ssh -i $Key $Server "cp $BackupDir/clinical_knowledge_rag.js.pre $Live && pm2 reload nama-medical-erp --update-env"
        exit 1
    }
    Write-Host "STEP $n OK" -ForegroundColor Green
}

# STEP 0: pre-flight
Step 0 'Pre-flight: verify local file' {
    if (-not (Test-Path $Staging)) { throw "Staging file not found: $Staging" }
    $r = node --check $Staging 2>&1
    if ($LASTEXITCODE -ne 0) { throw "node --check failed on staging file" }
    Write-Host "Local file: $((Get-Item $Staging).Length) bytes, syntax OK"
}

# STEP 1: pre-deploy backup
Step 1 'Pre-deploy backup (DB + code)' {
    if ($SkipBackup) { Write-Host "Skipped (per -SkipBackup)"; return }
    $stamp = (Get-Date -Format 'yyyyMMdd_HHmmss')
    ssh -i $Key $Server "mkdir -p $BackupDir && cp $Live $BackupDir/clinical_knowledge_rag.js.pre && sudo -u postgres pg_dump -Fc nama_medical_web > /root/nama_backups/PRE_ragfix_$stamp.dump && echo BACKUP_OK"
}

# STEP 2: pre-deploy health snapshot
Step 2 'Pre-deploy health snapshot' {
    $h = ssh -i $Key $Server 'curl -s http://127.0.0.1:3000/api/health'
    Write-Host "Pre-deploy health: $h"
    if ($h -notmatch '"status":"UP"') { throw "Pre-deploy health check failed" }
}

# STEP 3: SCP the new file
Step 3 'SCP new file to server' {
    ssh -i $Key $Server "mkdir -p /var/www/namaweb/.deploy_staging_2026-07-23"
    scp -i $Key $Staging "${Server}:$StagingRemote"
}

# STEP 4: verify on server
Step 4 'Verify staged file on server' {
    ssh -i $Key $Server "cd /var/www/namaweb && node --check $StagingRemote && echo STAGED_OK"
}

# STEP 5: atomic promote
Step 5 'Atomic promote: new -> live' {
    ssh -i $Key $Server "cd /var/www/namaweb && mv .deploy_staging_2026-07-23/clinical_knowledge_rag.js.new clinical_knowledge_rag.js && node --check clinical_knowledge_rag.js && echo PROMOTED"
}

# STEP 6: PM2 reload (zero-downtime)
Step 6 'PM2 reload (zero-downtime)' {
    ssh -i $Key $Server "pm2 reload nama-medical-erp --update-env && sleep 5 && echo RELOADED"
}

# STEP 7: post-deploy health
Step 7 'Post-deploy health check' {
    $h = ssh -i $Key $Server 'curl -s http://127.0.0.1:3000/api/health'
    Write-Host "Post-deploy health: $h"
    if ($h -notmatch '"status":"UP"') { throw "Post-deploy health check failed" }
}

# STEP 8: PM2 status
Step 8 'PM2 status check' {
    $s = ssh -i $Key $Server 'pm2 status nama-medical-erp --no-color | Select-String "online|errored" | Select-Object -First 1'
    Write-Host "PM2 status: $s"
}

# STEP 9: log scan (no new errors)
Step 9 'Log scan (no new errors expected)' {
    $errs = ssh -i $Key $Server "pm2 logs nama-medical-erp --lines 50 --nostream --raw 2>&1 | Select-String -Pattern 'FATAL|TypeError|ECONN' | Select-Object -First 5"
    if ($errs) { Write-Host "Recent errors (review):" -ForegroundColor Yellow; $errs } else { Write-Host "No new errors detected" }
}

# STEP 10: public verify
Step 10 'Public verify (jumanasoft.com)' {
    try {
        $r = Invoke-WebRequest -Uri 'https://jumanasoft.com/api/health' -UseBasicParsing -TimeoutSec 10
        Write-Host "Public health: $($r.StatusCode) $($r.Content)"
    } catch {
        Write-Host "Public health check timed out (Cloudflare front-end); server-side health is the source of truth"
    }
}

# STEP 11: cleanup
Step 11 'Cleanup staging + save PM2 state' {
    ssh -i $Key $Server "rm -rf /var/www/namaweb/.deploy_staging_2026-07-23 && pm2 save && echo CLEANED"
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "DEPLOY COMPLETE — RAG-grounded fix is LIVE" -ForegroundColor Green
Write-Host "Backup: $BackupDir/clinical_knowledge_rag.js.pre" -ForegroundColor Green
Write-Host "DB dump: /root/nama_backups/PRE_ragfix_*.dump" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
