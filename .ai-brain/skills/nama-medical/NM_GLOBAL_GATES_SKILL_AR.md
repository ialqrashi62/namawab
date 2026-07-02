# NM_GLOBAL_GATES_SKILL — القواعد الدائمة + Baseline (تُفعَّل في كل بوابة)

> الأساس المشترك لكل بوابات NamaMedical. استشهد به بدل تكرار القواعد في كل برومنت.

## القواعد الدائمة (ثابتة لكل بوابة)
```text
STOP_ON_ANY_REAL_FAILURE: YES
CONTINUE_ON_INDEPENDENT_SAFE_ITEMS: YES
MAX_RETRY_ON_CLASSIFIER_GATE: 3
NO_FORCE_PUSH: YES
NO_SECRET_PRINTING: YES | NO_KEY_PRINTING: YES | NO_PASSWORD_PRINTING: YES
NO_SESSION_COOKIE_PRINTING: YES | NO_DPAPI_BLOB_PRINTING: YES
NO_ENV_COMMIT: YES | NO_KEYS_IN_GIT: YES | NO_CREDENTIALS_IN_GIT: YES | NO_PHI_IN_GIT: YES
NO_REAL_PHI: YES
NO_ACCOUNTING_ENABLEMENT_WITHOUT_EXPLICIT_APPROVAL: YES (must remain OFF)
NO_R17_BRANCH_MERGE: YES
ARABIC_UTF8_REPORTS_ONLY: YES
MOJIBAKE_BLOCKERS: احجب علامات UTF-8 المكسورة الشائعة (Latin-1 mis-decode بادئة O-slash / U-grave، علامة BOM، ورمز الاستبدال U+FFFD)
```

## Gate 0 — Baseline الثابت (نفّذه أول كل بوابة)
```bash
git rev-list --left-right --count origin/master...HEAD     # expect 0  0
git -C namaweb status --short                              # expect clean
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/health   # 200
curl -s -o /dev/null -w "%{http_code}" https://jumanasoft.com/api/health # 200
docker exec nama-redis redis-cli ping                      # PONG
# DB: FORCE_RLS=150 ، finance_journal_entries=0
```
المتوقع: `drift 0/0 · namaweb clean · health 200/200 · Redis PONG · FORCE_RLS 150 · accounting OFF · journal 0`. أي فشل ⟹ `FINAL_STATUS: BLOCKED_BASELINE_NOT_SAFE; STOP`.

## نمط النشر/الـGit (عند تغيير كود)
feature edit → `node --check` → static guard → restart pm2 (`nama-app`) → harness/smoke → commit namaweb → push `origin HEAD:main` FF → advance parent gitlink → commit parent → push `origin HEAD:master` FF. **namaweb canonical = origin/main؛ master = خط R17 الموازي، لا تُلمَس.**

## الثوابت الإنتاجية الحالية (تحقّق، لا تفترض)
app يعمل كـ`nama_medical_app` (super=false, bypassrls=false)؛ FORCE_RLS=150؛ secrets خارج git (`~/nama_medical_app_db_password`, `%APPDATA%/postgresql/pgpass.conf`, `~/nama_kek.dpapi`)؛ Redis في Docker (`nama-redis`)؛ pm2 launcher `C:\nvm4w\nodejs\pm2.cmd`.

## حقول الإغلاق الدنيا (كل بوابة)
`FINAL_STATUS · PRODUCTION_CHANGES · DDL_EXECUTED · DATA_CHANGED · CODE_DEPLOYED · ACCOUNTING_POSTING_ENABLED(OFF) · JOURNAL_COUNT(0) · SECRETS_PRINTED(NO) · FORCE_PUSH_USED(NO) · GIT_COMMIT · GIT_PUSH(FF) · NEXT_RECOMMENDED_ACTION`.
