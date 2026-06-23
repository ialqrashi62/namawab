<#
  escrow_mac_ct_test.ps1 — DUMMY-ONLY proof for the constant-time MAC hardening in
  ops/security/nama_kek_escrow.ps1. NO real KEK, NO DPAPI, NO ProtectedData calls.

  Replicates the escrow crypto (PBKDF2 + AES-256-CBC + HMAC-SHA256, Encrypt-then-MAC)
  on a DUMMY 32-byte secret + dummy passphrase, then exercises the SAME CtEqual()
  constant-time comparator the tool now uses:
    - correct MAC  -> accepted (true)
    - tampered MAC -> rejected (false)
    - length mismatch / null -> rejected (false)
  Also confirms CtEqual agrees with a reference comparison on random vectors.
#>
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Security

# --- the comparator under test (identical to the one in nama_kek_escrow.ps1) ---
function CtEqual([byte[]]$a, [byte[]]$b) {
  if ($null -eq $a -or $null -eq $b -or $a.Length -ne $b.Length) { return $false }
  $diff = 0
  for ($i = 0; $i -lt $a.Length; $i++) { $diff = $diff -bor ($a[$i] -bxor $b[$i]) }
  return ($diff -eq 0)
}
function Derive([string]$pass, [byte[]]$salt, [int]$iter) {
  $kdf = New-Object System.Security.Cryptography.Rfc2898DeriveBytes($pass, $salt, $iter, [System.Security.Cryptography.HashAlgorithmName]::SHA256)
  try { ,$kdf.GetBytes(64) } finally { $kdf.Dispose() }
}

$pass = 0; $fail = 0
function Check($name, $cond) {
  if ($cond) { $script:pass++; Write-Output "[PASS] $name" }
  else { $script:fail++; Write-Output "[FAIL] $name" }
}

# --- build a DUMMY escrow object the same way the tool does (dummy secret only) ---
$rng = [Security.Cryptography.RNGCryptoServiceProvider]::new()
$dummyKEK = New-Object byte[] 32; $rng.GetBytes($dummyKEK)      # DUMMY, not the real KEK
$dummyPass = 'dummy-pass-1234567890'
$salt = New-Object byte[] 16; $rng.GetBytes($salt); $iter = 200000
$keys = Derive $dummyPass $salt $iter; $encKey = $keys[0..31]; $macKey = $keys[32..63]
$aes = [Security.Cryptography.Aes]::Create(); $aes.KeySize = 256; $aes.Key = $encKey; $aes.GenerateIV(); $iv = $aes.IV
$ct = $aes.CreateEncryptor().TransformFinalBlock($dummyKEK, 0, $dummyKEK.Length)
$hmac = New-Object Security.Cryptography.HMACSHA256(,$macKey)
$mac = $hmac.ComputeHash($salt + [BitConverter]::GetBytes($iter) + $iv + $ct)

# recompute the MAC like recover-mode does (correct passphrase)
$keys2 = Derive $dummyPass $salt $iter; $macKey2 = $keys2[32..63]
$hmac2 = New-Object Security.Cryptography.HMACSHA256(,$macKey2)
$calc = $hmac2.ComputeHash($salt + [BitConverter]::GetBytes($iter) + $iv + $ct)
Check 'correct MAC accepted'        (CtEqual ([byte[]]$calc) ([byte[]]$mac))

# tampered MAC (flip one byte) must be rejected
$bad = [byte[]]$mac.Clone(); $bad[0] = $bad[0] -bxor 0xFF
Check 'tampered MAC rejected'       (-not (CtEqual ([byte[]]$calc) ([byte[]]$bad)))

# wrong passphrase -> different macKey -> different MAC -> rejected
$keys3 = Derive 'wrong-pass-0987654321' $salt $iter; $macKey3 = $keys3[32..63]
$hmac3 = New-Object Security.Cryptography.HMACSHA256(,$macKey3)
$calc3 = $hmac3.ComputeHash($salt + [BitConverter]::GetBytes($iter) + $iv + $ct)
Check 'wrong passphrase rejected'   (-not (CtEqual ([byte[]]$calc3) ([byte[]]$mac)))

# length mismatch + null rejected
Check 'length mismatch rejected'    (-not (CtEqual ([byte[]](1,2,3)) ([byte[]](1,2))))
Check 'null rejected'               (-not (CtEqual $null ([byte[]]$mac)))

# agrees with reference comparator on random vectors
$agree = $true
for ($n = 0; $n -lt 200; $n++) {
  $x = New-Object byte[] 32; $rng.GetBytes($x)
  $y = New-Object byte[] 32; if ($n % 3 -eq 0) { [Array]::Copy($x,$y,32) } else { $rng.GetBytes($y) }
  $ref = [Linq.Enumerable]::SequenceEqual([byte[]]$x, [byte[]]$y)
  if ((CtEqual $x $y) -ne $ref) { $agree = $false; break }
}
Check 'matches reference on 200 random vectors' $agree

# zero dummy buffers
[Array]::Clear($dummyKEK,0,32); [Array]::Clear($encKey,0,32); [Array]::Clear($macKey,0,32)
Write-Output "=== SUMMARY: $pass passed, $fail failed ==="
if ($fail -eq 0) { Write-Output 'MAC_CT_TEST: ALL_PASS'; exit 0 } else { Write-Output 'MAC_CT_TEST: FAIL'; exit 1 }
