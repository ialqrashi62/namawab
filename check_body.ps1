$body = '{"tenantId":"tnt-demo","patientId":"P-001","primaryDx":"Acute MI STEMI","notes":["chest pain"],"events":["ECG done"],"meds":["Aspirin 81mg"],"actorId":"dr-test","actorRoles":["doctor"]}'
Write-Host "Length: $($body.Length)"
Write-Host "Body: $body"
