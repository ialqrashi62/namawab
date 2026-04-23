$labData = Invoke-Sqlcmd -Query 'SELECT test_name, test_name_ar, category, price, is_active FROM lab_test_catalog' -ServerInstance localhost -Database NAMA_MEDICAL
foreach ($row in $labData) {
    if ($row.test_name) { $n = $row.test_name.Replace("'", "''") } else { $n = "" }
    if ($row.test_name_ar) { $a = $row.test_name_ar.Replace("'", "''") } else { $a = "" }
    if ($row.category) { $c = $row.category.Replace("'", "''") } else { $c = "" }
    $p = if ($row.price) { $row.price } else { 0 }
    $act = if ($row.is_active) { 1 } else { 0 }
    
    $q = "INSERT INTO lab_test_catalog (test_name, test_name_ar, category, price, is_active) VALUES (N'$n', N'$a', N'$c', $p, $act);"
    Invoke-Sqlcmd -Query $q -ServerInstance '46.224.178.153' -Database 'NAMA_MEDICAL' -Username 'sa' -Password 'NamaMedical@2026!'
}

$radData = Invoke-Sqlcmd -Query 'SELECT exam_name, exam_name_ar, category, price, is_active FROM radiology_catalog' -ServerInstance localhost -Database NAMA_MEDICAL
foreach ($row in $radData) {
    if ($row.exam_name) { $n = $row.exam_name.Replace("'", "''") } else { $n = "" }
    if ($row.exam_name_ar) { $a = $row.exam_name_ar.Replace("'", "''") } else { $a = "" }
    if ($row.category) { $c = $row.category.Replace("'", "''") } else { $c = "" }
    $p = if ($row.price) { $row.price } else { 0 }
    $act = if ($row.is_active) { 1 } else { 0 }
    
    $q = "INSERT INTO radiology_catalog (exam_name, exam_name_ar, category, price, is_active) VALUES (N'$n', N'$a', N'$c', $p, $act);"
    Invoke-Sqlcmd -Query $q -ServerInstance '46.224.178.153' -Database 'NAMA_MEDICAL' -Username 'sa' -Password 'NamaMedical@2026!'
}

Write-Host "Migration complete!"
