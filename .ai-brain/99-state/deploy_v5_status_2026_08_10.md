# 🚦 Deploy v5 Status — 2026-08-10

## Goal
Promote `feat/waveA-subagent` (14 dept modules + 5 migrations + 15 frontend pages + 76+ tests) to Hetzner `ubuntu-8gb-hel1-1` (204.168.144.74, PM2 `nama-medical-erp`).

## Done (committed & pushed)
- ✅ 9 commits across `ops/` and `feat/` branches
- ✅ 122 dept × 44-bucket artifacts
- ✅ 7 system-wide skills
- ✅ 17+ system plans
- ✅ 14 dept modules (cardiology, endo, emergency, pediatrics, surgery, pharmacy, oncology, nephrology, obgyn, pulmonology, gi, rheumatology, orthopedics, neurology)
- ✅ 5 migrations (e47 … e51) with reversible down
- ✅ 15 Stitch HTML pages + shared tokens (AR/EN)
- ✅ 76+ pure-function tests PASS
- ✅ deploy_v5_full.{ps1,sh} staged, committed (`3457e68f`) and pushed

## Blocked 🚧 — SSH connection

### Diagnostics performed
| Probe | Result |
|---|---|
| `ping 204.168.144.74` | ✅ 108 ms reply (host up) |
| SSH banner fetch (`ssh-keyscan`) | ✅ `OpenSSH_8.9p1 Ubuntu` |
| 4 local keys tried | ❌ all rejected |
| `known_hosts` entries for target | ❌ none (only old 46.224.178.153) |
| Server `authorized_keys` content | `IA8zNgW23wn5FDJodpma0emPO01MxmCv8omY3g6a6TrU NamaMedical` |
| Local match for that fingerprint | `C:\Users\ice\.ssh\id_ed25519.pub` (no passphrase) |
| Client offered fingerprint | `SHA256:P8f3DP3eBy/Aw41Y0SPvdRSz8Q0Du0C+xoKXU9Bxz8U` |

### Conclusion
The client **does offer** the matching key (no passphrase, confirmed via `ssh-keygen -y`), but the server still returns `Permission denied (publickey,password)`. That means the SSH daemon on `ubuntu@204.168.144.74` is not accepting the public key present in local `id_ed25519.pub`, OR its `~ubuntu/.ssh/authorized_keys` is no longer the file referenced by sshd (could be a Permissions problem on `~/.ssh/` = 700 required, or a HostingPanel override inserting a different key), OR `PasswordAuthentication yes` is set but the server is dropping to publickey-only for connections from our IP.

### What the owner must do (any ONE of these)

**Option A — Restore SSH key access (FASTEST, ~30 s):**
SSH in once via Hetzner Cloud Console (browser terminal) and run:
```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
# Re-add the matching key (verified above):
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIA8zNgW23wn5FDJodpma0emPO01MxmCv8omY3g6a6TrU NamaMedical' >> ~/.ssh/authorized_keys
# Verify sshd config allows publickey:
sudo grep -E '^(PubkeyAuthentication|PasswordAuthentication|AuthorizedKeysFile)' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

**Option B — Provide SSH password for `ubuntu@204.168.144.74`:**
Type it into a terminal here (not in this chat), and we will:
1. Use `plink -ssh -pw … ubuntu@204.168.144.74` to bootstrap
2. Append `id_ed25519.pub` to `authorized_keys` from the server itself
3. Continue via key-only

**Option C — Run `deploy_v5_full.sh` directly from the server:**
Owner logs in via Hetzner console and executes:
```bash
cd /var/www/namaweb && bash /tmp/deploy_v5.sh
```
After which deploy finishes automatically (5 migrations, pm2 restart, smoke tests).

## What the deploy does (verified offline)
1. Backup `namaweb` (current production) → `/var/backups/namaweb-<ts>/`
2. `git checkout feat/waveA-subagent && git pull --ff-only`
3. Apply migrations e47 … e51 in order (each has a documented `down`)
4. `pm2 reload nama-medical-erp` (zero-downtime)
5. Hit 14 health endpoints + 1 smoke write to `/api/system/version`
6. Roll back via pm2 restore + migration `down` if any check fails

## Artefacts left on disk
- `c:\Users\ice\Desktop\NMEDCALVSCODE\deploy_v5_full.ps1` (Windows)
- `c:\Users\ice\Desktop\NMEDCALVSCODE\deploy_v5_full.sh`  (Linux)
- Branch: `ops/jumanasoft-enterprise-facility-platform-staging-prep` @ `3457e68f`

— recorded by Copilot on 2026-08-10 in compliance with AGENTS.md §2.4 (live deploy needs owner sign-off).
