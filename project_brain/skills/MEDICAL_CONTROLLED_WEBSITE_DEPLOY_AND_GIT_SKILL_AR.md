# مهارة النشر المحكوم على الموقع وGitHub

## الهدف

هذه المهارة تضبط قاعدة: أي تعديل ناجح يجب أن يُرفع إلى GitHub ثم يُنشر على الموقع، لكن بدون تنفيذ عشوائي أو مخاطرة على الإنتاج.

## القاعدة العامة

بعد أي تعديل ناجح:

1. شغّل tests.
2. شغّل smoke.
3. شغّل hygiene audit.
4. commit داخل submodule إذا تغير.
5. push submodule إلى GitHub.
6. commit parent repo مع تحديث docs/memory/submodule pointer.
7. push parent repo.
8. انشر على الموقع إذا كان التعديل آمناً أو ضمن موافقة الإنتاج.
9. شغّل health/smoke على الموقع.
10. وثّق النشر.

## ممنوع

* force push.
* db push.
* migration غير موثقة.
* DDL إنتاجي بدون backup/validate/rollback.
* طباعة secrets.
* طباعة DATABASE_URL أو PGPASSWORD أو Redis URL.
* حذف بيانات.
* ترك Git dirty.
* إعلان deploy PASS بدون health/smoke.

## Preflight قبل النشر

تحقق من:

* production domain.
* production server.
* PM2 service.
* current production HEAD.
* previous stable commit.
* backup readiness.
* rollback commands.
* هل التعديل code-only أم DDL.
* هل يحتاج restart.
* هل يحتاج SQL.

## نشر code-only

إذا كان التعديل code-only:

* لا تشغل DDL.
* حدّث الكود فقط.
* npm install/build إذا لزم.
* restart PM2.
* health check.
* smoke check.
* logs observation.

## نشر DDL

إذا كان التعديل يحتوي DDL:

* backup إلزامي.
* noop safety إلزامي.
* up SQL.
* validate SQL.
* smoke.
* rollback readiness.
* لا تكمل إذا فشل أي Gate.

## تقارير النشر

أنشئ تقرير deploy يوضح:

* WEBSITE_DEPLOYED.
* PRODUCTION_DEPLOYED.
* PRODUCTION_DDL_EXECUTED.
* PRODUCTION_BACKUP_CREATED.
* HEALTH_CHECK.
* SMOKE.
* ROLLBACK_REQUIRED.
* FINAL_PARENT_HEAD.
* FINAL_NAMAWEB_HEAD.
