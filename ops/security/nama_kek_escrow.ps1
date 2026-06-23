<#
  nama_kek_escrow.ps1 — owner-run DR escrow for the A3 DPAPI-protected KEK.

  PURPOSE: re-wrap the machine/user-bound DPAPI KEK under an OWNER passphrase so it can be
  stored OFFLINE and recovered on another machine/user (removes the DPAPI machine-binding for DR).

  SAFETY (by design):
    - The raw KEK exists only in process memory during run; it is NEVER printed or written in plaintext.
    - The passphrase is read with Read-Host -AsSecureString; it is NEVER echoed, logged, or stored.
    - This script contains NO key material and is safe to commit. The ESCROW OUTPUT file is encrypted
      under the passphrase and MUST be moved offline; do NOT commit it (gitignored by pattern).
    - Uses AES-256-CBC + HMAC-SHA256 (Encrypt-then-MAC), PBKDF2-SHA256 (200k). All available in Win PowerShell 5.1.

  USAGE (owner runs in an interactive elevated-enough shell as the SAME user the app runs as):
    Escrow : powershell -NoProfile -File ops\security\nama_kek_escrow.ps1 -Mode escrow  -BlobPath C:\Users\ice\nama_kek.dpapi -OutFile  C:\Users\ice\nama_kek_escrow.enc
    Recover: powershell -NoProfile -File ops\security\nama_kek_escrow.ps1 -Mode recover -EscrowFile C:\path\nama_kek_escrow.enc -BlobPath C:\Users\ice\nama_kek.dpapi
  After escrow: move the .enc file to secure OFFLINE storage and memorize/secure the passphrase separately.
#>
param(
  [ValidateSet('escrow','recover')] [string]$Mode = 'escrow',
  [string]$BlobPath = $env:NAMA_KEK_PATH,
  [string]$OutFile = "$env:USERPROFILE\nama_kek_escrow.enc",
  [string]$EscrowFile = "$env:USERPROFILE\nama_kek_escrow.enc"
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Security

function Read-Pass([string]$prompt) {
  $s = Read-Host -AsSecureString $prompt
  $b = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
  try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($b) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($b) }
}
function Derive([string]$pass, [byte[]]$salt, [int]$iter) {
  $kdf = New-Object System.Security.Cryptography.Rfc2898DeriveBytes($pass, $salt, $iter, [System.Security.Cryptography.HashAlgorithmName]::SHA256)
  try { ,$kdf.GetBytes(64) } finally { $kdf.Dispose() }   # 32 enc + 32 mac
}
function CtEqual([byte[]]$a, [byte[]]$b) {
  # constant-time compare: no early-exit on first mismatch (avoids MAC timing oracle)
  if ($null -eq $a -or $null -eq $b -or $a.Length -ne $b.Length) { return $false }
  $diff = 0
  for ($i = 0; $i -lt $a.Length; $i++) { $diff = $diff -bor ($a[$i] -bxor $b[$i]) }
  return ($diff -eq 0)
}

if ($Mode -eq 'escrow') {
  if (-not $BlobPath -or -not (Test-Path $BlobPath)) { throw "KEK blob not found at '$BlobPath' (set -BlobPath or NAMA_KEK_PATH)" }
  $blob = [IO.File]::ReadAllBytes($BlobPath)
  $kek  = [Security.Cryptography.ProtectedData]::Unprotect($blob, $null, 'CurrentUser')   # raw KEK in memory only
  if ($kek.Length -ne 32) { throw "Unexpected KEK length" }
  $p1 = Read-Pass 'Enter escrow passphrase'; $p2 = Read-Pass 'Confirm escrow passphrase'
  if ($p1 -ne $p2) { throw "Passphrases do not match" }
  if ($p1.Length -lt 12) { throw "Passphrase too short (min 12 chars)" }
  $salt = New-Object byte[] 16; [Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes($salt)
  $iter = 200000; $keys = Derive $p1 $salt $iter; $encKey = $keys[0..31]; $macKey = $keys[32..63]
  $aes = [Security.Cryptography.Aes]::Create(); $aes.KeySize = 256; $aes.Key = $encKey; $aes.GenerateIV(); $iv = $aes.IV
  $enc = $aes.CreateEncryptor(); $ct = $enc.TransformFinalBlock($kek, 0, $kek.Length)
  $hmac = New-Object Security.Cryptography.HMACSHA256(,$macKey)
  $mac = $hmac.ComputeHash($salt + [BitConverter]::GetBytes($iter) + $iv + $ct)
  $obj = [ordered]@{ v=1; alg='AES-256-CBC+HMAC-SHA256'; kdf='PBKDF2-SHA256'; iter=$iter;
    salt=[Convert]::ToBase64String($salt); iv=[Convert]::ToBase64String($iv);
    ct=[Convert]::ToBase64String($ct); mac=[Convert]::ToBase64String($mac) }
  $obj | ConvertTo-Json | Set-Content -Path $OutFile -Encoding ASCII
  # zero sensitive buffers
  [Array]::Clear($kek,0,$kek.Length); [Array]::Clear($encKey,0,32); [Array]::Clear($macKey,0,32)
  Write-Output "Escrow written: $OutFile"
  Write-Output "ACTION: move this file to secure OFFLINE storage; store the passphrase separately. Do NOT commit it."
}
elseif ($Mode -eq 'recover') {
  if (-not (Test-Path $EscrowFile)) { throw "Escrow file not found: $EscrowFile" }
  if (-not $BlobPath) { throw "Set -BlobPath (target NAMA_KEK_PATH) for the recovered DPAPI blob" }
  $o = Get-Content $EscrowFile -Raw | ConvertFrom-Json
  $salt=[Convert]::FromBase64String($o.salt); $iv=[Convert]::FromBase64String($o.iv)
  $ct=[Convert]::FromBase64String($o.ct); $mac=[Convert]::FromBase64String($o.mac); $iter=[int]$o.iter
  $pass = Read-Pass 'Enter escrow passphrase'
  $keys = Derive $pass $salt $iter; $encKey=$keys[0..31]; $macKey=$keys[32..63]
  $hmac = New-Object Security.Cryptography.HMACSHA256(,$macKey)
  $calc = $hmac.ComputeHash($salt + [BitConverter]::GetBytes($iter) + $iv + $ct)
  if (-not (CtEqual ([byte[]]$calc) ([byte[]]$mac))) { throw "MAC mismatch (wrong passphrase or tampered escrow)" }
  $aes=[Security.Cryptography.Aes]::Create(); $aes.KeySize=256; $aes.Key=$encKey; $aes.IV=$iv
  $dec=$aes.CreateDecryptor(); $kek=$dec.TransformFinalBlock($ct,0,$ct.Length)
  if ($kek.Length -ne 32) { throw "Recovered KEK length invalid" }
  $prot=[Security.Cryptography.ProtectedData]::Protect($kek,$null,'CurrentUser')
  [IO.File]::WriteAllBytes($BlobPath,$prot)
  [Array]::Clear($kek,0,$kek.Length); [Array]::Clear($encKey,0,32); [Array]::Clear($macKey,0,32)
  Write-Output "Recovered KEK re-protected (DPAPI CurrentUser) to: $BlobPath"
  Write-Output "ACTION: ensure NAMA_KEK_PATH points here, then restart the app."
}
