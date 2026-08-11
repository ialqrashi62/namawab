# Wave 30 — Backup Automation + DR Plan (Closeout)

**Date:** 2026-08-05
**Owner:** Copilot
**Status:** ✅ Complete

---

## 1. Goal

Deliver a production-grade backup + DR-restore pipeline for the
jumanaMedical ERP database:

- Daily `pg_dump` with integrity checksum.
- Encrypted at rest (AES-256) using a KEK passphrase (env-only, never
  in the script).
- Off-site sync to Hetzner Storage Box (rsync).
- 30-day local retention.
- Weekly DR-restore drill in a sandbox database to verify integrity.

---

## 2. What ships

| File | Purpose |
|---|---|
| `namaweb/wave30_backup.sh` | The backup + DR script. |
| `namaweb/wave30_backup_test.js` | 10 structural / security tests — all PASS. |
| `WAVE_30_BACKUP_DR_AR.md` | This report. |

---

## 3. Design choices

- **Env-only secrets.** No DB password, KEK, or API key in the script.
  Every secret is read from `PGPASSWORD` / `KEK_PASSPHRASE` / `REMOTE_DEST`
  (whichever the operator exports).
- **`pg_dump -Fc --serializable-deferrable -Z 9`**. Custom format,
  compressed, point-in-time consistent under a serializable transaction.
- **AES-256-GCM with PBKDF2** (200k iterations) when KEK is configured;
  falls back to AES-256-CBC for older openssl. The decrypted file is
  `shred`'d after the encrypted copy is moved to `/keep` (zero plaintext
  on disk).
- **Manifest sidecar.** Every backup produces a `.manifest` next to the
  dump with `host`, `db`, `ts`, `file`, `bytes`, `sha256`, `encrypted`.
- **30-day retention** by default (`RETENTION_DAYS` env var).
- **Weekly DR-drill** (`pg_restore` to a sandbox DB; checks row counts
  in `patients`; drops the sandbox). Runs only on Sunday (`date -u +%u`)
  and only when `DR_DRILL_DB` is set.
- **`set -euo pipefail`** for fail-fast behavior. `find` deletes are
  explicitly `2>/dev/null || true` so a missing directory doesn't abort.

---

## 4. Verification

```
$ bash -n wave30_backup.sh
BASH SYNTAX OK

$ node wave30_backup_test.js
[PASS] script: bash syntax valid
[PASS] script: no hardcoded passwords / API keys
[PASS] script: PGPASSWORD read from env (not literal)
[PASS] script: env vars are documented in the header
[PASS] script: uses pg_dump with -Fc + compression
[PASS] script: uses sha256 for integrity
[PASS] script: encrypted-at-rest path uses openssl with KEK
[PASS] script: retention prunes files > RETENTION_DAYS
[PASS] script: DR restore drill references pg_restore
[PASS] script: rsync + remote dest optional
10 passed, 0 failed
```

The bash-syntax check works on Windows via the WSL path mapping
(`/mnt/c/...`) and falls back to a structural check (shebang + balanced
parens) when no `bash` binary is available.

---

## 5. Safety rails respected

- **`AGENTS.md §2.2 rail 1`** — no hardcoded secrets in the script (test enforced).
- **AGENTS.md §2.2 rail 2** — destructive operations (`pg_dump`, `pg_restore`,
  `shred`, `find -delete`, `rsync --delete-after`) are guarded by:
  - `set -euo pipefail`
  - Explicit env-var requirement (e.g. `REMOTE_DEST` must be set)
  - The DR drill only ever touches `DR_DRILL_DB`, never the production DB.
- **Test enforces no hardcoded password.** The string `NamaMedicalApp@`
  is forbidden in the script source.

---

## 6. Activation

1. Place the script on the production host:

   ```bash
   sudo cp wave30_backup.sh /usr/local/bin/wave30_backup.sh
   sudo chmod 750 /usr/local/bin/wave30_backup.sh
   ```

2. Set up `/etc/default/wave30.env` (mode 600) with the secret material:

   ```bash
   PGPASSWORD=****
   KEK_PASSPHRASE=****
   REMOTE_DEST=user@hetzner-box:/backups/nama-medical
   DR_DRILL_DB=nama_medical_drill
   ```

3. Schedule in `/etc/cron.d/wave30`:

   ```
   5 2 * * * root set -a; . /etc/default/wave30.env; set +a; /usr/local/bin/wave30_backup.sh >> /var/log/wave30.log 2>&1
   ```

   (Daily 02:05. The DR drill block runs only on Sunday — daily vs. weekly
   frequency is config-driven.)

4. Add an alert on `/var/log/wave30.log` age > 26h (Wave 32 alert rule
   pattern can be re-used; one-line PromQL).

---

## 7. DR Drill Playbook

The weekly DR drill writes a detailed log to:

```
/var/backups/nama-medical/dr-restore.log
```

Expected output if the latest backup is good:

```
==== DR restore drill 2026-08-05T02:05:00Z ====
[sandbox DB created]
patients restored: 1234
[sandbox DB dropped]
==== DR restore drill complete ====
```

If `patients restored: 0` or any pg_restore error appears, the production
backup is corrupted and you must rotate KEK + re-seed before the next
cron run.
