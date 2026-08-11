# خطة تنفيذ شاملة: ZATCA (منصة الفوترة الإلكترونية)

## الهدف
تحويل تكامل ZATCA الحالي من حالة "جاهز تشفيريًا" إلى حالة "جاهز تشغيلًا" عبر طبقة إعدادات متخصصة، Onboarding منضبط، وربط إرسال الفواتير مع حواجز أمان متعددة المستأجرين.

## الوضع الحالي (مؤكد من الكود)
- موجود بالفعل:
  - `zatca_phase2.js` (تشفير/توقيع/QR/Client)
  - مسارات `/api/zatca/generate` و `/api/zatca/submit`
  - تكامل `integration_settings` لحفظ مفاتيح التكامل
- الفجوة:
  - إعدادات ZATCA في الواجهة ما زالت عامة وغير موجهة لتدفق CSR/CSID/Production rollout.
  - لا يوجد نموذج واجهة واضح لحقول CSR Profile + مفاتيح المرحلة الثانية.
  - OTP يجب أن يبقى مؤقتًا وغير مخزن.

## المبادئ غير القابلة للتفاوض
1. لا تخزين OTP بشكل دائم.
2. لا تسجيل Secrets/PHI في السجلات.
3. عزل Tenant إلزامي في جميع عمليات القراءة/الحفظ/الإرسال.
4. الإرسال الخارجي يبقى gated حتى اكتمال CSID والاعتماد.

## الخطة المرحلية

### المرحلة A: واجهة إعدادات ZATCA متخصصة (تنفيذ فوري)
- بناء نموذج ZATCA داخل Settings > Compliance بدل JSON عام فقط.
- الحقول:
  - Environment: sandbox/simulation/production
  - CSID (api_key) و Secret (api_secret)
  - Private/Public PEM
  - CSR Profile (CN, SN, UID, OU, O, C, invoice type, location, business category)
  - SDK Home Path (اختياري)
- إضافة ملاحظات واضحة:
  - OTP تشغيلي مؤقت غير محفوظ.

### المرحلة B: طبقة توحيد/تحقق الإعدادات (تنفيذ فوري)
- مكتبة `lib/compliance/zatca_settings.js`:
  - normalize
  - validate
  - redact
  - build SDK paths
- اختبار DB-free مستقل يغطي الحالات الأساسية وحدود الأمان.

### المرحلة C: ربط تشغيلي مضبوط (تالية)
- استهلاك validator داخل مسار submit قبل الإرسال الخارجي.
- رسائل أخطاء دقيقة للمشغل (missing key, malformed PEM, env mismatch).

### المرحلة D: دورة Onboarding (تالية)
- صفحة تشغيلية خطوة-بخطوة:
  - توليد CSR Config
  - تشغيل أوامر SDK/openssl
  - إدخال CSID/Secret
  - اختبار Compliance API

### المرحلة E: Go-live controls (تالية)
- Feature flags تدريجية لكل Tenant.
- سجل تدقيق خاص بحركة إعدادات ZATCA.
- Runbook rollback + rotation policy.

## ما تم تنفيذه في هذه الجلسة
- بدء المرحلة A و B مباشرة:
  1. إنشاء مكتبة إعدادات ZATCA (normalize/validate/redact).
  2. إنشاء اختبار DB-free للمكتبة.
  3. تحديث واجهة الإعدادات لإظهار نموذج ZATCA مخصص.

## مؤشرات النجاح
1. يمكن حفظ إعدادات ZATCA بدون JSON يدوي.
2. OTP لا يُخزن ولا يُرسل كسِر دائم.
3. اختبار المكتبة ينجح محليًا.
4. `npm run test:safe` يبقى PASS.
