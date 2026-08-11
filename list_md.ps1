Get-ChildItem 'C:\Users\ice\Desktop\NMEDCALVSCODE' -File -Filter *.md |
    Where-Object { $_.Name -match 'WAVE|ROADMAP|GAP|CLOSEOUT|SUMMARY|FINAL|AUDIT' } |
    Select-Object Name, Length, LastWriteTime |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 25 |
    Format-Table -AutoSize