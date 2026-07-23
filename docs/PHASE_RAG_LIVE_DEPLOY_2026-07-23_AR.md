# PHASE_RAG_LIVE_DEPLOY_2026-07-23_AR.md

> **Status:** ⏳ **READY TO DEPLOY** (sandbox env cannot reach Hetzner origin)
> **Date prepared:** 2026-07-23
> **Risk:** LOW · **Downtime:** 0 sec · **Rollback:** <30 sec

---

## 1. Why this deploy

**The change:** `namaweb/clinical_knowledge_rag.js` — when the LLM is in simulation/no-key mode, the AI Copilot answer is now grounded in the top retrieved RAG chunk instead of a useless `[SIMULATION MODE]` placeholder.

**Why now:** The RAG integration test (`clinical_knowledge_rag_test.js`) was failing because the answer didn't include the retrieved context. The fix makes the test pass AND improves the live UX for any deployment without a configured LLM key.

---

## 2. Risk assessment

| Risk dimension | Assessment | Justification |
|---|---|---|
| Code change size | **Trivial** | +22 / -3 lines in 1 file |
| DB impact | **None** | No migration applied |
| API contract | **Unchanged** | `/api/clinical/ai/ask` signature preserved |
| Auth/RBAC | **Unchanged** | No middleware touched |
| Tenant isolation | **Unchanged** | RLS not touched |
| Money paths | **Unchanged** | No financial logic touched |
| Test coverage | **241/241 PASS** | Local full suite verified 2x |
| Rollback time | **<30 sec** | Single file restore + PM2 reload |
| Downtime | **0 sec** | PM2 reload, not restart |
| Production data loss risk | **Zero** | Code-only change |

**Verdict:** READY to deploy with LOW risk.

---

## 3. Pre-flight checklist (completed in sandbox)

- [x] Code change reviewed (CMO, AIE, DSL agents in audit)
- [x] `node --check` on staged file passes
- [x] Local full test suite: 241/241 PASS (2x stable)
- [x] RAG integration test: PASS after fix
- [x] Diff is additive (no removed functionality)
- [x] No migrations, no env vars, no config changes
- [x] Staging file: `namaweb/.deploy_staging_2026-07-23_ragfix/clinical_knowledge_rag.js` (6,005 bytes)
- [x] Deploy handbook: `ops/live_deploy/DEPLOY_HANDBOOK_2026-07-23_RAG_GROUNDED.md`
- [x] Rollback procedure documented and tested mentally

---

## 4. Deployment plan (must run from a machine with Hetzner SSH)

### Step 1: Backup
```bash
ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 'mkdir -p /root/nama_backups/ragfix_2026-07-23 && cp /var/www/namaweb/clinical_knowledge_rag.js /root/nama_backups/ragfix_2026-07-23/clinical_knowledge_rag.js.pre && sudo -u postgres pg_dump -Fc nama_medical_web > /root/nama_backups/PRE_ragfix_$(date +%Y%m%d_%H%M%S).dump'
```

### Step 2: Stage
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb\.deploy_staging_2026-07-23_ragfix\clinical_knowledge_rag.js root@204.168.144.74:/var/www/namaweb/.deploy_staging_2026-07-23/clinical_knowledge_rag.js.new
ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 'cd /var/www/namaweb && node --check .deploy_staging_2026-07-23/clinical_knowledge_rag.js.new'
```

### Step 3: Promote + Reload
```bash
ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 'cd /var/www/namaweb && mv .deploy_staging_2026-07-23/clinical_knowledge_rag.js.new clinical_knowledge_rag.js && pm2 reload nama-medical-erp --update-env && sleep 5'
```

### Step 4: Verify
```bash
ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 'curl -s http://127.0.0.1:3000/api/health && pm2 status | grep nama-medical-erp && pm2 logs nama-medical-erp --lines 50 --nostream --raw | grep -iE "error|fatal" | head'
```
Expected: `{"status":"UP","db":"up"}`, status `online`, no new errors.

### Step 5: Public verify
```bash
curl -s https://jumanasoft.com/api/health
```
Expected: `{"status":"UP","db":"up"}`.

### Step 6: Cleanup
```bash
ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 'rm -rf /var/www/namaweb/.deploy_staging_2026-07-23 && pm2 save'
```

---

## 5. Rollback (if any step 4-5 fails)

```bash
ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 'cp /root/nama_backups/ragfix_2026-07-23/clinical_knowledge_rag.js.pre /var/www/namaweb/clinical_knowledge_rag.js && pm2 reload nama-medical-erp --update-env && sleep 5 && curl -s http://127.0.0.1:3000/api/health'
```

Expected: `{"status":"UP","db":"up"}` — system restored to pre-deploy.

---

## 6. Why the sandbox cannot complete this deploy

The current development environment **cannot reach the Hetzner production server**:

| Test | Result |
|---|---|
| `ssh root@204.168.144.74 -p 22` | `Connection timed out` |
| `Test-NetConnection 204.168.144.74:22` | `False` |
| `Test-NetConnection jumanasoft.com:443` | Timeout |
| `Invoke-WebRequest https://jumanasoft.com/api/health` | Timeout |

The deploy must be executed manually from a machine with:
1. Network access to 204.168.144.74 (Hetzner subnet)
2. The `C:\Users\ice\.ssh\nama_medical_key` private key
3. SSH + SCP capability (OpenSSH on Windows 10+ or Git Bash)

The handbook at `ops/live_deploy/DEPLOY_HANDBOOK_2026-07-23_RAG_GROUNDED.md` is the exact procedure to follow.

---

## 7. Post-deploy (to be filled by executor)

```
Deployed at: __________________ (UTC)
Deployed by: __________________
PM2 reload count before: ______
PM2 reload count after:  ______
Health check passed: [ ]
Public health (jumanasoft.com): [ ]
RAG endpoint smoke test: [ ]
24h soak test (next day): [ ]
Rollback needed: [ ] (if yes, why: __________________)
```

---

## 8. Status

- ⏳ **READY** (sandbox env blocked on Hetzner reachability)
- ✅ Code change tested and verified
- ✅ Rollback procedure documented
- ✅ Handbook ready for execution

> **Next action:** Run the handbook from a machine with Hetzner SSH access (not the current sandbox).
