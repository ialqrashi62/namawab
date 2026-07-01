# نموذج إرجاع شواهد وأدلة تهيئة بيئة Staging (Jumanasoft Real Staging Owner Evidence Template)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** تهيئة وفحص جاهزية بيئة Staging الحقيقية (PHASE_REAL_STAGING_INFRA_PROVISIONING_AND_EVIDENCE_CAPTURE)
* **البوابة:** البوابة B2 — نموذج أدلة المالك (Gate B2 — Owner Evidence Template)
* **الحالة:** تم التوثيق والفرض بنجاح (ENFORCED) ✅

---

## 1. شواهد التحقق المطلوبة من فريق الديف أوبس (DevOps Evidence Checklist)

بعد قيام مسؤول النظام بتهيئة الخادم وقاعدة البيانات بنجاح، يُطلب منه تعبئة وتقديم الشواهد الموثقة التالية (بدون طباعة كلمات مرور أو معلومات سرية):

### 1. شواهد قاعدة البيانات وعزلها:
- [ ] **اسم قاعدة البيانات الفعال:** تقديم نتيجة استعلام `SELECT current_database();` وتأكيد مطابقتها لـ `jumanasoft_staging`.
- [ ] **اسم مستخدم الاتصال الفعال:** تقديم نتيجة استعلام `SELECT current_user;` ومطابقتها لـ `jumanasoft_staging_user`.
- [ ] **أعلام الصلاحيات الفنية للمستخدم:** تقديم نتيجة استعلام:
  `SELECT rolname, rolsuper, rolbypassrls FROM pg_roles WHERE rolname = 'jumanasoft_staging_user';`
  (تأكيد أن القيم تساوي `f` أو `false` لصلاحيات superuser و bypassrls).
- [ ] **تأكيد عزل قاعدة الإنتاج:** تقديم إثبات يفيد بعدم قدرة المستخدم `jumanasoft_staging_user` على قراءة أو كتابة جداول في قاعدة البيانات `nama_medical_web`.

### 2. شواهد خادم الويب والعمليات:
- [ ] **اسم العملية الفعالة في PM2:** تقديم مخرجات `pm2 list` التي تبين حالة تشغيل `jumanasoft-app-staging`.
- [ ] **فحص الاتصال والاستجابة (Health Check HTTP Status):** نتيجة فحص الاستدعاء `curl -I https://staging.jumanasoft.com/api/health` وتأكيد رمز الحالة `200 OK`.
- [ ] **إثبات حماية المسارات (noindex & basic auth):**
  * إثبات تفعيل Basic HTTP Authentication عند محاولة الوصول للنطاق التجريبي.
  * لقطة شاشة أو مخرجات ترويسة تفيد بوجود `X-Robots-Tag: noindex`.
- [ ] **إقرار الأمان وخلو السجلات من التسريبات:** إقرار خطي وخالٍ من الأسرار يفيد بعدم طباعة أي كلمات مرور أو معلومات دفع Moyasar/Stripe في سجلات التشغيل.

---
**القرار:** تم تصميم وإدراج نموذج أدلة التحقق للمالك، ومصرح بالانتقال لـ GATE B3 لصياغة الأوامر الآمنة الموجهة للمسؤول.
