# تقرير تشخيص ما قبل تنفيذ DDL — integration/all-epics (read-only فقط)

> فحص preflight شامل بلا تنفيذ: لا DDL، لا DEPLOY_RUN.sh، لا deploy، لا restart، لا DB writes، لا قراءة محتوى backup، لا أسرار.
> التاريخ: 2026-06-26. المهارات: NM_GLOBAL_GATES + NM_GOVERNANCE_CLOSEOUT (دائماً) + NM_OBSERVABILITY_OPS + NM_SECURITY_DR_KEY_MANAGEMENT + NM_FINANCE_ACCOUNTING_GUARD.

## الحالة النهائية
**FINAL_STATUS: ALL_EPICS_DDL_PREFLIGHT_BLOCKED_AUTH** — السبب الجذري: أدوات عميل PostgreSQL ليست على PATH في Git Bash + `~/.pgpass` غير مهيّأ + المالك لم يُشغّل الأوامر بعد. **يتحوّل إلى SAFE_TO_OWNER_RUN فور إصلاح PATH + المصادقة.** كل الشروط الأخرى (الفرع/السكربت/webroot/مسار النسخة) خضراء ومُتحقَّقة.

## ما هو أخضر/جاهز
| الفحص | النتيجة |
|---|---|
| الموقع الحيّ webroot | `namaweb HEAD=171b7c2 على main` — **لم يُبدَّل** إلى integration ✓ (server.js/public/package.json/.git موجودة) |
| الفرع المطلوب | `origin/integration/all-epics = 64ac581` موجود ومتاح ✓ |
| DEPLOY_RUN.sh (static audit) | `set -euo pipefail` ✓ · `psql -v ON_ERROR_STOP=1` ✓ · حارس `MULTI-TENANT DB DETECTED → exit 1` ✓ · بوابة `CONFIRM_MULTITENANT` ✓ · لا DROP خطير · لا --force · لا أسرار → **SAFE_TO_OWNER_RUN** |
| مسار النسخة الاحتياطية | `/c/nama_backups` خارج أيّ git repo = آمن ✓ (و`../backups` متجاهَل في git) |
| /c/nama_deploy_tmp | غير موجود = نظيف ✓ |
| محرّك PostgreSQL | `postgresql-x64-16` **Running** ✓ (التطبيق يتّصل عبر node) |
| الموقع الحيّ HTTP | `/health=200` · `/login.html=200` · مسار جديد `/api/hr/leave-requests=404` (غير منشور، كما هو متوقّع) ✓ |
| الثوابت | accounting OFF · journal 0 · FORCE_RLS مرجعي=150 (يُتحقَّق runtime بعد DDL) |

## العوائق (يُصلحها المالك — كلها بيئية بسيطة)
1. **PG_TOOLS ليست على PATH:** `pg_dump/pg_restore/psql` = `command not found` في Git Bash، رغم أنها مُثبَّتة في `C:\Program Files\PostgreSQL\16\bin`. → أضِف المسار إلى PATH قبل التشغيل.
2. **PGPASS_NOT_READY:** `~/.pgpass` غير موجود في home الحالي. → أنشئه (600) أو استخدم `-W` تفاعلياً.
3. **PRIV_ROLE_UNKNOWN:** `<priv_role>` عنصر نائب — املأه بدور DB مخوّل للـDDL.
4. **OWNER_HAS_NOT_RUN_COMMANDS_YET:** لا backup، لا worktree tmp، live على 171b7c2 → الأوامر لم تُنفَّذ بعد.

## tenant posture
**UNKNOWN_FROM_AGENT (runtime-guarded):** لم أتّصل بالقاعدة (لا أدوات على PATH + لا مصادقة + قراءات الإنتاج محجوزة). **حارس DEPLOY_RUN.sh يحدّدها وقت التشغيل ويوقف (exit 1) إن كانت >1 مستأجر.** لا تُمرّر `CONFIRM_MULTITENANT=1`.

## عناصر dirty خارج النطاق (لم تُلمَس — R17 موازية)
`project_brain/`, `.ai-brain/AI_PROJECT_MEMORY.md`, `docs/STITCH_*`, `migrate.ps1` — **PRE_EXISTING_OUT_OF_SCOPE_DIRTY_ITEMS**، تُركت كما هي. (ملاحظة: worktree `agent-a1d63ffe1b681c120` على integration/all-epics باقٍ من بناء الدمج — غير ضارّ، قابل للإزالة بـ`git worktree remove`.)

## الأمر النهائي الآمن للمالك (بالقيم المكتشفة + إصلاح PATH)
```bash
# Git Bash على خادم الإنتاج (هذا الجهاز). لا PGPASSWORD مكشوف.
export PATH="/c/Program Files/PostgreSQL/16/bin:$PATH"   # إصلاح أدوات PG

# (مرّة واحدة) جهّز المصادقة بلا كشف: ~/.pgpass سطر واحد ثم 600
#   localhost:5432:nama_medical_web:<priv_role>:<password>
#   chmod 600 ~/.pgpass
# أو أضِف -W إلى pg_dump للإدخال التفاعلي.

set -e
mkdir -p /c/nama_backups
pg_dump -Fc -d nama_medical_web -U <priv_role> \
  -f "/c/nama_backups/pre_deploy_$(date +%F_%H%M%S).dump"
DUMP=$(ls -t /c/nama_backups/pre_deploy_*.dump | head -1)
pg_restore -l "$DUMP" >/dev/null && echo "DUMP_OK" || { echo "DUMP_CORRUPT — STOP"; exit 1; }
ls -lh "$DUMP"

cd /c/Users/ice/Desktop/NamaMedical/namaweb        # ← المسار الحيّ المكتشف
git fetch origin
rm -rf /c/nama_deploy_tmp
git worktree prune
git worktree add --detach /c/nama_deploy_tmp origin/integration/all-epics
cd /c/nama_deploy_tmp

PGUSER=<priv_role> PGDATABASE=nama_medical_web PGHOST=localhost bash DEPLOY_RUN.sh

cd /c/Users/ice/Desktop/NamaMedical/namaweb
git worktree remove /c/nama_deploy_tmp
```
عند `MULTI-TENANT DB DETECTED` → توقّف فوراً، أرسل المخرجات المعقّمة (عدد المستأجرين + سطر الإيقاف)، **لا `CONFIRM_MULTITENANT=1`**.

## ما لم يُنفَّذ (إثبات)
DDL: NO · DEPLOY_RUN: NO · DB writes: NO · deploy: NO · pm2 restart: NO · Docker/Vault/KEK: NO · ZATCA/NPHIES: NO · backup content read: NO · secrets printed: NO · force push: NO.

## الخطوة التالية
المالك ينفّذ الأمر أعلاه (بعد إصلاح PATH + .pgpass + املأ priv_role)، ثم يرسل الملخّص المعقّم → أبدأ Gate 0→9 (post-DDL verify + code deploy + pm2 restart nama-app + smoke + تقرير).
