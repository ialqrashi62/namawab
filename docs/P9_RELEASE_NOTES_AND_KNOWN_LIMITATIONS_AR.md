# PHASE 9 — ملاحظات الإصدار والمحدوديات المعروفة

> 2026-06-22 | حالة الإصدار للتسليم.

## ما اكتمل
- نظام Medical ERP/HIS كامل: 28 مجموعة، 371 مسار، 162 جدولاً، 44 شاشة.
- واجهة عربية RTL ثنائية اللغة، responsive.

## ما تم تصليبه (hardened)
- **عزل المستأجرين**: 148 جدول FORCE RLS، 0 فجوة (مملوءة + خاملة مغلقة incl. daily_close).
- التطبيق غير superuser (`nama_medical_app`)؛ ربط app.tenant_id لكل طلب (مُثبَت).
- RBAC: حراسات منشورة على system_users (POST/PUT/DELETE)، employees (POST/DELETE)، 0 ثقة بمستأجر من العميل.
- بنية تعافٍ تلقائي: PM2 logon resurrect + watchdog 5د + Redis unless-stopped.
- نسخ/تراجع: down.sql لكل دفعة + backups خارجية + runbook حوادث.

## موقوف بقرار المالك (لا حاجز إنتاج)
```text
- Browser E2E: pending test account (harness PASS)
- audit-reader GRANT: candidate ready, not deployed
- tenant_id indexes: optional (59/148, no perf blocker)
- accounting posting: OFF (separate approval)
```

## محدوديات معروفة (مقبولة)
- single-box (لا HA/تكرار)؛ التعافي auto لكن ليس فوري <ثوانٍ.
- استحقاقات المنشأة مُنفَّذة UI + RLS/auth backstop (حارس endpoint صريح = تحسين دفاع-في-العمق مستقبلي).
- دفاع-في-العمق: بعض UPDATE/SELECT تعتمد RLS بدل AND tenant_id الصريح (مُخفَّف، غير حاجز).
- المحاسبة معطّلة (readiness فقط).

## قائمة قبول المخاطر (risk acceptance)
البنود الموقوفة أعلاه مقبولة كـpending owner؛ لا منها يفتح تسريباً عبر المستأجرين (RLS يحمي).
```text
RELEASE: HARDENED_CORE_READY_WITH_OWNER_GATES
```
