# تقرير حلّ عوائق نشر all-epics وتفعيل SaaS — NamaMedical / الطبيب

**التاريخ:** 2026-06-27
**الحالة النهائية:** `GUARD_IMPROVEMENT_READY_PENDING_OWNER_DDL`
**نوع التغييرات حتى الآن:** كود نشر (DEPLOY_RUN.sh على فرع النشر) + قراءة قاعدة بيانات فقط — **لا DDL، لا كتابة بيانات، لا نشر للإنتاج، لا تفعيل SaaS بعد.**

---

## 1) ملخص تنفيذي

تم حسم العائق الجوهري الذي كان يوقف نشر `integration/all-epics`: التحقّق الحقيقي من وجود صفوف `tenant_id IS NULL` في جداول الـbackfill على قاعدة بيانات الإنتاج متعدّدة المستأجرين.

- العدّ نُفِّذ **قراءةً فقط** بدور `postgres` (الذي يتجاوز FORCE RLS فيُعطي الأعداد الحقيقية) عبر مصادقة `pgpass` الموجودة مسبقاً — **بلا طباعة كلمة مرور، بلا PGPASSWORD، بلا PHI**.
- **النتيجة: جميع الجداول الـ30 لديها `null_tenant_rows = 0` (المجموع = 0).** أي أن الـbackfill (`SET tenant_id=1 WHERE tenant_id IS NULL`) هو **no-op مُثبَت**.
- بناءً عليه حُسِّن حارس `DEPLOY_RUN.sh`: بدل المنع الأعمى (tenants>1 ⇐ يتطلب `CONFIRM_MULTITENANT=1`)، صار الحارس **يُثبت أن الـbackfill no-op** ويسمح بالمتابعة بلا أي bypass، ويُوقف فوراً إذا ظهر أي صف غير آمن.
- لم يُستخدم `CONFIRM_MULTITENANT=1`. التحسين هو البديل الآمن للـbypass.

**الخطوة التالية الوحيدة قبل النشر:** تنفيذ DDL **بيد المالك** (owner-run) بعد أخذ نسخة احتياطية، ثم يُرسل المالك ملخصاً معقّماً ليُكمَل النشر + smoke + تفعيل SaaS.

---

## 2) المهارات المُفعَّلة (من الفهرس الفعلي)

`NM_SKILLS_INDEX_AR.md` مقروء. المهارات المُفعَّلة:
`NM_GLOBAL_GATES` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT` · `NM_OBSERVABILITY_OPS` · `NM_INTEGRATION_SANDBOX`. (لم يُجرَ أي اتصال تكامل خارجي؛ مهارات FHIR/ZATCA/NPHIES لم تُستدعَ لأي اتصال.)

---

## 3) Baseline (Gate A0)

| العنصر | القيمة |
|---|---|
| الدليل الجذري | `C:/Users/ice/Desktop/NamaMedical` |
| انحراف الأب (origin/master…HEAD) | `0  11` (11 commit توثيق محلّي، push مُعلّق) |
| live webroot (namaweb) | فرع `main` @ `171b7c2` — **لم يُبدَّل إلى all-epics** ✅ |
| origin/integration/all-epics قبل | `64ac581` |
| origin/integration/all-epics بعد | `03f2be1` (تحسين الحارس) |
| الصحّة المحلية / الإنتاج | `200 / 200` |
| tenants | `2` (multi-tenant) |
| FORCE_RLS | `150` |
| accounting posting | `OFF` |
| finance_journal_entries | `0` |
| بنود dirty خارج النطاق (لم تُلمَس) | `namaweb/.claude/`, `namaweb/migrations/` (untracked) |

---

## 4) النطاق الثابت (Gate A1)

`DEPLOY_RUN.sh` على فرع النشر يستدعي ترحيلات E-X + E0..E18. أُحصيت جداول الـbackfill (`tenant_id=1 WHERE tenant_id IS NULL`) فكانت **30 جدولاً بالضبط** مطابقة للقائمة المعتمدة، وكلّها لديها عمود `tenant_id` أصلاً، ولم يظهر أي جدول جديد غير مدقَّق.

---

## 5) أعداد null-tenant (Gate B0/B1) — قراءة فقط، ضمن `BEGIN READ ONLY … ROLLBACK`

`COUNTS_PROVIDED: YES` · `TABLES_COUNTED: 30` · `ALL_NULL_TENANT_COUNTS_ZERO: YES` · `TOTAL_NULL_TENANT_ROWS: 0`

الجداول التي تحوي صفوفاً (للسياق؛ جميعها `null_tenant_rows=0`):

| الجدول | total_rows | null_tenant_rows |
|---|---|---|
| beds | 95 | 0 |
| finance_chart_of_accounts | 30 | 0 |
| emergency_beds | 8 | 0 |
| wards | 8 | 0 |
| insurance_claims | 3 | 0 |
| (الـ25 جدولاً الأخرى) | 0 | 0 |

**القرار:** `MULTI_TENANT_DECISION: BACKFILL_NOOP_CONFIRMED_COUNTS_ONLY` — الـbackfill no-op مُثبَت.

---

## 6) تحسين الحارس (Phase C)

**الملف:** `DEPLOY_RUN.sh` (preflight فقط؛ لم يتغيّر أي سلوك ترحيل).

المنطق الجديد على قاعدة متعدّدة المستأجرين:
1. يدقّق الجداول الـ30 (بالدور المخوّل الذي يتجاوز RLS) لحساب `null_tenant_rows` وحالة "عمود tenant_id مفقود مع وجود صفوف".
2. إذا مجموع الصفوف غير الآمنة = 0 ⇐ يتابع (no-op مُثبَت، **بلا أي bypass**).
3. إذا > 0 ⇐ **يتوقف** ويطلب mapping يدوي (لا bypass افتراضي).
4. فشل التدقيق ⇐ **يتوقف بأمان**.
5. `CONFIRM_MULTITENANT=1` يبقى تجاوزاً صريحاً للمالك فقط لحالة ما بعد الـmapping اليدوي — وليس المسار الافتراضي ولا لازماً في حالة الـno-op.
6. يطبع سجلّاً آمناً: `table | total_rows | null_tenant_rows | reason` (بلا PHI/أسرار).

**الاختبارات (Gate C1):**
- `bash -n`: سليم.
- تشغيل preflight قراءةً فقط على الإنتاج (دون أي ترحيل): tenants=2 → unsafe=0 → "proven NO-OP => SAFE to proceed" → exit 0 ✅
- مسارات القرار: nulls>0 بلا تأكيد ⇐ abort ✅ · nulls>0 مع override ⇐ proceed ✅ · فشل التدقيق ⇐ abort ✅

**الالتزام والدفع (Gate C2):**
- commit: `03f2be1` على فرع مؤقّت ثم دفع **FF فقط** إلى `integration/all-epics` (`64ac581..03f2be1`)، بلا force.
- diff --check نظيف · لا أسرار في الـdiff · لا mojibake (تعليقات إنجليزية فقط في السكربت).
- نُظِّف worktree والفرع المؤقّت؛ live webroot بقي `main@171b7c2`.

---

## 7) أوامر المالك (Phase D) — للتنفيذ بيد المالك فقط

> الدور المخوّل `postgres` متوفّر عبر `pgpass` الموجود — **لا حاجة لـ`PGPASSWORD` ولا لطباعة كلمة مرور.**

### (D1) نسخة احتياطية خارج git ثم فحص السلامة:
```bash
export PATH="/c/Program Files/PostgreSQL/16/bin:$PATH"
set -e
mkdir -p /c/nama_backups
pg_dump -Fc -d nama_medical_web -U postgres -h localhost \
  -f "/c/nama_backups/pre_all_epics_saas_$(date +%F_%H%M%S).dump"
DUMP=$(ls -t /c/nama_backups/pre_all_epics_saas_*.dump | head -1)
pg_restore -l "$DUMP" >/dev/null && echo "DUMP_OK" || { echo "DUMP_CORRUPT — STOP"; exit 1; }
ls -lh "$DUMP"
```
إذا `DUMP_CORRUPT` ⇐ توقّف، لا DDL.

### (D2) تنفيذ DDL من worktree منفصل (لا يمسّ live webroot):
```bash
export PATH="/c/Program Files/PostgreSQL/16/bin:$PATH"
set -e
cd /c/Users/ice/Desktop/NamaMedical/namaweb
git fetch origin
rm -rf /c/nama_deploy_tmp; git worktree prune
git worktree add --detach /c/nama_deploy_tmp origin/integration/all-epics
cd /c/nama_deploy_tmp
PGUSER=postgres PGDATABASE=nama_medical_web PGHOST=localhost bash DEPLOY_RUN.sh
cd /c/Users/ice/Desktop/NamaMedical/namaweb
git worktree remove /c/nama_deploy_tmp
```
- الحارس الجديد يجب أن يطبع "proven NO-OP => SAFE to proceed" ويتابع بلا `CONFIRM_MULTITENANT`.
- إن أوقف الحارس أو ظهر `DEPLOY_RUN_EXIT_CODE != 0` ⇐ توقّف، لا تجاوز.

### الملخّص المعقّم المطلوب من المالك:
```
DDL_STATUS: SUCCESS | FAILED
BACKUP_CREATED: YES | NO
BACKUP_INTEGRITY: DUMP_OK | DUMP_CORRUPT
NULL_TENANT_COUNTS_ALL_ZERO: YES
GUARD_DECISION: ALLOWED_NOOP_BACKFILL | BLOCKED
DEPLOY_RUN_EXIT_CODE: 0 | <number>
SECRETS_SHARED: NO
PHI_SHARED: NO
```

---

## 8) ما لم يُنفَّذ بعد (محكوم ببوابة المالك)

- ❌ DDL (owner-run فقط) — لم يُنفَّذ.
- ❌ نشر كود `integration/all-epics` إلى live webroot — يأتي بعد نجاح DDL.
- ❌ إعادة تشغيل `nama-app` — بعد النشر فقط.
- ❌ smoke شامل + تفعيل SaaS — بعد النشر و التحقّق.
- accounting يبقى `OFF` · journal يبقى `0` · لا ZATCA/NPHIES/اتصالات خارجية.

---

## 9) سلامة الحوكمة

`SECRETS_PRINTED: NO` · `PHI_PRINTED: NO` · `KEYS_COMMITTED: NO` · `BACKUP_FILE_COMMITTED: NO` · `FORCE_PUSH_USED: NO` · `R17/master(namaweb): UNTOUCHED` · `accounting: OFF` · `journal: 0` · `ZATCA/NPHIES/external: NO`.

---

## 10) الإجراء التالي الموصى به

**`OWNER_RUN_BACKUP_THEN_DDL_FROM_DETACHED_WORKTREE`** — ينفّذ المالك أوامر القسم (7)، ثم يرسل الملخّص المعقّم لإكمال النشر + smoke + تفعيل SaaS (Phases E→H).
