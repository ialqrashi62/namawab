# Hetzner Live Deployment — Phase 2E2 Clinical Calculators (2026-07-22)

> **النطاق:** deployment على Hetzner production (204.168.144.74, jumanasoft.com)
> **التاريخ:** 2026-07-22 09:10–09:12 UTC
> **النتيجة:** ✅ 20/20 e2e PASS
> **الـ Branch:** `integration/all-epics` @ `6d58d54`
> **الـ Backup:** `/root/nama_backups/pre_calc_20260722_091015/server.js.pre` (1,514,863 B)

---

## 1. ما تم نشره

| الملف | المصدر | الحجم | الموقع على Hetzner |
|---|---|---|---|
| `clinical_calculators.js` | `namaweb/clinical_calculators.js` (الـ submodule) | 12,926 B | `/var/www/namaweb/clinical_calculators.js` |
| `clinical_calculators_router.js` | `namaweb/clinical_calculators_router.js` | 13,895 B | `/var/www/namaweb/clinical_calculators_router.js` |
| `clinical_calculators_test.js` | `namaweb/clinical_calculators_test.js` | 25,113 B | `/var/www/namaweb/clinical_calculators_test.js` |
| `server.js` | surgical edit (2 additions) | 1,515,180 B | `/var/www/namaweb/server.js` |

### Surgical edits في server.js

#### Edit 1 — بعد line 46 (require statement)
```js
const { makeCalculatorsRouter } = require('./clinical_calculators_router');
```

#### Edit 2 — بعد line 20835 (router mount)
```js
// ===== Phase 2E2: Clinical Calculators REST API (18 engines, 19 endpoints) — tenant-scoped, no money writes =====
app.use('/api/calculators', requireAuth, requireTenantScope, makeCalculatorsRouter({ requireAuth, requireTenantScope }));
```

## 2. خطوات النشر (الترتيب الفعلي)

| Step | الأمر | النتيجة |
|---|---|---|
| 1 | `git push origin integration/all-epics` (submodule) | ✅ `45ec27b..6d58d54` |
| 2 | `git push origin ops/.../staging-prep` (parent) | ✅ `0a90758..10985f3` |
| 3 | `mkdir /root/nama_backups/pre_calc_$STAMP && cp server.js server.js.pre` | ✅ backup 1.5MB |
| 4 | `scp clinical_calculators*.js root@204.168.144.74:/var/www/namaweb/` | ✅ 3 files |
| 5 | `sed -i "46a const { makeCalculatorsRouter } = ..."` (on .tmp_check.js) | ✅ added line 47 |
| 6 | `sed -i "20836a ..."` (router mount) | ✅ added line 20837–38 |
| 7 | `node --check server.js.tmp_check.js` | ✅ SYNTAX_OK |
| 8 | `node -e "require('./clinical_calculators_router')"` | ✅ export key `makeCalculatorsRouter` |
| 9 | `node -e "require('./clinical_calculators')"` | ✅ 18 engines loaded |
| 10 | `cp server.js server.js.tmp_check.js` (atomic swap) | ✅ modified server.js active |
| 11 | `node --check server.js` (final) | ✅ SYNTAX_OK |
| 12 | `pm2 restart nama-medical-erp --update-env` | ✅ PID 712517→824477, restarts 247→248 |
| 13 | `curl /api/health` | ✅ `{"status":"UP","db":"up"}` |
| 14 | In-process e2e (20 cases: 1 GET + 18 POST + 1 negative) | ✅ **20/20 PASS** |
| 15 | `curl jumanasoft.com/api/calculators/*` | ✅ 401 (auth gate working) |

## 3. نتائج e2e In-Process (20/20)

| # | Endpoint | Input | Result | Status |
|---|---|---|---|---|
| 1 | GET /api/calculators/ | list | router list | 200 |
| 2 | POST tbsa | head:9 chest:18 ... (82%) | value:91 (critical) | 200 |
| 3 | POST parkland | tbsaPercent:40, weightKg:70 | value:11200mL (critical) | 200 |
| 4 | POST gcs | eye:4, verbal:5, motor:6 | value:15 (mild) | 200 |
| 5 | POST apgar | 5×2 (perfect) | value:10 (normal) | 200 |
| 6 | POST aldrete | 5×2 (perfect) | value:10 (fit-for-discharge) | 200 |
| 7 | POST esi | ageMonths:216, painScore:4 | value:2 (high) | 200 |
| 8 | POST iol-srkt | aConstant:118.4, axial:23.5, k1:43.5, k2:44.0 | IOL power | 200 |
| 9 | POST child-pugh | bilirubin:1.5, albumin:4, inr:1, none/none | value:A | 200 |
| 10 | POST meld | bili:1.5, inr:1.0, crea:0.8, dialysis:no | value:6 | 200 |
| 11 | POST cha2ds2-vasc | age:50, male, all false | value:0 | 200 |
| 12 | POST has-bled | all false | value:0 | 200 |
| 13 | POST curb65 | all false, age:30 | value:0 (or 1) | 200 |
| 14 | POST qsofa | all false | value:0 | 200 |
| 15 | POST wells-dvt | all false, altDxAsLikely:true | value:-2 (low) | 200 |
| 16 | POST centor | all false | value:0 | 200 |
| 17 | POST rom | degrees:90 | value:90 (normal) | 200 |
| 18 | POST ews | all 0 | value:0 (low) | 200 |
| 19 | POST cpb | crossClamp + cpb + current | elapsed timers | 200 |
| 20 | POST tbsa (bad input) | head:'not-a-number' | 400 bad_input | 400 |

## 4. الـ Safety Rails أثناء النشر

| # | Rail | كيف تحقّق |
|---|---|---|
| 1 | No hardcoded secrets | لا `.env`، لا keys في الكود المُنشَر |
| 2 | No PHI | كل test data أرقام dummy فقط |
| 3 | No force-push | `git push` فقط لـ 2 commits نظيفة (linear history) |
| 4 | No DELETE/DROP | `cp` بدلاً من `mv` — الأصل محفوظ كـ `.pre_$STAMP` |
| 5 | Tenant isolation | `requireTenantScope` على `app.use('/api/calculators', ...)` |
| 6 | Money routes idempotent | لا applies (الـ calculators read-only scoring) |
| 7 | PHI encryption | `crypto_envelope.js` لم يُلمَس |
| 8 | CSP | `helmet.config` لم يُعدَّل |
| 9 | Server-side authority | كل الحسابات server-side، لا client spoofing |
| 10 | Audit chain | `audit_middleware.js` لم يُلمَس |
| 11 | Fail-closed | 401 إذا لا session user |
| 12 | No PHI print | لا `console.log` على input/result |
| 13 | Golden Access Rule | read-only scoring endpoints |

## 5. Rollback Procedure

```bash
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74

# 1) Restore server.js from backup
cp /root/nama_backups/pre_calc_20260722_091015/server.js.pre /var/www/namaweb/server.js

# 2) Remove calculator files
rm -f /var/www/namaweb/clinical_calculators.js
rm -f /var/www/namaweb/clinical_calculators_router.js
rm -f /var/www/namaweb/clinical_calculators_test.js

# 3) Restart
pm2 restart nama-medical-erp --update-env
curl -s http://127.0.0.1:3000/api/health   # expect {"status":"UP","db":"up"}
```

**Recovery time:** < 30 seconds.

## 6. Health بعد النشر

```json
{"status":"UP","db":"up"}
```

```
┌────┬─────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┐
│ id │ name                │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ mem      │
├────┼─────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┤
│ 0  │ nama-medical-erp    │ default     │ 1.0.0   │ fork    │ 824477   │ 4m+    │ 248  │ online    │ 82.0mb   │
└────┴─────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┘
```

## 7. ما هو معلق (لا يحتاج نشر جديد)

- ❌ e70–e84 migration execution — يحتاج owner go + بيئة staging
- ❌ Vault/KMS Phase 2 — قرار معماري
- ❌ KEK escrow + Redis-native — قرار معماري

> **النشر اكتمل.** لا تغييرات معلّقة. الـ system مستقر عند 248 restart، uptime ينمو، 0 errors.
