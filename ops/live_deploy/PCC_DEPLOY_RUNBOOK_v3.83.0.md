# PCC v3.83.0 Live Deploy Runbook (PREPARED, NOT EXECUTED)

> **Status:** PREPARED — awaiting explicit owner authorization before any SSH/PM2 command.
> **Target:** Hetzner `ubuntu-8gb-hel1-1` (204.168.144.74) · jumanasoft.com
> **PM2 process:** `nama-medical-erp`
> **App dir:** `/var/www/namaweb`
> **Current live branch:** `integration/all-epics` @ `5539629`
> **PCC branch to deploy:** `ops/jumanasoft-enterprise-facility-platform-staging-prep` @ `bb06478` (tag `v3.83.0`)

---

## 1. What is being deployed

PCC sandbox modules only — **not** the full `.ai-brain/` blueprints.

- P3-DO → P3-DS (15 modules, v3.79.0 → v3.83.0)
- Files: `pcc/server.js`, `pcc/gen_p3*.py`, `pcc/pcc_*_advanced/`, `pcc/migrations/p3*_*.sql`, `pcc/SHIP_*.md`
- PCC runs on **port 3101** with its own Express server, separate from the live `nama-medical-erp` on port 3000.
- PCC uses **dummy data only**; no live DB connection.

---

## 2. Pre-deploy checks (owner must verify)

| # | Check | Command / Evidence |
|---|---|---|
| 1 | Local PCC server starts | `cd pcc && PCC_PORT=3101 node server.js` |
| 2 | `/health` returns v3.83.0 | `curl http://localhost:3101/health` |
| 3 | All 15 new `/list` endpoints respond | `curl http://localhost:3101/api/v1/pcc-*-advanced/list` |
| 4 | `audit_all.py` = 330 PASS, 0 FAIL | `cd scratch && python audit_all.py` |
| 5 | `test_runner.py` = 7169 TOTAL | `cd scratch/p3_temp_scripts && python test_runner.py` |
| 6 | Git tag `v3.83.0` pushed | `git log --oneline -1 && git tag -l 'v3.83.0'` |

---

## 3. Deploy options

### Option A — Minimal: run PCC as a second PM2 process (RECOMMENDED)

This keeps the live ERP untouched and adds PCC as a separate service.

```bash
# On the server (after owner authorizes)
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74

cd /var/www
# Clone or pull the PCC-ready branch into a separate directory
git clone --branch ops/jumanasoft-enterprise-facility-platform-staging-prep \
  --single-branch --depth 1 \
  github-iceman:iceman18ice-sketch/NamaMedical.git namaweb-pcc

cd namaweb-pcc/pcc
npm install express helmet express-rate-limit pg  # if not already present

# Start PCC under PM2
pm2 start server.js --name nama-medical-pcc --env PCC_PORT=3101
pm2 save

# Verify
curl -s http://127.0.0.1:3101/health
```

**Pros:** zero risk to live ERP; can be stopped independently.  
**Cons:** PCC is not integrated into `namaweb/public/js/app.js` yet.

---

### Option B — Integrate PCC routes into live `namaweb/server.js`

This makes PCC endpoints available under the same domain/port as the live app.

**Required changes to `namaweb/server.js`:**
1. Add `require` for the 15 new PCC routers.
2. Add `app.use('/api/v1/pcc-*-advanced', ...)` for each.
3. Ensure PCC module directories are copied into `/var/www/namaweb/pcc/`.

**Risk:** touches live server.js → requires full regression test of live ERP.

---

### Option C — Full blueprint integration (NOT RECOMMENDED without Phase 1 decisions)

Convert `.ai-brain/02_MODULES_NEW/P3-B/` 22 departments into real `namaweb/` code.
This requires resolving `DECISIONS_PENDING.md` §1/§2/§3 first.

---

## 4. Rollback (Option A)

```bash
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74
pm2 stop nama-medical-pcc
pm2 delete nama-medical-pcc
rm -rf /var/www/namaweb-pcc
pm2 save
```

---

## 5. Owner authorization block

> I, the owner, authorize deployment of PCC v3.83.0 to the live server using:
> - [ ] Option A (separate PM2 process on port 3101)
> - [ ] Option B (integrate into live server.js)
> - [ ] Option C (full blueprint integration — requires decisions first)
>
> Signature / confirmation: ______________________   Date: ____________

---

## 6. Post-deploy verification (after owner authorization)

```bash
# Server-side
pm2 status
pm2 logs nama-medical-pcc --lines 20
curl -s http://127.0.0.1:3101/health

# External (if firewall allows 3101 or reverse-proxy configured)
curl -s https://jumanasoft.com:3101/health
```

---

*Prepared by GitHub Copilot · 2026-07-27 · DO NOT EXECUTE without owner approval.*
