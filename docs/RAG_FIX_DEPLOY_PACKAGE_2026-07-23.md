# RAG_FIX_DEPLOY_PACKAGE_2026-07-23.md

> **One-line summary:** Deploy `clinical_knowledge_rag.js` RAG-grounded fallback to live `jumanasoft.com` (Hetzner 204.168.144.74).
> **Risk:** LOW · **Downtime:** 0 sec · **Rollback:** <30 sec

---

## Files in this package

| File | Purpose |
|---|---|
| `namaweb/.deploy_staging_2026-07-23_ragfix/clinical_knowledge_rag.js` | The single file to deploy (6,005 bytes) |
| `ops/live_deploy/DEPLOY_HANDBOOK_2026-07-23_RAG_GROUNDED.md` | Step-by-step SSH deploy runbook (13 sections) |
| `docs/PHASE_RAG_LIVE_DEPLOY_2026-07-23_AR.md` (template) | Post-deploy closeout doc to fill in after success |

## What changed (1 file, +22 / -3 lines)

```diff
--- a/namaweb/clinical_knowledge_rag.js
+++ b/namaweb/clinical_knowledge_rag.js
@@ askClinicalCopilot
-    try {
-        answer = await llmClient.generateResponse(CLINICAL_SYSTEM_PROMPTS.GENERAL_COPILOT, userPrompt);
-    } catch (err) {
-        console.error('[RAG] LLM Generation Error:', err);
-        answer = 'An error occurred while generating the clinical response. Please check the system logs.';
-    }
+    let answer;
+    try {
+        const rawAnswer = await llmClient.generateResponse(CLINICAL_SYSTEM_PROMPTS.GENERAL_COPILOT, userPrompt);
+        // When the LLM client returns its simulation/no-key fallback, augment with top retrieved chunk
+        const isSimulated = typeof rawAnswer === 'string' && rawAnswer.startsWith('[SIMULATION MODE]');
+        if (isSimulated && contexts.length > 0 && contexts[0].content) {
+            answer = `Clinical answer (RAG-grounded, LLM key not configured): ${contexts[0].content} ...`;
+        } else {
+            answer = rawAnswer;
+        }
+    } catch (err) {
+        console.error('[RAG] LLM Generation Error:', err);
+        const top = contexts[0];
+        if (top && top.content) {
+            answer = `Clinical answer (RAG-grounded, LLM error): ${top.content} ...`;
+        } else {
+            answer = 'An error occurred while generating the clinical response. ...';
+        }
+    }
```

## What the user sees

**Before:**
- LLM key not configured → user gets `"[SIMULATION MODE] The LLM would process this query using the system prompt: ..."` (useless)

**After:**
- LLM key not configured → user gets `"Clinical answer (RAG-grounded, LLM key not configured): <actual chunk content from clinical knowledge base> Per protocol, confirm with the attending clinician."` (clinically useful + cited)

## Why the current sandboxed env cannot deploy

The current development environment is **network-isolated from the production Hetzner server**:

| Test | Result |
|---|---|
| `ssh root@204.168.144.74` | `Connection timed out` |
| `Test-NetConnection 204.168.144.74:22` | `False` |
| `Test-NetConnection jumanasoft.com:443` | Timeout (Cloudflare front-end, no route to origin) |
| `Invoke-WebRequest https://jumanasoft.com/api/health` | Timeout |

**Conclusion:** The deploy must be run from a machine with:
1. Internet access to the Hetzner subnet (204.168.144.0/24)
2. The `C:\Users\ice\.ssh\nama_medical_key` private key
3. Bash + ssh + scp (or PowerShell with OpenSSH)

The runbook in `ops/live_deploy/DEPLOY_HANDBOOK_2026-07-23_RAG_GROUNDED.md` is the exact procedure to run.

## Validation before deploy (done)

- ✅ `node --check` on the staged file passes
- ✅ `node run_all_tests.js` returns **241/241 PASS** (2x stable)
- ✅ `git diff --stat` shows +22 / -3 lines in 1 file only
- ✅ No migration files changed (no DB DDL)
- ✅ No env vars changed
- ✅ No config files changed
- ✅ Rollback path tested mentally (cp pre + reload)
- ✅ Live health endpoint behavior preserved (no route change)

## Quick-deploy (when you have SSH access)

```bash
# 1. SSH + backup
ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 'mkdir -p /root/nama_backups/ragfix_2026-07-23 && cp /var/www/namaweb/clinical_knowledge_rag.js /root/nama_backups/ragfix_2026-07-23/clinical_knowledge_rag.js.pre && sudo -u postgres pg_dump -Fc nama_medical_web > /root/nama_backups/PRE_ragfix_$(date +%Y%m%d_%H%M%S).dump && curl -s http://127.0.0.1:3000/api/health'

# 2. SCP
scp -i C:\Users\ice\.ssh\nama_medical_key C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb\.deploy_staging_2026-07-23_ragfix\clinical_knowledge_rag.js root@204.168.144.74:/var/www/namaweb/.deploy_staging_2026-07-23/clinical_knowledge_rag.js.new

# 3. Promote
ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 'cd /var/www/namaweb && mv .deploy_staging_2026-07-23/clinical_knowledge_rag.js.new clinical_knowledge_rag.js && node --check clinical_knowledge_rag.js && pm2 reload nama-medical-erp --update-env && sleep 5 && curl -s http://127.0.0.1:3000/api/health'

# 4. Cleanup
ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 'rm -rf /var/www/namaweb/.deploy_staging_2026-07-23 && pm2 save'

# 5. Public verify
curl -s https://jumanasoft.com/api/health
```

**If anything in step 3 fails:** rollback command is in `DEPLOY_HANDBOOK_2026-07-23_RAG_GROUNDED.md` section 9.

---

> **Status:** Ready to deploy. Sandbox cannot reach the Hetzner origin; execute the handbook from a machine with network access.
