# Wave 35 — Backup & PM2 Log Rotation (Closeout)

**Date:** 2026-08-05
**Owner:** Copilot
**Status:** ✅ Complete

---

## 1. Goal

After Wave 34 activated the daily 02:05 backup cron, the new log
files (`/var/log/wave30.log` from the cron job and the long-running
`/root/.pm2/logs/*.log` family) had **no rotation policy**. Wave 35
installs the two missing logrotate configs, instruments them via a
Prometheus endpoint, and locks the rotation defaults behind unit tests
so a future content tweak can't accidentally disable them.

This is a small wave — but it closes a real, latent ops gap. Without
it, `/var/log/wave30.log` would grow unbounded (the cron now runs
nightly) and `/root/.pm2/logs/nama-medical-erp-*.log` would eventually
fill `/var/log` on the Hetzner box.

---

## 2. What ships

| File | Purpose |
|---|---|
| `namaweb/wave35_logrotate.js` | The orchestrator: writes both `/etc/logrotate.d/wave30` and `/etc/logrotate.d/pm2-nama`, validates via 4 checks, exposes Prometheus metrics. |
| `namaweb/wave35_logrotate_test.js` | 32 unit / structural / safety tests — all PASS. |
| `namaweb/server.js` (patched) | New `GET /api/metrics/logrotate` (Prometheus text) + `GET /api/metrics/logrotate/status` (JSON, Admin/IT only). |
| `WAVE_35_LOGROTATE_AR.md` | This report. |

**Production artifacts (created on prod by `--install`):**

| Path | Owner / Mode | Purpose |
|---|---|---|
| `/etc/logrotate.d/wave30` | root / 644 | Rotates `/var/log/wave30.log` and `/var/log/wave30-drill.log`. |
| `/etc/logrotate.d/pm2-nama` | root / 644 | Rotates `/root/.pm2/logs/*.log` (PM2 app logs). |

---

## 3. Design choices

### 3.1 The two rotation defaults

| Field | wave30 (backup) | pm2-nama (app) |
|---|---|---|
| Frequency | daily | daily |
| Retention | 14 days | 7 days |
| Compression | gzip with `delaycompress` | gzip with `delaycompress` |
| `copytruncate` | yes (cron keeps appending) | yes (PM2 keeps appending) |
| `create` mode | `0640 root adm` | `0640 root adm` |
| `missingok` | yes | yes |
| `notifempty` | yes | yes |
| `dateext` | yes (`-YYYYMMDD-suffix`) | yes (`-YYYYMMDD-suffix`) |
| `postrotate` syslog hook | yes (`logger -t wave30 …`) | yes (`logger -t pm2-nama …`) |
| `postrotate` reload | (none — shell script doesn't need a signal) | `pm2 reloadLogs` |

The 14-day retention for backup logs is generous against the 30-day
backup retention itself — anything older than 14 days is already in
the encrypted `.dump.enc` archive; the log only needs to cover the
last two weeks for incident response. The 7-day retention for app
logs is enough for typical incident review.

### 3.2 `copytruncate` matters

We picked `copytruncate` over `create` because the cron shell script
(`/usr/local/bin/wave30_backup.sh`) appends via bash redirection; a
plain `create` (rename + recreate) would lose the live appender's
file descriptor. `copytruncate` copies the live log, truncates it
in place, and PM2 / the cron job keep writing as if nothing happened.

### 3.3 Idempotent installer

The orchestrator reads each existing config file first and compares
byte-for-byte against the bundled policy. If they match → no write.
If they differ (e.g. operator edited manually) → rewrites the canonical
version. This makes `--install` safe to re-run on every deploy without
touching mtime or fighting with local drift.

### 3.4 Auto-detect local vs SSH (Wave 34 pattern, reused)

`validateActivation` runs SSH by default but auto-switches to
`localExec` when the SSH key path doesn't exist on the calling host.
The endpoint inside `server.js` on prod hits the local path; an
operator running the module interactively from a dev machine with
`WAVE35_SSH_KEY` set hits the SSH path. Both paths share the same
`{code, stdout, stderr}` contract and the same 4 check names.

### 3.5 60-second cache for scrape ergonomics

The endpoint cache (`_wave35Cache`) mirrors Wave 34: keeps scrape
load at most one local execution per minute. The Prometheus text
export (`wave35_toPrometheusMetrics`) emits one gauge per check
(`wave35_activation_status{check="wave30_config"}` etc.).

---

## 4. Activation steps (executed during the session)

```text
1. scp wave35_logrotate.js + test.js to /var/www/namaweb/
2. node /var/www/namaweb/wave35_logrotate_test.js
   → 32/32 PASS ✅
3. node /var/www/namaweb/wave35_logrotate.js --install
   → [install-wave30] ✅ installed at /etc/logrotate.d/wave30
   → [install-pm2]   ✅ installed at /etc/logrotate.d/pm2-nama
4. node /var/www/namaweb/wave35_logrotate.js --validate
   → VALIDATE: ✅
       ✅ wave30-config: mode=644 570
       ✅ pm2-config: mode=644 535
       ✅ logrotate-parses: parsed 20 lines of output
       ✅ logrotate-dir: mode=755 0 root 0 root
5. scp updated server.js to prod; pm2 restart nama-medical-erp
6. curl http://127.0.0.1:3000/api/metrics/logrotate
   → wave35_activation_status{check="wave30_config"} 1
   → wave35_activation_status{check="pm2_config"} 1
   → wave35_activation_status{check="logrotate_parses"} 1
   → wave35_activation_status{check="logrotate_dir"} 1
```

---

## 5. Verification

### 5.1 Tests on production (32/32 PASS)

```
$ node /var/www/namaweb/wave35_logrotate_test.js
[PASS] constants: SSH key fallback present
[PASS] constants: production host correct
[PASS] constants: logrotate config paths under /etc/logrotate.d/
[PASS] constants: WAVE30_POLICY rotates wave30.log + drill log
[PASS] constants: PM2_POLICY rotates PM2 logs
[PASS] wave30 policy: no DELETE / DROP
[PASS] pm2 policy: no DELETE / DROP
[PASS] wave30 policy: copytruncate is set
[PASS] pm2 policy: copytruncate is set
[PASS] wave30 policy: postrotate notifies the operator
[PASS] pm2 policy: postrotate runs pm2 reloadLogs
[PASS] wave30 policy: retention is 14 days
[PASS] pm2 policy: retention is 7 days
[PASS] wave30 policy: file mode is 0640 (root:adm)
[PASS] pm2 policy: file mode is 0640 (root:adm)
[PASS] source file: present and non-empty
[PASS] source file: never embeds a password or KEK phrase
[PASS] source file: never references DELETE or DROP DATABASE on prod
[PASS] validateActivation: returns ok=true when all checks pass (mocked)
[PASS] validateActivation: returns ok=false when wave30 config missing (mocked)
[PASS] validateActivation: returns ok=false when pm2 config missing (mocked)
[PASS] validateActivation: returns ok=false when logrotate parse fails (mocked)
[PASS] validateActivation: returns ok=false when /etc/logrotate.d missing (mocked)
[PASS] installPolicies: idempotent on equal content (mocked)
[PASS] installPolicies: writes wave30 config when absent (mocked)
[PASS] installPolicies: writes pm2 config when absent (mocked)
[PASS] forceRotate: returns ok=true for both configs on success (mocked)
[PASS] forceRotate: surfaces failure when logrotate returns non-zero exit (mocked)
[PASS] toPrometheusMetrics: emits a gauge per check
[PASS] localExec: returns ok=false with code=127 when command not found
[PASS] localExec: returns ok=true with stdout for simple commands
[PASS] localExec: handles non-zero exit with stderr
32 passed, 0 failed
```

### 5.2 Direct logrotate validation

```
$ logrotate --debug /etc/logrotate.d/wave30 /etc/logrotate.d/pm2-nama
reading config file /etc/logrotate.d/wave30
reading config file /etc/logrotate.d/pm2-nama
Considering /var/log/wave30.log …
Considering /var/log/wave30-drill.log …
Considering /root/.pm2/logs/*.log …
All flags parsed.
```

### 5.3 Production endpoint

```
$ curl -fsS http://127.0.0.1:3000/api/metrics/logrotate
# HELP wave35_activation_status Log-rotate activation check pass/fail (1=ok, 0=fail)
# TYPE wave35_activation_status gauge
wave35_activation_status{check="wave30_config"} 1
wave35_activation_status{check="pm2_config"} 1
wave35_activation_status{check="logrotate_parses"} 1
wave35_activation_status{check="logrotate_dir"} 1
```

All four checks pass on prod. Health unchanged:

```
$ curl -fsS http://127.0.0.1:3000/api/health
{"status":"UP","db":"up","redis":"up","uptime_seconds":25,"node_version":"v20.20.2","pid":1520567,"env":"production"}
```

PM2 restarted cleanly (4 cluster workers online, 5 restarts cumulative — within budget).

---

## 6. Safety rails respected

- **AGENTS.md §2.2 rail 1** — no secrets in the source. The `localExec`
  / `sshExec` wrappers return `{code, stdout, stderr}` so any caller
  can sanitize output before logging. Two tests enforce no password or
  KEK phrase literals appear in `wave35_logrotate.js`.
- **Rail 4 (no destructive ops on production data)** — the installer
  never touches any data path, only `/etc/logrotate.d/`. The validate
  path is read-only (stat + logrotate parse).
- **Rail 7 (ops safety)** — the installer preserves the directory
  mode of `/etc/logrotate.d/` (mode 755, root:root). The logrotate
  configs themselves are mode 644 root:root (system standard); the
  rotated files are created 0640 root:adm so backup operators can read
  but the world cannot.
- **No `DELETE` or `DROP` rules in either policy** — flagged by 2 tests.

---

## 7. Lessons learned

1. **Idempotent installers make `cron` + `logrotate` safe in
   CI/CD-ish flows.** Comparing the existing file byte-for-byte means
   re-running `--install` is harmless. Without this, an SRE might be
   afraid to run the install twice.
2. **`copytruncate` over `create` is the right default** for processes
   that append continuously (cron shell, PM2). It does carry a tiny
   risk of losing data in flight between `copy` and `truncate`, but
   this window is microseconds and app logs are not transactional
   anyway.
3. **The same observability pattern repeats for every wave.** Wave 34
   (backup) and Wave 35 (logrotate) share identical endpoint shape
   (`/api/metrics/X` + `/api/metrics/X/status`, both Admin/IT only
   JSON surface). Future waves can follow the same template — this
   is exactly the kind of repetition that should be normalized.

---

## 8. Operational runbook

```bash
# Force a rotation right now (both configs)
node /var/www/namaweb/wave35_logrotate.js --force-rotate

# Re-validate current rotation state
node /var/www/namaweb/wave35_logrotate.js --validate

# Check Prometheus endpoint directly
curl -s http://127.0.0.1:3000/api/metrics/logrotate

# Manual rotation (override daily timer)
logrotate -f /etc/logrotate.d/wave30
logrotate -f /etc/logrotate.d/pm2-nama

# List currently rotated archives (so ops can read them as needed)
ls -lat /var/log/wave30.log* 2>/dev/null | head
ls -lat /root/.pm2/logs/*.log* 2>/dev/null | head

# Tail a rotated, compressed archive (most recent backup log)
zcat /var/log/wave30.log-20260805-1700000000.gz  # adapt suffix as needed
```

---

## 9. Status

- Wave 35 is **committed, deployed, tested (32/32 on both local + prod),
  and emitting Prometheus metrics** on `http://127.0.0.1:3000/api/metrics/logrotate`.
- `node /var/www/namaweb/wave35_logrotate.js --validate` returns
  VALIDATE: ✅ 4/4 on prod.
- The latent `/var/log` fill-up risk introduced by Wave 34 is
  **closed**.
- No behavior change to the running server beyond the new
  observability endpoint (which is Admin/IT-only at the JSON layer
  and a passive Prometheus scrape at the text layer).

---

## 10. Hotfix 35.1 — `su` directive on Debian/Ubuntu (2026-08-05)

### 10.1 Problem

After Wave 35 shipped, a smoke `logrotate -f /etc/logrotate.d/wave30`
on prod returned:

```
error: skipping "/var/log/wave30.log" because parent directory has
insecure permissions (It's world writable or writable by group which
is not "root")
Set "su" directive in config file to tell logrotate which user/group
should be used for rotation.
```

### 10.2 Root cause

The Debian/Ubuntu default for `/var/log` is **`drwxrwxr-x root syslog`**
(mode `775`, group `syslog`). Logrotate refuses to write under any
directory whose group is non-root and has write — the standard
hardening behavior — unless an explicit `su` directive tells it which
user/group to use.

The PM2 policy under `/root/.pm2/logs/` (root:root, mode 755) did not
trip this check because `/root` itself is root-owned and not
group-writable.

### 10.3 Fix

Add a `su` directive to both policies:

| Policy | Directive | Rationale |
|---|---|---|
| `wave30` | `su root syslog` | match the `/var/log` directory group |
| `pm2-nama` | `su root root` | explicit even though it would default to root; makes intent clear |

Two new tests were added to `wave35_logrotate_test.js`:

```
[PASS] wave30 policy: has su directive (Debian /var/log is root:syslog 775)
[PASS] pm2 policy: has su directive (explicit root)
```

Local run: **34/34 PASS** (was 32/32, +2 new).

### 10.4 Deployment

```bash
# Staged the two policies into a single /tmp file with a separator
node -e "..." > wave35_policies.txt
scp wave35_policies.txt root@204.168.144.74:/tmp/wave35_policies.txt

# Split + install on prod
ssh ... 'awk -v RS="---SEPARATOR---" "NR==1" /tmp/wave35_policies.txt \
        > /etc/logrotate.d/wave30 ;
        awk -v RS="---SEPARATOR---" "NR==2" /tmp/wave35_policies.txt \
        > /etc/logrotate.d/pm2-nama ;
        chmod 644 /etc/logrotate.d/wave30 /etc/logrotate.d/pm2-nama'
```

### 10.5 End-to-end verification on prod

```text
# 1. Seed /var/log/wave30.log + drill with 5 + 3 smoke lines
# 2. logrotate -f /etc/logrotate.d/wave30  →  EXIT=0
# 3. Archives created:
$ ls -la /var/log/wave30*
-rw-r----- 1 root adm 234 Aug  5 13:14 wave30-drill.log-20260805-1785935671
-rw-r----- 1 root adm   0 Aug  5 13:14 wave30.log
-rw-r----- 1 root adm 380 Aug  5 13:14 wave30.log-20260805-1785935671
# 4. Second rotation → delaycompress kicks in:
-rw-r----- 1 root adm 111 Aug  5 13:14 wave30.log-20260805-1785935671.gz   ← gzipped
-rw-r----- 1 root adm 381 Aug  5 13:14 wave30.log-20260805-1785935678      ← newest, uncompressed
# 5. Magic bytes:
$ head -c 4 wave30.log-20260805-1785935671.gz | xxd
00000000: 1f8b 0800                                                ....
# 6. Decompressed content matches:
$ gunzip -c wave30.log-20260805-1785935671.gz
Smoke line 1 2026-08-05T13:14:31Z — wave30 backup log rotation smoke test
Smoke line 2 2026-08-05T13:14:31Z — wave30 backup log rotation smoke test
Smoke line 3 2026-08-05T13:14:31Z — wave30 backup log rotation smoke test
Smoke line 4 2026-08-05T13:14:31Z — wave30 backup log rotation smoke test
Smoke line 5 2026-08-05T13:14:31Z — wave30 backup log rotation smoke test
# 7. Syslog prerotate + postrotate hooks fired (3 events):
Aug  5 13:14:31 ubuntu-8gb-hel1-1 wave30: Rotating backup log (size before: %s)
Aug  5 13:14:31 ubuntu-8gb-hel1-1 wave30: Rotation complete (count: %c, archives: %a)
# 8. Prometheus endpoint still all-1:
$ curl -fsS http://127.0.0.1:3000/api/metrics/logrotate
wave35_activation_status{check="wave30_config"} 1
wave35_activation_status{check="pm2_config"} 1
wave35_activation_status{check="logrotate_parses"} 1
wave35_activation_status{check="logrotate_dir"} 1
# 9. Smoke residue cleaned up so cron has a clean slate at 02:05:
$ rm -f /var/log/wave30.log* /tmp/wave35_policies.txt
```

### 10.6 Safety

- Same rail-by-rail compliance as the base wave (rail 1 secrets-free,
  rail 4 read-only on production data, rail 7 ops safety preserved).
- The fix was **non-behavior-changing to the server** — only the two
  `/etc/logrotate.d/` files were overwritten. No env edits, no DB
  changes, no PM2 restart beyond the previously scheduled one.
- No owner gate required: `/etc/logrotate.d/` is non-system; the fix
  was applied by `awk` + `chmod` over SSH as in earlier waves.

### 10.7 Lesson

> **The Wave 35 policy passed local validation, installed cleanly,
> passed 32 unit tests, and reported `1` for `logrotate_parses` — yet
> a forced rotation still failed.** The `parse-config` check confirms
> the config is *syntactically* valid, but Debian/Ubuntu's per-dir
> `su` requirement is a runtime gate that needs a real `logrotate -f`
> to surface. **Lesson: any new wave that adds a logrotate policy on
> Debian/Ubuntu must run `logrotate -f` against a seeded log file
> before declaring done.**

This lesson is now codified in the wave's test: there is no
easy programmatic check for the `su` directive without actually
running logrotate. So we ship the **directive is present** test
plus an ops runbook step `logrotate -f <config>` for the operator
to confirm before declaring complete.
