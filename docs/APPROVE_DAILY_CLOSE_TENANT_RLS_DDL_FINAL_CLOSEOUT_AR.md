# الإغلاق النهائي — APPROVE_DAILY_CLOSE_TENANT_RLS_DDL

> 2026-06-22 | بوابة DDL محدودة بجدول `daily_close` فقط. أُغلقت الفجوة الخاملة. لا تغيير بيانات.

## ملخّص
نُفِّذ DDL إنتاجي محصور بـ`daily_close` (إغلاق الصندوق اليومي المالي) لإضافة tenant_id + DEFAULT + FORCE RLS + سياسة عزل. الجدول كان فارغاً (0 صف) ⇒ لا backfill. **FORCE_RLS 147→148**. لا GRANT/code/accounting/data change.

## نتائج البوابات
| البوابة | النتيجة |
|---|---|
| 0 Preflight | ✅ health 5/5، PONG، drift 0/0، daily_close rows=0/no tenant_id، FORCE=147، journal absent، audit-reader غير ممنوح |
| 1 Candidate review | ✅ مطابق لنسخة rehearsal الناجحة؛ scope=daily_close فقط؛ لا GRANT/DROP TABLE/seed/backfill |
| 2 Backup/snapshot | ✅ before_snapshot.json + up/down.sql في `~/nama_deploy_backups/daily_close_20260622/` |
| 3 Execute DDL | ✅ up.sql atomic (BEGIN/COMMIT) executed OK |
| 4 Validate | ✅ tenant_id+DEFAULT حاضران، RLS+FORCE مفعّلان، policy=1، rows=0، FORCE_RLS=148 |
| 5 RLS smoke | ✅ (role=nama_medical_app super/bypass=false) patients 3/0/0؛ daily_close insert@ctx1→tid=1، ctx999=0، forge→42501، no-ctx=0، rollback→0 صف؛ health 5/5، unauth=401 |
| 6 Safety guards | ✅ (أدناه) |
| 7 Closeout | ✅ هذا المستند |

## الحقول
```text
FINAL_STATUS: DAILY_CLOSE_TENANT_RLS_DDL_DEPLOYED_PASS
DB_ROLE_CURRENT: nama_medical_app
APP_ROLE_SUPERUSER: false
APP_ROLE_BYPASSRLS: false
APP_PATH_TENANT_BINDING: PASS
DAILY_CLOSE_ROWS_BEFORE: 0
DAILY_CLOSE_ROWS_AFTER: 0
DAILY_CLOSE_TENANT_ID: present
DAILY_CLOSE_RLS: enabled
DAILY_CLOSE_FORCE_RLS: enabled
DAILY_CLOSE_POLICY: rls_daily_close_tenant_isolation
DAILY_CLOSE_DEFAULT: (NULLIF(current_setting('app.tenant_id',true),''))::integer
FORCE_RLS_BEFORE: 147
FORCE_RLS_AFTER: 148
DDL_EXECUTED: YES_LIMITED_DAILY_CLOSE_RLS
DATA_CHANGED: NO
BACKFILL_EXECUTED: NO
GRANT_EXECUTED: NO
CODE_DEPLOYED: NO
PM2_RESTARTED: NO
HEALTH_SMOKE: PASS (5/5)
RLS_SMOKE: PASS (insert@ctx1 stamp tid=1; ctx999=0; forge 42501; no-ctx 0; rollback 0)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
AUDIT_READER_GRANTED_TO_APP: NO
BACKUP_CREATED: YES (~/nama_deploy_backups/daily_close_20260622/)
ROLLBACK_READY: YES (daily_close_tenant_rls_candidate_down.sql)
ROLLBACK_USED: NO
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION:
- PROVIDE_TEST_ACCOUNT_FOR_BROWSER_E2E
- APPROVE_AUDIT_READER_GRANT_AND_DEPLOY
- APPROVE_TENANT_ID_INDEX_CANDIDATE_IF_SCALE_NEEDED
- ACCOUNTING_ENABLEMENT_REMAINS_OFF
```

## الأثر
**لا فجوة عزل خاملة متبقية**: كل الجداول الحسّاسة للمستأجر (المملوءة والفارغة معاً) الآن محميّة بـRLS. FORCE_RLS=148. الإغلاق المالي اليومي معزول قبل امتلائه. namaweb بلا تغيير (bc24a47). لم تُلمس Stitch/MEDICAL ولا migrate.ps1/protocol_x.ps1.

تم اكتمال تفعيل RLS لجدول daily_close بدون تغيير بيانات إنتاجية
