# P0 الموجة 2 — 06 النشر المحكوم على الموقع (Controlled Website Deploy)

> التاريخ: 2026-06-20 | النطاق المنشور: **Class B code-only فقط** (آمن، بلا DDL).

## البيئة

| البند | القيمة |
| ----- | ------ |
| النطاق | alfaisal-erp.com |
| الخادم | 204.168.144.74 (ubuntu-8gb-hel1-1) |
| خدمة PM2 | nama-medical-erp |
| مسار التطبيق | /var/www/namaweb |

## Preflight

- نوع التعديل: **code-only** (لا DDL) — Class B فقط.
- تأكيد قراءة-فقط: الجداول الخمسة (telemedicine/pathology/social_work/mortuary/zatca) تحمل `tenant_id` على الإنتاج (5/5) → النشر آمن.
- blood_bank/approvals/package_sessions (Class A) **مستثناة** من الـ build المنشور (لا أعمدة على الإنتاج).

## خطوات النشر المنفّذة

1. **نسخة احتياطية**: `server.js.bak.20260620_041618` على الإنتاج (md5 قبل: `afab6e6e…`).
2. **scp**: نقل `server.js` المعدّل (md5 بعد: `006bc661…`) — تأكّد تغيّر البصمة.
3. **سلامة الصياغة على الإنتاج**: `node --check server.js` → OK.
4. **إعادة التشغيل**: `pm2 restart nama-medical-erp --update-env` → online.

## النتائج

| البند | القيمة |
| ----- | ------ |
| WEBSITE_DEPLOYED | YES (Class B) |
| PRODUCTION_DDL_EXECUTED | NO |
| PRODUCTION_BACKUP_CREATED | YES (server.js timestamped) |
| ROLLBACK_REQUIRED | NO |
| FINAL_NAMAWEB_HEAD | 70e01cf |

## التراجع (جاهز، لم يُستخدم)

`cp server.js.bak.20260620_041618 server.js && pm2 restart nama-medical-erp` + git revert للكود.

`WAVE2_CONTROLLED_WEBSITE_DEPLOY_COMPLETE`
