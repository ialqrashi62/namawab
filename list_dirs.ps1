Get-ChildItem 'C:\Users\ice\Desktop\NMEDCALVSCODE\docs' -Directory |
    Select-Object FullName, LastWriteTime |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 15