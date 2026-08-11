$urls = @(
    'http://localhost:3000/openapi.json',
    'http://localhost:3000/api/docs',
    'http://localhost:3000/api/metrics',
    'http://localhost:3000/api/health/redis',
    'http://localhost:3000/api/metrics/sessions',
    'http://localhost:3000/api/security/rls-audit',
    'http://localhost:3000/api/metrics/alerts',
    'http://localhost:3000/api/health'
)
foreach ($u in $urls) {
    $code = 0
    try { $code = (Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 5 -Method GET).StatusCode }
    catch { $code = $_.Exception.Response.StatusCode.value__ }
    Write-Host ("{0,-50} -> {1}" -f $u, $code)
}
