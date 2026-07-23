# DEPLOY_HANDBOOK_2026-07-23_RAG_GROUNDED.md

> **Purpose:** Step-by-step live deploy of the RAG-grounded AI Copilot fix to `jumanasoft.com` (Hetzner 204.168.144.74).
> **Date prepared:** 2026-07-23
> **Change:** `namaweb/clinical_knowledge_rag.js` (+22 / -3 lines) — RAG-grounded fallback when LLM is unavailable
> **Risk:** LOW (single file, additive fallback, 241/241 tests pass, RLS untouched, money paths untouched)
> **Estimated downtime:** 0 seconds (PM2 reload, not restart)
> **Rollback time:** <30 seconds

---

## 0. Pre-flight (verify on YOUR machine BEFORE SSHing)

```powershell
# Confirm staging file is valid
cd C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb
Get-ChildItem .deploy_staging_2026-07-23_ragfix
node --check .deploy_staging_2026-07-23_ragfix/clinical_knowledge_rag.js
# Expected: "STAGED OK" and no errors
```

✅ Staging size: **6,005 bytes** (matches the +22 / -3 line diff)
✅ Syntax: `node --check` passed locally

---

## 1. SSH into the Hetzner server

```bash
ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74
```

If SSH times out:
- Check local internet (the production Hetzner may be reachable from your home/office network)
- Try `ping 204.168.144.74` first
- If behind corporate firewall, use a mobile hotspot

---

## 2. Snapshot current state (BEFORE any change)

```bash
SERVER=root@204.168.144.74
KEY=C:\Users\ice\.ssh\nama_medical_key

# 2.1 DB backup (mandatory)
ssh -i $KEY $SERVER 'sudo -u postgres pg_dump -Fc nama_medical_web > /root/nama_backups/PRE_ragfix_$(date +%Y%m%d_%H%M%S).dump && ls -la /root/nama_backups/PRE_ragfix_*.dump | tail -1'

# 2.2 Code backup (the file we're touching)
ssh -i $KEY $SERVER 'mkdir -p /root/nama_backups/ragfix_2026-07-23 && cp /var/www/namaweb/clinical_knowledge_rag.js /root/nama_backups/ragfix_2026-07-23/clinical_knowledge_rag.js.pre && ls -la /root/nama_backups/ragfix_2026-07-23/'

# 2.3 Current health
ssh -i $KEY $SERVER 'curl -s http://127.0.0.1:3000/api/health'
# Expected: {"status":"UP","db":"up"}
```

**STOP if any of these fail. Do NOT proceed.**

---

## 3. Verify the LOCAL staged file matches the LIVE one (sanity)

```bash
ssh -i $KEY $SERVER 'md5sum /var/www/namaweb/clinical_knowledge_rag.js'
# Compare with:
Get-FileHash C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb\.deploy_staging_2026-07-23_ragfix\clinical_knowledge_rag.js -Algorithm MD5
```

The local one should be **DIFFERENT** (we're about to overwrite).
The remote one should be the old version (without the grounded fallback).

---

## 4. SCP the new file to the server (staging dir first, then verify)

```bash
scp -i $KEY C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb\.deploy_staging_2026-07-23_ragfix\clinical_knowledge_rag.js $SERVER:/var/www/namaweb/.deploy_staging_2026-07-23/clinical_knowledge_rag.js.new

# Verify on server
ssh -i $KEY $SERVER 'cd /var/www/namaweb && node --check .deploy_staging_2026-07-23/clinical_knowledge_rag.js.new && wc -l .deploy_staging_2026-07-23/clinical_knowledge_rag.js.new /var/www/namaweb/clinical_knowledge_rag.js'
```

---

## 5. Promote to live (atomic move)

```bash
ssh -i $KEY $SERVER 'cd /var/www/namaweb && mv .deploy_staging_2026-07-23/clinical_knowledge_rag.js.new clinical_knowledge_rag.js && node --check clinical_knowledge_rag.js && echo PROMOTE_OK'
```

**STOP if PROMOTE_OK not printed.**

---

## 6. Reload PM2 (zero-downtime)

```bash
ssh -i $KEY $SERVER 'pm2 reload nama-medical-erp --update-env'
# Wait ~5 seconds
sleep 5
```

---

## 7. Post-deploy health verification

```bash
# 7.1 Health endpoint
ssh -i $KEY $SERVER 'curl -s http://127.0.0.1:3000/api/health'
# Expected: {"status":"UP","db":"up"}

# 7.2 PM2 status
ssh -i $KEY $SERVER 'pm2 status | grep nama-medical-erp'
# Expected: "online" status, restarts increased by 1

# 7.3 Logs (no errors expected)
ssh -i $KEY $SERVER 'pm2 logs nama-medical-erp --lines 50 --nostream --raw | grep -iE "error|fatal" | head -20'
# Expected: empty (no new errors)

# 7.4 RAG endpoint smoke (requires admin login token — use any existing valid one)
# If you have a valid session cookie, test:
# curl -X POST -H "Cookie: <session>" -H "Content-Type: application/json" \
#   -d '{"question":"test","query_embedding":[1,0,0,...]}' \
#   http://127.0.0.1:3000/api/clinical/ai/ask
# Expected: 200 with answer (either real LLM or RAG-grounded fallback)
```

---

## 8. Public-facing verification

```bash
# 8.1 Public site responds
curl -s -o /dev/null -w "HTTP: %{http_code}, Time: %{time_total}s\n" https://jumanasoft.com/

# 8.2 Health via public DNS
curl -s https://jumanasoft.com/api/health
# Expected: {"status":"UP","db":"up"}

# 8.3 Login page renders
curl -s -o /dev/null -w "HTTP: %{http_code}, Size: %{size_download}\n" https://jumanasoft.com/login.html
# Expected: 200, > 20000 bytes
```

---

## 9. Rollback (if any step 6-8 fails)

```bash
ssh -i $KEY $SERVER 'cp /root/nama_backups/ragfix_2026-07-23/clinical_knowledge_rag.js.pre /var/www/namaweb/clinical_knowledge_rag.js && node --check /var/www/namaweb/clinical_knowledge_rag.js && pm2 reload nama-medical-erp --update-env && curl -s http://127.0.0.1:3000/api/health'
# Expected: {"status":"UP","db":"up"} — system restored to pre-deploy state
```

Full DB rollback (only if DB was touched, which it should NOT have been for this change):
```bash
ssh -i $KEY $SERVER 'ls /root/nama_backups/PRE_ragfix_*.dump'
# If you need to restore, contact owner — DB was not modified by this deploy
```

---

## 10. Cleanup

```bash
# After successful deploy + 24h soak, remove staging
ssh -i $KEY $SERVER 'rm -rf /var/www/namaweb/.deploy_staging_2026-07-23 && echo CLEANED'

# Save the new PM2 state
ssh -i $KEY $SERVER 'pm2 save'
```

---

## 11. Post-deploy reporting

After all steps pass, update:
- `docs/CHANGELOG.md` — add `[2026-07-23]` deploy entry
- `docs/PHASE_RAG_LIVE_DEPLOY_2026-07-23_AR.md` — closeout (see template below)

Template for closeout:
```markdown
# PHASE_RAG_LIVE_DEPLOY_2026-07-23_AR.md

## Deployed
- File: namaweb/clinical_knowledge_rag.js
- Change: RAG-grounded fallback when LLM unavailable
- Method: PM2 reload (zero-downtime)
- Downtime: 0 seconds

## Verified
- Health: UP / DB UP
- PM2: online
- Public site: 200
- RAG endpoint: RAG-grounded fallback returns 200 with cited context
- 241/241 local tests still pass

## Rollback
- Backed up to: /root/nama_backups/ragfix_2026-07-23/clinical_knowledge_rag.js.pre
- DB backup: /root/nama_backups/PRE_ragfix_*.dump
- Rollback command: cp pre → reload (zero-downtime)

## Status: LIVE ✅
```

---

## 12. What this deploy does NOT do

To be explicit:
- ❌ Does NOT modify any database table
- ❌ Does NOT change any API contract (existing routes unchanged)
- ❌ Does NOT change any auth/RBAC/tenant logic
- ❌ Does NOT change any money/finance path
- ❌ Does NOT push to any new git branch
- ❌ Does NOT change environment variables
- ❌ Does NOT restart the database
- ❌ Does NOT reload nginx

The change is **purely additive** in the AI Copilot path: when the LLM is in simulation/no-key mode, the answer is now grounded in the top retrieved RAG chunk instead of being a generic placeholder. This is a **quality-of-life improvement** for clinical users.

---

## 13. Why this is safe to deploy

| Reason | Evidence |
|---|---|
| 241/241 tests pass locally | `node run_all_tests.js` returns 0 failures |
| No destructive changes | `git diff --stat` shows +22 / -3 lines in 1 file |
| RLS / tenant isolation unchanged | grep finds no `tenant`/`policy` lines touched |
| Money paths unchanged | grep finds no `parseMoney`/`finance_engine` lines touched |
| Easy rollback | pre-deploy backup in `/root/nama_backups/ragfix_2026-07-23/` |
| Zero-downtime reload | PM2 reload, not restart |

---

> **Decision:** Run this handbook manually from a machine with Hetzner SSH access (not the current sandboxed environment). Each step is verifiable; rollback is one command.
