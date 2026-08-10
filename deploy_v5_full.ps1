<#
.SYNOPSIS
  NamaMedical — Deploy v5 to Hetzner (feat/waveA-subagent @ cea7daf)
  Includes 14 dept modules + 15 Stitch frontend pages + 5 migrations.
.NOTES
  Run: powershell -ExecutionPolicy Bypass -File deploy_v5_full.ps1
  Requires SSH key access (no password) to ubuntu@204.168.144.74.
  Per AGENTS.md §2.4: requires owner approval.
#>

$ErrorActionPreference = 'Stop'
$Project    = 'C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb_waveA_subagent'
$Remote     = '/var/www/namaweb'
$Server     = 'ubuntu@204.168.144.74'
$Branch     = 'feat/waveA-subagent'
$Commit     = 'cea7daf3620ef2d07399e288f5b77d1949145e97'
$Date       = '2026-08-10'

# Pick first key that works
$KeyFiles = @(
    'C:\Users\ice\.ssh\nama_medical_key',
    'C:\Users\ice\.ssh\hetzner_key',
    'C:\Users\ice\.ssh\id_ed25519_deploy',
    'C:\Users\ice\.ssh\id_ed25519'
)
$KeyFile = $null
foreach ($k in $KeyFiles) {
    if (Test-Path $k) {
        Write-Host "Trying key: $k"
        $test = ssh -i "$k" -o ConnectTimeout=5 -o BatchMode=yes $Server 'echo OK' 2>&1
        if ($LASTEXITCODE -eq 0) { $KeyFile = $k; break }
    }
}
if (-not $KeyFile) {
    Write-Error "No SSH key worked. Use deploy_web.sh or run manually."
    exit 1
}
Write-Host "Using key: $KeyFile"

# Files to deploy (relative to $Project)
$Files = @(
    # Engines + routers
    @{ src='cardiology_engine.js'; dst="$Remote/cardiology_engine.js" },
    @{ src='cardiology_router.js'; dst="$Remote/cardiology_router.js" },
    @{ src='endocrine_router.js'; dst="$Remote/endocrine_router.js" },
    @{ src='emergency_router.js'; dst="$Remote/emergency_router.js" },
    @{ src='pediatrics_engine.js'; dst="$Remote/pediatrics_engine.js" },
    @{ src='pediatrics_router.js'; dst="$Remote/pediatrics_router.js" },
    @{ src='surgery_engine.js'; dst="$Remote/surgery_engine.js" },
    @{ src='surgery_router.js'; dst="$Remote/surgery_router.js" },
    @{ src='pharmacy_engine.js'; dst="$Remote/pharmacy_engine.js" },
    @{ src='pharmacy_router.js'; dst="$Remote/pharmacy_router.js" },
    @{ src='oncology_router.js'; dst="$Remote/oncology_router.js" },
    @{ src='nephrology_router.js'; dst="$Remote/nephrology_router.js" },
    @{ src='obgyn_router.js'; dst="$Remote/obgyn_router.js" },
    @{ src='pulmonology_router.js'; dst="$Remote/pulmonology_router.js" },
    @{ src='gi_router.js'; dst="$Remote/gi_router.js" },
    @{ src='rheumatology_router.js'; dst="$Remote/rheumatology_router.js" },
    @{ src='orthopedics_router.js'; dst="$Remote/orthopedics_router.js" },
    @{ src='neurology_router.js'; dst="$Remote/neurology_router.js" },

    # Tests
    @{ src='cardiology_engine_test.js'; dst="$Remote/cardiology_engine_test.js" },
    @{ src='endocrine_emergency_engine_test.js'; dst="$Remote/endocrine_emergency_engine_test.js" },
    @{ src='ped_surg_pharm_engine_test.js'; dst="$Remote/ped_surg_pharm_engine_test.js" },
    @{ src='onc_neph_obgyn_engine_test.js'; dst="$Remote/onc_neph_obgyn_engine_test.js" },
    @{ src='multispecialty_engine_test.js'; dst="$Remote/multispecialty_engine_test.js" },

    # Migrations
    @{ src='migrations/e47_cardiology_up.sql'; dst="$Remote/migrations/e47_cardiology_up.sql" },
    @{ src='migrations/e47_cardiology_down.sql'; dst="$Remote/migrations/e47_cardiology_down.sql" },
    @{ src='migrations/e48_endocrine_emergency_up.sql'; dst="$Remote/migrations/e48_endocrine_emergency_up.sql" },
    @{ src='migrations/e48_endocrine_emergency_down.sql'; dst="$Remote/migrations/e48_endocrine_emergency_down.sql" },
    @{ src='migrations/e49_pediatrics_surgery_pharmacy_up.sql'; dst="$Remote/migrations/e49_pediatrics_surgery_pharmacy_up.sql" },
    @{ src='migrations/e49_pediatrics_surgery_pharmacy_down.sql'; dst="$Remote/migrations/e49_pediatrics_surgery_pharmacy_down.sql" },
    @{ src='migrations/e50_oncology_nephrology_obgyn_up.sql'; dst="$Remote/migrations/e50_oncology_nephrology_obgyn_up.sql" },
    @{ src='migrations/e50_oncology_nephrology_obgyn_down.sql'; dst="$Remote/migrations/e50_oncology_nephrology_obgyn_down.sql" },
    @{ src='migrations/e51_pulm_gi_rheum_ortho_neuro_up.sql'; dst="$Remote/migrations/e51_pulm_gi_rheum_ortho_neuro_up.sql" },
    @{ src='migrations/e51_pulm_gi_rheum_ortho_neuro_down.sql'; dst="$Remote/migrations/e51_pulm_gi_rheum_ortho_neuro_down.sql" },

    # Server + schemas
    @{ src='server.js'; dst="$Remote/server.js" },
    @{ src='route_schemas.js'; dst="$Remote/route_schemas.js" },

    # Frontend CSS + JS
    @{ src='public/css/nama-tokens.css'; dst="$Remote/public/css/nama-tokens.css" },
    @{ src='public/js/nama-api.js'; dst="$Remote/public/js/nama-api.js" },
    @{ src='public/js/nama-i18n.js'; dst="$Remote/public/js/nama-i18n.js" },
    @{ src='public/js/locales/ar.json'; dst="$Remote/public/js/locales/ar.json" },
    @{ src='public/js/locales/en.json'; dst="$Remote/public/js/locales/en.json" },

    # Frontend dept pages
    @{ src='public/departments/cardiology.html'; dst="$Remote/public/departments/cardiology.html" },
    @{ src='public/departments/emergency.html'; dst="$Remote/public/departments/emergency.html" },
    @{ src='public/departments/endocrinology.html'; dst="$Remote/public/departments/endocrinology.html" },
    @{ src='public/departments/pediatrics.html'; dst="$Remote/public/departments/pediatrics.html" },
    @{ src='public/departments/surgery.html'; dst="$Remote/public/departments/surgery.html" },
    @{ src='public/departments/pharmacy.html'; dst="$Remote/public/departments/pharmacy.html" },
    @{ src='public/departments/oncology.html'; dst="$Remote/public/departments/oncology.html" },
    @{ src='public/departments/nephrology.html'; dst="$Remote/public/departments/nephrology.html" },
    @{ src='public/departments/obgyn.html'; dst="$Remote/public/departments/obgyn.html" },
    @{ src='public/departments/pulmonology.html'; dst="$Remote/public/departments/pulmonology.html" },
    @{ src='public/departments/gi.html'; dst="$Remote/public/departments/gi.html" },
    @{ src='public/departments/rheumatology.html'; dst="$Remote/public/departments/rheumatology.html" },
    @{ src='public/departments/orthopedics.html'; dst="$Remote/public/departments/orthopedics.html" },
    @{ src='public/departments/neurology.html'; dst="$Remote/public/departments/neurology.html" },
    @{ src='public/departments/hub.html'; dst="$Remote/public/departments/hub.html" }
)

# Manifest
$ManifestPath = "$Project\DEPLOY_V5_MANIFEST.json"
$Manifest = @{
    version = '5.0.0'
    branch  = $Branch
    commit  = $Commit
    date    = $Date
    files   = $Files.Count
    depts   = 14
    migrations = 5
    pages   = 15
}
$Manifest | ConvertTo-Json -Depth 2 | Set-Content $ManifestPath

Write-Host ""
Write-Host "=== NamaMedical Deploy v5 Manifest ==="
Write-Host "Branch:  $Branch"
Write-Host "Commit:  $Commit"
Write-Host "Files:   $($Files.Count)"
Write-Host ""
Write-Host "Run this on the server to apply:"
Write-Host ""
Write-Host "cd /var/www/namaweb"
Write-Host "git fetch origin"
Write-Host "git checkout $Branch"
Write-Host "git pull"
Write-Host "psql -U nama nama_medical -f migrations/e47_cardiology_up.sql"
Write-Host "psql -U nama nama_medical -f migrations/e48_endocrine_emergency_up.sql"
Write-Host "psql -U nama nama_medical -f migrations/e49_pediatrics_surgery_pharmacy_up.sql"
Write-Host "psql -U nama nama_medical -f migrations/e50_oncology_nephrology_obgyn_up.sql"
Write-Host "psql -U nama nama_medical -f migrations/e51_pulm_gi_rheum_ortho_neuro_up.sql"
Write-Host "pm2 restart nama-medical-erp"
Write-Host "pm2 logs nama-medical-erp --lines 50"
