# Deploy run_all_tests.sh in chunks via SSH, then run it
$ErrorActionPreference = "Stop"
$Key = "C:\Users\ice\.ssh\nama_medical_key"
$RemoteHost = "root@204.168.144.74"
$Local = "C:\Users\ice\Desktop\NMEDCALVSCODE\ops_new\run_all_tests.sh"
$Remote = "/var/www/namaweb/ops/run_all_tests.sh"

function Run-Ssh {
    param([string]$Cmd, [int]$Timeout = 60)
    $output = ssh -i $Key -o BatchMode=yes -o ConnectTimeout=10 $RemoteHost $Cmd 2>&1
    return $LASTEXITCODE, ($output -join "`n")
}

# Read the local file
$content = Get-Content -Raw -Path $Local -Encoding UTF8
$lines = $content -split "`n"
Write-Host "[1/6] $($lines.Count) lines to upload" -ForegroundColor Cyan

# Truncate remote
$r, $o = Run-Ssh ": > $Remote"
Write-Host "truncate: rc=$r"

# Upload in chunks of 80 lines via base64
$chunkSize = 80
$total = $lines.Count
for ($i = 0; $i -lt $total; $i += $chunkSize) {
    $chunk = ($lines[$i..[Math]::Min($i+$chunkSize-1, $total-1)]) -join "`n"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($chunk)
    $b64 = [Convert]::ToBase64String($bytes)
    $r, $o = Run-Ssh "echo '$b64' | base64 -d >> $Remote"
    if ($r -ne 0) {
        Write-Host "chunk ${i} failed rc=${r}: ${o}" -ForegroundColor Red
        exit 1
    }
    if (($i / $chunkSize) % 3 -eq 0) {
        Write-Host "  uploaded $($([Math]::Min($i+$chunkSize, $total)))/$total"
    }
}

# chmod + wc
$r, $o = Run-Ssh "chmod +x $Remote && wc -l $Remote"
Write-Host "chmod/wc: $o"
if ($LASTEXITCODE -ne 0) { exit 1 }

# syntax check
Write-Host "[2/6] bash -n syntax check..." -ForegroundColor Cyan
$r, $o = Run-Ssh "bash -n $Remote && echo SYNTAX_OK"
Write-Host $o
if ($o -notmatch "SYNTAX_OK") { Write-Host "SYNTAX FAIL" -ForegroundColor Red; exit 1 }

# Run --quick with tail
Write-Host "[3/6] running --quick (capture tail)..." -ForegroundColor Cyan
$r, $o = Run-Ssh "bash $Remote --quick --no-color 2>&1 | tail -25"
Write-Host "=== TAIL OF --quick RUN ==="
Write-Host $o

# Run --quick for exit code
Write-Host "[4/6] running --quick (real exit code)..." -ForegroundColor Cyan
$r, $o = Run-Ssh "bash $Remote --quick --no-color > /dev/null 2>&1; echo EXITCODE=\`$?`; exit 0"
Write-Host $o

# LOC + log
Write-Host "[5/6] LOC + log..." -ForegroundColor Cyan
$today = (Get-Date -Format "yyyyMMdd")
$logf = "/tmp/orchestrator-test-$today.log"
$r, $o = Run-Ssh "wc -l $Remote && echo --- && ls -la $logf 2>&1 && echo --- && tail -15 $logf 2>&1"
Write-Host $o

Write-Host "[6/6] done" -ForegroundColor Green
