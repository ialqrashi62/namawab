# 🏥 خطة ترقية محطة التمريض (Nursing Station) — مستوى Epic / Cerner

**التاريخ**: 2026-07-06 | **الإصدار**: v1.0 | **الحالة**: ✅ منفّذة (commit محلي في namaweb، لم تُدفع/تُنشر)

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

## المتبقي للمالك

1. إعادة تشغيل PM2 المحلي لتفعيل endpoints الجديدة (الجداول تُنشأ تلقائياً عند الإقلاع `CREATE TABLE IF NOT EXISTS`)
2. قرار الدفع للريموت (origin العام مجمّد حسب سياسة التعرض السابق)
3. اختبار دخان بالمتصفح: اختيار مريض → إدخال vitals → التحقق من NEWS2 → إضافة I&O → حفظ SBAR
4. لاحقاً: سياسات RLS للجداول الثلاثة الجديدة ضمن بوابة DDL قادمة
