$dir = 'C:\Users\ice\Desktop\NMEDCALVSCODE\memories\repo'
$patterns = @('open','pending','todo','incomplete','next step','outstanding','blocked','not yet','wip','remaining','⏳','❌','⚠️')
$files = Get-ChildItem -Path $dir -Filter '*.md' -ErrorAction SilentlyContinue
Write-Host "Total memo files: $($files.Count)"
Write-Host ""
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw -ErrorAction SilentlyContinue
    $name = $f.Name
    $hits = @()
    foreach ($p in $patterns) {
        $matchesFound = [regex]::Matches($content, $p, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        foreach ($m in $matchesFound) {
            # Get line containing match
            $lineNum = ($content.Substring(0, $m.Index) -split "`n").Count
            $lineText = (($content -split "`n")[$lineNum - 1]).Trim()
            if ($lineText.Length -gt 160) { $lineText = $lineText.Substring(0,160) + '...' }
            $hits += "  L${lineNum}: [${p}] $lineText"
        }
    }
    if ($hits.Count -gt 0) {
        Write-Host "===== ${name} ($($hits.Count) hits) ====="
        $hits | Select-Object -First 6 | ForEach-Object { Write-Host $_ }
        Write-Host ""
    }
}
