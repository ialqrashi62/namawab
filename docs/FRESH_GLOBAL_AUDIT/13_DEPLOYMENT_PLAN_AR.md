# 13 — خطة النشر (Deployment Plan)

> 2026-06-22 | بروتوكول نشر محكوم (مبني على النمط المثبت في هذا المشروع). لا نشر في هذا التحليل.

## 1-4 الهدف/النطاق/المنهجية/الأدلة
نشر آمن على صندوق win32 واحد (PM2 + Postgres + Redis + Nginx/alfaisal-erp.com). النمط المثبّت: rehearse→backup→execute→validate→smoke→rollback-ready.

## العناصر
| المرحلة | السياسة |
|---|---|
| CI/CD | (مقترح) GitHub Actions: lint + node --check + test suite gate قبل الدمج |
| Build | لا build مطلوب (vanilla JS)؛ تحقّق syntax server.js + app.js |
| Test gates | تشغيل guards/RLS/regression suite (راجع 10)؛ بوابة خضراء إلزامية |
| Backup before deploy | dump schema+data + لقطة قبل أي DDL (نمط ~/nama_deploy_backups/) |
| Migration policy | DDL كـcandidate (up/validate/down) → rehearse على قاعدة معزولة → backup → execute atomic → validate → smoke. **لا DDL بلا موافقة بوابة** |
| Rollback plan | كود: `git -C namaweb checkout <prev> -- server.js && pm2 restart`؛ DB: down.sql لكل دفعة |
| PM2 | `pm2 restart nama-app --update-env`؛ dump.pm2 محفوظ؛ logon resurrect (HKCU Run) |
| Nginx | reverse proxy على alfaisal-erp.com (HTTPS)؛ TLS سليم |
| Domain verification | curl https://alfaisal-erp.com/api/health = 200 |
| Health checks | health 5/5 محلي + دومين بعد النشر |
| Smoke tests | unauth=401، عزل 3/0/0، الدور non-superuser، FORCE count ثابت |
| Post-deploy monitoring | watchdog كل 5د + سجل؛ مراقبة restart_time (crash-loop) |
| No-force-push | إلزامي؛ push FF فقط؛ احترام شجرة الجلسة الموازية (R17) |

## بوابة حرجة: الجلسة الموازية
**لا نشر كود namaweb بينما شجرة العمل بها تعديلات غير ملتزَمة للجلسة الموازية** (pm2 restart سيحمّل كودهم غير المكتمل). تحقّق `git -C namaweb status` نظيف قبل أي deploy.

## 6-12
المتطلبات: CI gate + backup-before-deploy آلي. الأولويات: حماية النشر مع الجلسة الموازية (P1). المخاطر: نشر فوق شجرة متّسخة. توصيات: بيئة staging منفصلة مستقبلاً. Acceptance: CI/backup/rollout/rollback/smoke/monitoring (✅). Next: 14 Style Guide.
