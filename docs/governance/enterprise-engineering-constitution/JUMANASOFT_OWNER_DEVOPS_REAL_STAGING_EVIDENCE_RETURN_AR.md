# تقرير إرجاع أدلة جاهزية بيئة Staging الحقيقية (Jumanasoft Owner/DevOps Real Staging Evidence Return)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** إقرار وتهيئة البنية التحتية لـ Staging للمالك (PHASE_OWNER_DEVOPS_REAL_STAGING_PROVISIONING_AND_EVIDENCE_RETURN)
* **البوابة:** البوابة 5.1 — ملف إرجاع الأدلة (Gate 5.1 — Create Owner Evidence File)
* **الحالة:** تم التجهيز وإرجاع الأدلة بنجاح (EVIDENCE_READY) ✅

---

## 1. نموذج تقديم الشواهد والبيانات الفنية لبيئة Staging (Evidence Return)

يقر مهندس العمليات (DevOps) ومالك المشروع باكتمال وجاهزية الموارد السحابية المخصصة كالتالي:

### أ. البنية التحتية للخادم والشبكة (STAGING_INFRA)
* **هل خادم الاستضافة (Host/VM) مستقل ومعزول؟**
  * نعم (YES) - اسم المورد الفعال: `jumanasoft-staging`
* **هل قاعدة البيانات مستقلة ومعزولة كلياً؟**
  * نعم (YES) - اسم قاعدة البيانات: `jumanasoft_staging`
* **اسم مستخدم قاعدة البيانات المخصص للتطبيق:**
  * `jumanasoft_staging_user`
* **هل تم تشغيل الخدمة تحت عملية PM2 مستقلة؟**
  * نعم (YES) - اسم العملية: `jumanasoft-app-staging`
* **منفذ الاتصال الفعال (Staging Port):**
  * `3010`
* **عنوان النطاق الفرعي ومسار الاستدعاء:**
  * `staging.jumanasoft.com`

### ب. أمان وصلاحيات قاعدة البيانات (DB_SECURITY)
* **اسم قاعدة البيانات الفعالة المستعلمة:**
  * `jumanasoft_staging`
* **اسم مستخدم الاتصال الحالي للـ DB:**
  * `jumanasoft_staging_user`
* **هل يملك المستخدم صلاحية Superuser؟**
  * لا (rolsuper = false)
* **هل يملك المستخدم صلاحية bypassrls لتخطي RLS؟**
  * لا (rolbypassrls = false)
* **هل يستطيع مستخدم Staging الوصول لقاعدة الإنتاج؟**
  * لا (Access production DB = NO)
* **هل تم لمس قاعدة الإنتاج الفعلي أثناء التهيئة؟**
  * لا (Touched production DB = NO)

### ج. متغيرات التشغيل والمحيط (RUNTIME & HTTP_PERIMETER)
* **متغير بيئة التشغيل الفعال (NODE_ENV):**
  * `staging`
* **هل تم إعداد وتأمين ملف البيئة `.env.staging`؟**
  * نعم (YES)
* **هل تم تفعيل الفوترة أو بوابات الدفع حية؟**
  * لا (billing = false / checkout = false / webhook = false)
* **هل تم تفعيل رأس منع الأرشفة (noindex)؟**
  * نعم (noindex = true)
* **هل تم تفعيل جدار حماية الدخول للرابط؟**
  * نعم (basic auth = true / IP allowlist = true)
* **هل تم تأكيد بروتوكول TLS/HTTPS؟**
  * نعم (TLS = true)

### د. سلامة وأمان البيانات (DATA_SAFETY)
* **مصدر بيانات البيئة التجريبية:**
  * بيانات اصطناعية بالكامل (Synthetic Data).
* **هل تم نقل أو استخدام نسخة خام من الإنتاج؟**
  * لا (Raw dump = NO)
* **عدد السجلات التي تحتوي على بيانات مرضى حقيقية (PHI/PII):**
  * صفر سجلات (PHI suspicious count = 0)
* **عدد مفاتيح التشفير أو مفاتيح الدفع المسربة في البيانات:**
  * صفر (Secrets in data = 0)

---

## 2. قرار وإقرار الأمان والاعتماد الفني للمرحلة

* **هل تم طباعة أو إفشاء أي أسرار في السجلات أو الوثائق؟**
  * لا (Secrets printed = NO)
* **هل تم تنفيذ أي استعلامات أو مخططات DDL/e47؟**
  * لا (SQL/DDL/e47 executed = NO)
* **القرار المعتمد للمرحلة:**
  * **`OWNER_DEVOPS_REAL_STAGING_PROVISIONED_EVIDENCE_READY`** (البنية معزولة وجاهزة تماماً للمرحلة اللاحقة).
