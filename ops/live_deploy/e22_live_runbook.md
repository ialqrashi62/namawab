# e22 money REAL→NUMERIC on the LIVE hospital DB — verification-first runbook

**Status: NOT YET RUN on live.** This is the safe procedure for a maintenance window. Do not run it
ad-hoc during clinic hours.

## Why caution (honest risk assessment)
- It is **DDL that rewrites financial tables** (`ALTER COLUMN ... TYPE NUMERIC`) → brief table locks; on a
  busy hospital that can error in-flight invoice/payment writes.
- After conversion, the `pg` driver returns these columns as **STRINGS**, not numbers. The live
  `integration/all-epics` code must handle that everywhere money is displayed/summed. It was proven on the
  LOCAL `audit/phase-1a` code (118/118), **not** on the live all-epics code → must be verified first.
- Benefit is real but not urgent: REAL floats are imprecise for money, but the system has run on them and
  `billing_integrity` already uses minor-units/parseMoney for the critical money paths.

## Step 1 — VERIFY on an isolated restore (no production impact)
On the server (or any PG16 host), restore the dump taken 2026-06-30 and apply e22 there, then boot the
LIVE code against the copy and smoke-test money displays:
```bash
sudo -u postgres createdb nama_e22_verify
sudo -u postgres pg_restore -d nama_e22_verify /root/nama_backups/20260630_072310/nama_medical_web_20260630_072310.dump
sudo -u postgres psql -d nama_e22_verify -v ON_ERROR_STOP=1 -f /var/www/namaweb/migrations/e22_01_operational_money_numeric_up.sql
sudo -u postgres psql -d nama_e22_verify -v ON_ERROR_STOP=1 -f /var/www/namaweb/migrations/e22_01_operational_money_numeric_validate.sql   # must print 0
# then boot live server.js against nama_e22_verify on an alt port (NODE_ENV=production, PORT=3099,
# DB_NAME=nama_e22_verify) and smoke-test: open an invoice, a refund, a financial report; confirm
# totals/sums render correctly (no "53" string-concat, no NaN). Tear down: dropdb nama_e22_verify.
```
NOTE: the live migrations dir may not yet contain e22 — if missing, scp the 3 files from
`namaweb/migrations/e22_01_operational_money_numeric_{up,down,validate}.sql` first.

## Step 2 — APPLY to production (only after Step 1 passes, in a maintenance window)
```bash
STAMP=$(date +%Y%m%d_%H%M%S)
sudo -u postgres pg_dump -Fc nama_medical_web > /root/nama_backups/PRE_e22_$STAMP.dump   # fresh backup
sudo -u postgres psql -d nama_medical_web -v ON_ERROR_STOP=1 -f /var/www/namaweb/migrations/e22_01_operational_money_numeric_up.sql
sudo -u postgres psql -d nama_medical_web -v ON_ERROR_STOP=1 -f /var/www/namaweb/migrations/e22_01_operational_money_numeric_validate.sql   # MUST print 0
pm2 restart nama-medical-erp --update-env
curl -s http://127.0.0.1:3000/api/health   # expect {"status":"UP","db":"up"}
# browser smoke: invoices, refund, financial reports show correct money.
```

## Rollback
```bash
sudo -u postgres psql -d nama_medical_web -f /var/www/namaweb/migrations/e22_01_operational_money_numeric_down.sql
# or full restore:
sudo -u postgres pg_restore --clean -d nama_medical_web /root/nama_backups/PRE_e22_<stamp>.dump
pm2 restart nama-medical-erp --update-env
```
