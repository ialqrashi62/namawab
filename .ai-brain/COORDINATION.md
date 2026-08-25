# COORDINATION.md — تنسيق الجلسات المتوازية
> للجلسة/الوكيل الآخر العامل على هذا المستودع · أُنشئ 2026-08-25

## الخريطة المرجعية (ماذا يعمل أين)
| الجهة | الفرع/المسار | ملاحظات |
|---|---|---|
| الإنتاج الحي | `/var/www/namaweb` @ برانش `production/live-20260825` | PM2: nama-medical-erp · لا branch-switch أبداً |
| التطوير الموحد | `integration/unify-20260825` | يشمل كل إصلاحات اليوم |
| لقطات WIP | `wip-untracked-snapshot-20260825` | شبكة أمان لعملك غير المتتبع |
| bump الأب | `parent-bump-tier-unify` + `tier-automount-bump` | |

## مناطق نشطة الآن (تجنّب التعديل المتزامن)
- `namaweb/server.js` — فيه حلقتا mount (الخاصة بك + الموحدة). الاثنتان تعملان معاً بلا كسر؛ الدمج النهائي قرار مالك.
- `namaweb/routes/*.js` الجديدة (34 ملف) — تم أرشفتها في سناب شوت أعلاه.

## قواعد النشر المتفق عليها
1. نشر additive-only (ملفات جديدة أو رقع سطرية جراحية)
2. قبل أي deploy: collision pre-check → node --check → pm2 reload --wait-ready → health → endpoint smoke
3. ممنوع: force-push، branch-switch على live، حذف untracked بدون سناب شوت
4. بعد كل deploy: حدّث ACTIVITY_LOG.md

## نقاط تحتاج قرار المالك
- فصل remote الأب عن الـ submodule (حالياً نفس repo GitHub = تصادم تواريخ)
- تفعيل `TIER_AUTH_REQUIRED=1` بعد تحديث مستهلكي /tier*
- الدمج الهيكلي الكبير (خططه في ROADMAP_GAPS_USER_STORIES.md)
