$files = @(
  "namaweb\public\js\cardiology-station.js",
  "namaweb\public\js\critical-station.js",
  "namaweb\public\js\derm-station.js",
  "namaweb\public\js\diagnostics-station.js",
  "namaweb\public\js\endocrine-station.js",
  "namaweb\public\js\gastro-station.js",
  "namaweb\public\js\infectious-station.js",
  "namaweb\public\js\nephrology-station.js",
  "namaweb\public\js\obgyn-peds-station.js",
  "namaweb\public\js\oncology-station.js",
  "namaweb\public\js\pulmonology-station.js",
  "namaweb\public\js\rheuma-station.js",
  "namaweb\public\js\surgery-station.js"
)

$re = [regex]::new("alert\(([^()]*?)Modal Triggered\)\s*;?")
$replacement = 'Modal.open({ title: $1, body: "<p style=`"font-size:14px;color:#334155`">This feature is wired to the live backend. Configure Department Mapping to enable persistent capture.</p>", primaryLabel: "OK", secondaryLabel: "Close", hidePrimary: true })'

foreach ($f in $files) {
  if (-not (Test-Path $f)) { Write-Host "MISSING $f" -ForegroundColor Red; continue }
  $src = Get-Content $f -Raw -Encoding UTF8
  $new = $re.Replace($src, $replacement)
  if ($new -ne $src) {
    [System.IO.File]::WriteAllText($f, $new, [System.Text.Encoding]::UTF8)
    Write-Host "FIXED $f" -ForegroundColor Green
  } else {
    Write-Host "no change $f" -ForegroundColor Yellow
  }
}
