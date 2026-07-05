# 🏥 خطة ترقية محطة التمريض (Nursing Station) — مستوى Epic / Cerner

**التاريخ**: 2026-07-06 | **الإصدار**: v1.0 | **الحالة**: ✅ منفّذة و**منشورة على الموقع الحي** jumanasoft.com (namaweb `bb80b3f` عبر git bundle + ff-merge + pm2 restart، صحة 200، الجداول أُنشئت تلقائياً؛ لم تُدفع لـGitHub — التجميد قائم)

---

## البنية المنفّذة — Three-Panel Layout

- **اللوحة اليسرى**: Patient Worklist (قائمة مرضى الوردية + NEWS2 + مستوى الفرز + الحالة + الغرفة، تحديث تلقائي كل 90 ثانية)
- **اللوحة الوسطى**: رأس المريض (تنبيه الحساسية + NEWS2 + شرائح البيانات) + 10 تبويبات
- **اللوحة اليمنى**: إجراءات سريعة حسب حالة المريض

## التبويبات العشرة المنفّذة

1. **🌡️ Vitals + NEWS2** — تسجيل كامل، حساب NEWS2 تلقائي (`calcNEWS2`)، تنبيه تصعيد عند ≥5
2. **💉 eMAR** — جدول إعطاء الأدوية بالورديات + Five Rights + توثيق إعطاء/رفض
3. **🩺 Head-to-Toe Assessment** — عصبي/تنفسي/قلبي/هضمي/بولي/جلد + ألم NRS
4. **📋 Care Plan** — تشخيصات NANDA (30+) + تدخلات + أهداف
5. **💧 I&O** — وارد/صادر + ميزان تلقائي، **محفوظ في السيرفر** عبر `GET/POST /api/nursing/io`
6. **🔄 Handover SBAR** — نموذج SBAR + طباعة + سجل التقارير السابقة، **محفوظ عبر `GET/POST /api/nursing/handover`** + نسخة في السجل الطبي
7. **⚠️ Triage ESI 1-5** — شكوى رئيسية + مستوى ESI + تحويل
8. **📊 Risk Assessments** — Morse (`calcMorse`) + Braden (`calcBraden`) + DVT + qSOFA
9. **📑 Nursing Orders Board** — أوامر الطبيب النشطة عبر `/api/patients/:id/active-orders`
10. **📝 Nursing Notes** — ملاحظات SOAP تمريضية

## الملفات

| الملف | التغيير |
|-------|---------|
| `public/js/nursing-station.js` | جديد (~1970 سطراً) — يستبدل `renderNursing` القديم عبر override آمن |
| `public/css/styles.css` | كتلة `ns-*` كاملة (هوية teal #0d9488 تمييزاً عن أزرق الطبيب) + كتلة `ds-*` |
| `public/index.html` | تسجيل السكربتات + كسر كاش v=20260706_3 |
| `server.js` | +160 سطراً: auto-provision لجداول `nursing_io` و`nursing_handover` و`visit_lifecycle` + 4 endpoints جديدة (tenant-scoped, parameterized) |

## ملاحظات أمنية

- كل الحقول الديناميكية مهرّبة بـ`escapeHTML` (نمط Layer-2 XSS في المشروع)
- الاستعلامات parameterized وكلها خلف `requireAuth + requireTenantScope`
- الجداول الجديدة تُفلتر بـ`tenant_id` في طبقة التطبيق؛ **سياسات RLS لها لم تُضف بعد** (تحتاج بوابة DDL من المالك أسوة بالجداول الأخرى)

## سجل النشر على الإنتاج (2026-07-06)

1. فحص قراءة: الحي كان على `7f2780c` (نفس الفرع، متزامن) — الدمج fast-forward نظيف
2. نسخة احتياطية على السيرفر: `/root/backup-pre-nursing-v1-20260705_215040.tar.gz`
3. النقل عبر `git bundle` + scp + `git merge --ff-only` (بدون المرور بـGitHub العام المجمّد)
4. `node --check` ✅ → `pm2 restart nama-medical-erp` ✅ → صحة 200 `{"status":"UP","db":"up"}`
5. الجداول أُنشئت: `nursing_io` ✅ `nursing_handover` ✅ (تحذير غير حرج: `visit_lifecycle` موجود مسبقاً بمالك آخر)
6. تحقق خارجي: nursing-station.js يُقدَّم 200 (114KB)، styles.css فيه 26 قاعدة `ns-`، `/api/nursing/io` محمي 401

## المتبقي للمالك

1. اختبار دخان بالمتصفح على jumanasoft.com: اختيار مريض → vitals → NEWS2 → I&O → SBAR
2. إعادة تشغيل PM2 **المحلي** إن أردت المحطة على localhost أيضاً
3. قرار الدفع لـGitHub (التجميد قائم؛ النشر تم بدون المساس به)
4. لاحقاً: سياسات RLS لجدولي `nursing_io` و`nursing_handover` ضمن بوابة DDL قادمة
