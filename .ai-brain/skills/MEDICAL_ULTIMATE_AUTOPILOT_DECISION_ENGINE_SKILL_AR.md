# مهارة الأوتو بيلوت الشامل واتخاذ القرار التلقائي — NamaMedical

## 1. اسم المهارة

`MEDICAL_ULTIMATE_AUTOPILOT_DECISION_ENGINE_SKILL_AR`

## 2. الهدف

هذه المهارة تجعل الوكيل يعمل بنظام Auto Pilot كامل داخل مشروع `NamaMedical` بحيث:

* يقرأ السياق والسكلز السابقة تلقائياً.
* يحدد المرحلة الحالية والمرحلة التالية تلقائياً.
* ينفذ Gate-by-Gate دون طلب موافقة في كل خطوة آمنة.
* يتخذ القرارات الفنية التالية بنفسه بناءً على الأدلة.
* ينشئ التقارير العربية المطلوبة.
* يحدث ذاكرة المشروع والسكلز والفهارس.
* يشغل الاختبارات الآمنة.
* يعمل commit/push عند اكتمال البوابات.
* يوقف نفسه فقط عند وجود خطر حقيقي أو قرار يحتاج موافقة صريحة.

## 3. قاعدة التشغيل الأساسية

اعمل دائماً كالتالي:

1. اقرأ `.ai-brain/AI_PROJECT_MEMORY.md`.
2. اقرأ `.ai-brain/skills/`.
3. اقرأ آخر تقارير المرحلة السابقة في `docs/`.
4. حدد المرحلة الحالية من آخر `STATUS`.
5. حدد هل المرحلة:

   * Design
   * Implementation Controlled Staging
   * Post-Implementation Monitoring
   * Final Review
   * Production Readiness Design
   * Production Readiness Execution on Staging
   * Blocker Resolution
6. نفّذ البوابات تلقائياً.
7. إذا نجحت البوابة، انتقل للتي بعدها.
8. إذا فشلت بوابة حرجة، أوقف المرحلة وأنشئ BLOCKER.
9. لا تطلب موافقة من المستخدم إلا في حالات Hard Stop المذكورة أدناه.

## 4. صلاحيات القرار التلقائي

يحق للوكيل اتخاذ القرارات التالية تلقائياً دون سؤال المستخدم:

### 4.1 قرارات التصميم

* اختيار التقارير المطلوبة.
* إنشاء Skill Delta عند الحاجة.
* إنشاء SQL read-only validation.
* إنشاء SQL no-op safety checks.
* تصنيف الجداول إلى RLS / API-only / Global Reference / Needs Follow-up.
* تحديد المرحلة التالية بعد التصميم.
* تحديث الذاكرة والفهارس.
* commit/push للتوثيق فقط.

### 4.2 قرارات Staging الآمنة

* تشغيل read-only validation.
* تشغيل regression tests.
* تشغيل smoke tests الآمنة.
* تنفيذ API hardening على Staging إذا كان ضمن نطاق المرحلة.
* إنشاء test automation.
* تنفيذ RLS/DDL على Staging فقط إذا:

  * تم إنشاء backup آمن خارج Git.
  * truth validation PASS.
  * backfill source آمن.
  * rollback موجود.
  * validate SQL موجود.
  * لا توجد بيانات مرضى معرضة للخطر.
  * المرحلة صرحت صراحة بالتنفيذ.

### 4.3 قرارات المراقبة

* إعادة فحص RLS.
* إعادة فحص API.
* تشغيل الاختبارات.
* فحص runtime logs دون طباعة أسرار.
* إنشاء post-monitoring reports.
* تحديد هل المرحلة التالية Follow-up أو Batch جديد أو Production Readiness.

### 4.4 قرارات Git

* تنظيف trailing whitespace.
* تحديث `.gitignore`.
* منع backup files من Git.
* إزالة backup من Git index باستخدام `git rm --cached` إذا كان الملف backup فقط.
* commit/push بعد نجاح:

  * tests
  * secrets audit
  * UTF-8 audit
  * git diff --check

## 5. حالات التوقف الإجباري Hard Stop

يجب إيقاف الأوتو بيلوت فوراً وعدم المتابعة تلقائياً إذا حدث أي مما يلي:

### 5.1 إنتاج حقيقي

توقف إذا كان المطلوب:

* Production deployment.
* تغيير Production env.
* تشغيل migration على Production.
* تشغيل db push على Production.
* تغيير DNS أو SSL production.
* حذف أو إعادة نشر موقع production.

الحالة:
`BLOCKED_REQUIRES_EXPLICIT_PRODUCTION_APPROVAL`

### 5.2 بيانات أو جداول حساسة

توقف إذا كان المطلوب:

* حذف بيانات.
* UPDATE/DELETE واسع.
* backfill غير مثبت المصدر.
* تغيير بيانات مرضى حقيقية.
* لمس جدول خارج نطاق المرحلة.
* تشغيل DDL بدون backup وtruth validation.

الحالة:
`BLOCKED_DATA_SAFETY_RISK`

### 5.3 أسرار وتسريبات

توقف إذا ظهر داخل Git:

* `DATABASE_URL`
* `PGPASSWORD` بقيمة فعلية
* `password_hash`
* private key
* token
* secret
* `.env`
* backup SQL متتبع
* روابط محلية محفوظة داخل التقارير مثل `file:///` أو مسارات مطور محلية.

الحالة:
`BLOCKED_SECRETS_OR_LOCAL_PATHS_IN_GIT`

### 5.4 Git history rewrite أو force push

توقف إذا احتجت:

* history rewrite.
* force push.
* BFG.
* git filter-repo.
* حذف أسرار من تاريخ Git.

الحالة:
`BLOCKED_REQUIRES_HISTORY_REWRITE_APPROVAL`

### 5.5 فشل الاختبارات الحرجة

توقف إذا فشل:

* tenant isolation test.
* RLS validation.
* API IDOR test.
* login regression.
* backup validation.
* restore drill validation.

الحالة:
`BLOCKED_CRITICAL_TEST_FAILURE`

## 6. قواعد منع التكرار

قبل إنشاء أي Skill جديد:

1. افحص `.ai-brain/skills/`.
2. إذا توجد مهارة قريبة، استخدمها.
3. لا تعيد كتابة السكلز من الصفر.
4. أنشئ Skill Delta فقط عند الحاجة.
5. حدث `MEDICAL_SKILLS_INDEX_AR.md`.

## 7. قواعد اللغة والترميز

كل التقارير العربية يجب أن تكون:

* UTF-8 نظيف.
* بدون Mojibake.
* بدون:

  * `Ø`
  * `Ù`
  * `ï»¿`
  * ``
* بدون روابط محلية.
* sans secrets.
* بدون قيم اتصال.
* بدون dump بيانات.

قبل commit شغّل:

```bash
git diff --check
git grep --untracked -n -E "file:///|C:\\Users|C:\\Program Files|PGPASSWORD|DATABASE_URL|password_hash|PRIVATE KEY|TOKEN|SECRET|\.env"
git grep --untracked -n -E "Ø|Ù|ï»¿|" docs/ .ai-brain/
```

## 8. محرك اختيار المرحلة التالية

بعد كل مرحلة، اختر المرحلة التالية تلقائياً حسب القواعد:

### إذا كانت المرحلة Design وانتهت PASS

اختر:
`IMPLEMENTATION_CONTROLLED_STAGING`

إلا إذا:

* API_SECURITY_REVIEW = WARNING
  اختر:
  `API_WARNING_RESOLUTION_FIRST`

* BACKFILL_SOURCE_INVALID
  اختر:
  `BLOCKER_RESOLUTION`

* TESTING_GAP_MAJOR
  اختر:
  `TEST_AUTOMATION_BOOTSTRAP`

### إذا كانت المرحلة Implementation وانتهت PASS

اختر:
`POST_IMPLEMENTATION_MONITORING`

### إذا كانت المرحلة Post-Monitoring وانتهت PASS

اختر:

* batch التالي إذا بقيت دفعات.
* أو final coverage review إذا اكتملت الدفعات.
* أو production readiness design إذا اكتمل final review.

### إذا كانت المرحلة Final RLS Review وانتهت PASS

إذا:
`BLOCK_PRODUCTION_RISKS: YES`

اختر:
`PRODUCTION_READINESS_DESIGN_AND_RUNBOOKS`

إذا:
`TABLES_NEEDING_FOLLOWUP > 0` وخطرها حرج

اختر:
`FINAL_RLS_FOLLOWUP_IMPLEMENTATION`

### إذا كانت Production Readiness Design وانتهت PASS

اختر:
`PRODUCTION_READINESS_EXECUTION_CONTROLLED_STAGING`

### إذا كانت Production Readiness Execution على Staging وانتهت PASS

إذا كل P0 مغلقة:
اختر:
`PRODUCTION_REHEARSAL_CONTROLLED_STAGING`

إذا بقي P0:
اختر:
`PRODUCTION_READINESS_EXECUTION_CONTINUE`

### إذا ظهر Blocker

اختر:
`BLOCKER_RESOLUTION_<CAUSE>_AUTOPILOT`

ولا تكمل المرحلة الأصلية حتى يغلق الحظر.

## 9. قالب البوابات الافتراضي لأي مرحلة

استخدم هذه البوابات إذا لم يوجد قالب خاص:

### Gate 0: Preflight

* git status
* branch
* latest commits
* git diff --check
* backup tracked check
* secrets check
* local paths check

### Gate 1: Context Review

* اقرأ الذاكرة.
* اقرأ السكلز.
* اقرأ التقارير السابقة.
* استخرج القرارات المفتوحة.

### Gate 2: Truth Validation

* read-only validation.
* schema discovery.
* DB truth.
* API truth.
* test truth.

### Gate 3: Decision Matrix

* صنف الحالة.
* حدد القرار.
* حدد هل التنفيذ مسموح أو لا.

### Gate 4: Safe Execution or Documentation

حسب نوع المرحلة:

* Design: أنشئ تقارير فقط.
* Implementation: نفذ ضمن Staging فقط.
* Monitoring: تحقق فقط.
* Blocker: أصلح الحظر فقط.

### Gate 5: Tests

* regression tests.
* cross-tenant tests.
* smoke tests.
* validate scripts.

### Gate 6: Security Audit

* secrets.
* local paths.
* backups.
* UTF-8 Arabic.
* git diff.

### Gate 7: Reports

أنشئ التقارير العربية المطلوبة.

### Gate 8: Memory and Skills

* حدث AI_PROJECT_MEMORY.
* حدث skills index.
* حدث reports index إذا موجود.

### Gate 9: Commit / Push

نفذ commit/push فقط إذا:

* لا يوجد blocker.
* لا توجد أسرار.
* لا توجد روابط محلية.
* لا يوجد backup tracked.
* tests pass.
* git diff --check pass.

## 10. قواعد RLS وTenant Isolation

لا تفعل RLS إلا إذا:

* الجدول له tenant ownership واضح.
* tenant_id موجود أو backfill source آمن.
* backup موجود خارج Git.
* validate SQL موجود.
* down SQL موجود.
* لا توجد NULL tenant_id خطرة.
* لا توجد tenant mismatch.
* policy لا تستخدم `USING (true)`.
* policy تعتمد tenant context آمن.
* FORCE RLS مطلوب للجداول الحساسة.
* API لا يقبل tenant_id من العميل.

## 11. قواعد API Hardening

أي route حساس يجب أن يلتزم بالتالي:

* يستخدم requireTenantScope أو equivalent.
* لا يقبل tenant_id من body/query.
* يستمد tenant من session/server context.
* يتحقق من patient/admission/room/branch/facility ownership.
* يمنع IDOR.
* يمنع mass assignment.
* يعيد 403/404 بدون تسريب.
* counters/reports/dashboard scoped by tenant.

## 12. قواعد Backup

* لا تحفظ backup داخل Git.
* لا تضف backup إلى docs إذا قد يدخل Git.
* facebook/استخدم مجلد محلي مستبعد.
* حدث `.gitignore`.
* لا تطبع محتوى backup.
* إذا backup دخل Git:

  * أوقف المرحلة.
  * أزل من index.
  * صنف خطر history.
  * لا تعمل history rewrite إلا بموافقة صريحة.

## 13. قواعد Production Readiness

حتى لو اكتملت كل مراحل Staging:

لا تعلن Production Ready إلا بعد مرحلة منفصلة تشمل:

* Redis/distributed session store.
* HTTPS/Secure Cookies.
* backup/restore drill.
* monitoring/alerting.
* load testing.
* rollback rehearsal.
* secrets rotation.
* production rehearsal.
* Go/No-Go approval.

الافتراضي:
`PRODUCTION_READY: NO`

## 14. صيغة الإغلاق العامة

كل مرحلة يجب أن تنتهي بصيغة Closeout:

```yaml
STATUS:
<PHASE_COMPLETED_OR_BLOCKED>

ENVIRONMENT_CLASSIFICATION:
PUBLIC_STAGING_HTTPS_RLS_BATCH6_ENABLED_NOT_FULL_PRODUCTION

AUTOPILOT_MODE:
CONTROLLED_GATE_BY_GATE

SKILLS_USED:
YES

NEW_SKILL_CREATED:
YES/NO

SCOPE:
<EXACT_SCOPE>

DB_CHANGED:
YES/NO

TABLE_COLUMN_SCHEMA_CHANGED:
YES/NO

DATABASE_SECURITY_DDL_CHANGED:
YES/NO

MIGRATIONS_RUN:
YES/NO

DB_PUSH_RUN:
NO

RLS_CHANGED:
YES/NO

PRODUCTION_DEPLOYED:
NO

SECRETS_IN_GIT_TRACKED_FILES:
NO/YES

SECRETS_IN_EXECUTION_TRANSCRIPT:
YES_REDACTION_NOTE/NO

FILE_URL_OR_LOCAL_PATHS_IN_REPORTS:
NO/YES

UTF8_ARABIC_AUDIT:
PASS/FAIL

GIT_DIFF_CHECK:
PASS/FAIL

GIT_COMMITTED:
YES/NO

GIT_PUSHED:
YES/NO

PRODUCTION_READY:
NO

NEXT_RECOMMENDED_PHASE:
<NEXT_PHASE>
```

## 15. قرار الإكمال النهائي

لا تكتب عبارة:
`تم اكتمال المخطط بالكامل`

إلا إذا:

* لا توجد مراحل P0 مفتوحة.
* لا توجد blockers.
* لا توجد production risks.
* لا توجد أسرار.
* لا توجد backup tracked.
* كل tests PASS.
* كل docs UTF-8 PASS.
* commit/push تم.
* production readiness أوضح أن النظام جاهز فعلاً.
* المستخدم وافق صراحة على الإغلاق النهائي.

## 16. طريقة استخدام المهارة

عند بداية أي جلسة أو مرحلة، استخدم هذا الأمر:

"اقرأ مهارة MEDICAL_ULTIMATE_AUTOPILOT_DECISION_ENGINE_SKILL_AR وطبّقها كمرجع أعلى لاتخاذ القرار التلقائي، ثم اقرأ بقية السكلز الموجودة، وحدد المرحلة التالية ونفذها Gate-by-Gate دون طلب موافقة إلا عند Hard Stop."
