---
name: jumanasoft-observability-deployment
description: المراقبة وضبط التكلفة وبوابات النشر لجمانة سوفت — نمط النشر الآمن مع rollback، يستفيد من Vercel deploy skills.
---

# جمانة سوفت — المراقبة والنشر

## نمط النشر الآمن (مُثبَت على jumanasoft.com)
الخادم الحيّ: Hetzner، PM2 `nama-medical-erp`، `/var/www/namaweb`، فرع `integration/all-epics`. وصول SSH عبر `C:\Users\ice\.ssh\nama_medical_key`.
1. **نسخة احتياطية أولاً** (tree tar + `pg_dump -Fc`) → `/root/nama_backups/<stamp>/`.
2. رفع إلى `.deploy_staging/` → `node --check` + اختبار تحميل require + مخطّطات.
3. نسخ احتياطي لـ `server.js` الحالي → استبدال → `node --check` حيّ.
4. `pm2 restart` → فحص صحّة `/api/health` = `{"status":"UP","db":"up"}` (حتى 24s).
5. **rollback تلقائي** عند الفشل (استرجاع server.js + restart). `pm2 save`.
6. للـ DDL: تحقّق معزول أولاً (G9)، نسخة طازجة، `validate`، ثم الإنتاج.
- ملفّات ثابتة (html/app.js) = تُخدَّم فوراً بلا restart. تغيير server.js = restart.

## المراقبة (Observability)
- `/api/health` (status + db). PM2 (status/restarts/uptime — راقب أن العدّاد لا يتصاعد = ليس في حلقة).
- سجلّات: `pm2 logs` — رشّح الضجيج المعروف (`/%c0/` فحوصات مشوّهة). استهدف أخطاء جديدة فقط.
- مستقبلاً: تجميع سجلّات + تنبيهات (مفاتيح أخطاء، latency، 5xx rate). audit_trail للأحداث الحسّاسة.

## ضبط التكلفة (Cost Control)
- خادم واحد حالياً (8GB). راقب القرص (`df`)، الذاكرة، حجم النسخ الاحتياطية (نظّف القديمة).
- حدود معدّل (`RATE_LIMIT_GLOBAL`) متاحة. تنظيف TTL لجدول `idempotency_keys` (دوري).

## بوابات النشر (UAT + Deploy Gates)
- أخضر: اختبارات الوحدة + (إن وُجد) تكامل + `node --check`. لا نشر بلا ذلك.
- إذن صريح للإنتاج (G0). نافذة استخدام منخفض. نسخة + rollback جاهزان دائماً.
- بعد النشر: فحص صحّة + فحص بصري حيّ (Playwright) + استقرار (uptime يتصاعد، صفر أخطاء جديدة).

> راجع [[jumanasoft-global-gates]] G8/G9 و Vercel skills (`deploy-to-vercel`, `vercel-optimize`) لطبقة النشر السحابي للموقع العام.
