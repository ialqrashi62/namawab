# MEDICAL_RLS_AUTOPILOT_BLOCKER_SKILL_AR

## الهدف

إيقاف الأوتو بايلوت فوراً عند ظهور خطر أو فشل، وتوثيق blocker بدلاً من الاستمرار الخطر.

## متى يتم الإيقاف؟

* فشل backup.
* فشل اختبار.
* فشل rollback.
* فشل Nginx/PM2 smoke.
* Git dirty بشكل غير مفهوم.
* Secrets في logs.
* .env أو backups أو logs ضمن staged files.
* RLS بقي enabled بعد dry-run.
* policies بقيت بعد dry-run.
* missing tenant_id.
* rows orphaned بدون tenant.
* DB exposed للعامة.
* أي P0/P1.

## تقرير Blocker

اسم التقرير:
docs/MEDICAL_RLS_STAGING_ENABLEMENT_BLOCKER_AR.md

يحتوي:

* سبب الإيقاف.
* الأمر الذي فشل.
* الأثر.
* ما تم تغييره قبل الإيقاف.
* هل rollback تم؟
* هل DB آمنة؟
* هل Git آمن؟
* الخطوات المطلوبة لاستكمال المسار.

## صيغة الإغلاق للـ Blocker

STATUS:
MEDICAL_RLS_STAGING_ENABLEMENT_BLOCKED

BLOCKER_TYPE:
اذكر النوع

PRODUCTION_READY:
NO

DB_SAFE:
YES/NO

ROLLBACK_VERIFIED:
YES/NO/NOT_APPLICABLE

NEXT_REQUIRED_ACTION:
اذكر المطلوب
