# مهارة التقارير والنظافة والإغلاق

## الهدف

توحيد شكل التقارير والإغلاق ومنع الأخطاء المتكررة في الوثائق.

## قواعد التقارير

كل تقرير عربي يجب أن يكون:

* UTF-8 سليم.
* بدون mojibake.
* بدون file:///.
* بدون مسارات محلية مثل C:\Users أو C:\Program Files أو C:\var.
* بدون أسرار.
* بدون backup data.
* واضح القرار.

## Hygiene Audit

قبل أي commit شغّل:

git diff --check

git grep --untracked -n -E "file:///|C:\\Users|C:\\Program Files|C:\\var|PGPASSWORD|DATABASE_URL|password_hash|PRIVATE KEY|TOKEN|SECRET|\.env" docs/ .ai-brain/ namaweb/ || true

git grep --untracked -n -E "Ø|Ù|ï»¿|�" docs/ .ai-brain/ || true

git ls-files docs/sql/*backup*

## نتائج hygiene المطلوبة

* SECRETS_IN_GIT_TRACKED_FILES: NO
* SECRETS_IN_EXECUTION_TRANSCRIPT: YES_REDACTION_NOTE إذا ذُكرت أسماء متغيرات أو استخدمت أوامر حساسة بدون قيم.
* FILE_URL_OR_LOCAL_PATHS_IN_REPORTS: NO
* UTF8_ARABIC_AUDIT: PASS
* GIT_DIFF_CHECK: PASS
* GIT_FORCE_PUSHED: NO

## صيغة الإغلاق

كل مرحلة يجب أن تنتهي بكتلة status واضحة:

STATUS:
<phase_status>

SCOPE: <scope>

PRODUCTION_READY: <value>

P0_OPEN:
YES/NO/PARTIAL

P1_OPEN:
YES/NO

GIT_COMMITTED:
YES/NO

GIT_PUSHED:
YES/NO

NEXT_RECOMMENDED_PHASE: <phase>

## ممنوع في الإغلاق

* لا تكتب "تم اكتمال المخطط بالكامل" إلا إذا كل شروط الإنتاج أو المرحلة تحققت.
* لا تعلن PRODUCTION_READY: YES_MULTI_TENANT_READY إذا بقي P0.
* لا تخفِ failures.
* لا تعتبر فشل test PASS بدون تفسير.
* لا تسجل file:/// أو local paths.
