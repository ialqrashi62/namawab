Get-ChildItem 'C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb' -File -Filter '*test*.js' |
    Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-2) } |
    Select-Object Name, Length, LastWriteTime |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 10