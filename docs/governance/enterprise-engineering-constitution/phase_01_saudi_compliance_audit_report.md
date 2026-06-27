# تقرير تدقيق ومطابقة الامتثال الوطني السعودي (Saudi Compliance Audit Report)

| رمز الوثيقة | EEC-KSA-AUDIT-P01 |
|---|---|
| المرحلة | المرحلة 01: الامتثال التنظيمي والربط الحكومي |
| تاريخ التدقيق | 2026-06-27 |
| المشروع | جمانا الطبي (jumanaMedical) |
| جهة التدقيق | وكيل الحوكمة والتحقق المؤسسي (Antigravity Autopilot) |
| الحالة النهائية للمرحلة | **PHASE-01_SUCCESS (اجتياز كامل بنجاح)** |

---

## 1. الفوترة الإلكترونية (ZATCA Phase 2 Compliance)

تم تدقيق موديول الفوترة الإلكترونية ومطابقته مع المتمتطلبات المحددة في الدستور الهندسي [20_ZATCA_EINVOICING_FINANCE_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/governance/enterprise-engineering-constitution/20_ZATCA_EINVOICING_FINANCE_AR.md)، وجاءت النتائج كالتالي:

### 1.1 مطابقة المتطلبات الإلزامية
- **حسابات المبالغ والضريبة (Autoritative Money Math) - [PASS]**:
  - يتم إجراء الحسابات المالية داخل [finance_engine.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/finance_engine.js) باستخدام فئة الهللات الصحيحة (Integer Halalas) لمنع أي انحراف في الكسور العشرية أو تلاعب من العميل.
  - ضريبة القيمة المضافة (15%) تُحسب بالكامل بالخادم (`vatFromInclusive` / `vatFromExclusive`) وتتجاهل أي قيم مرسلة من واجهة المستخدم.
- **توليد ملفات XML لـ ZATCA UBL 2.1 - [PASS]**:
  - يتم توليد الفواتير بتنسيق XML متوافق بالكامل عبر `buildUBLInvoice` وبطريقة حتمية (Deterministic) لضمان اتساق قيم التوقيع والهاش.
  - تُستخدم دالة `xmlEscape` لتعقيم مدخلات المرضى والجهات ومنع أي هجمات حقن برمجي داخل الهيكل المستهدف.
- **توليد رمز الاستجابة السريعة (ZATCA TLV QR) - [PASS]**:
  - تُشفر الحقول الخمسة المطلوبة (اسم البائع، رقم الضريبة، التاريخ، المجموع الشامل، ومجموع الضريبة) بتنسيق TLV ثنائي حتمي ثم تُحول للترميز Base64 عبر دالة `buildZatcaQR` و `tlv` في [finance_engine.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/finance_engine.js).
- **حارس تجميد القيود المالية (Journal Guard) - [PASS]**:
  - يتم تطبيق سياسة صارمة تجعل القيود المالية واليومية غير قابلة للتعديل أو الحذف بعد ترحيلها، ويكون التعديل الوحيد المسموح به عبر قيود عكسية (Reversal Entries) متوازنة يتم بناؤها وتدقيقها بالخادم.
- **حارس الربط الفعلي (ZATCA Integration Gate) - [PASS]**:
  - في حال عدم تفعيل خيار `ZATCA_ENABLED` أو عدم توفر المفتاح CSID، يكتفي النظام بتسجيل نية الإرسال بالجدول (`clearance_status = RECORDED`) ويرجع فوراً رمز الاستجابة `503 Service Unavailable` لمنع الربط الوهمي أو الفشل الفعلي في بيئة الإنتاج.

---

## 2. الضمان الصحي والربط مع هيئة التأمين (NPHIES Compliance)

تم تدقيق موديول التأمين وتكامل NPHIES ومطابقته مع الدستور [19_NPHIES_INSURANCE_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/governance/enterprise-engineering-constitution/19_NPHIES_INSURANCE_AR.md):

### 2.1 مطابقة المتطلبات الإلزامية
- **محرك حسابات مشاركة المريض (Co-pay Engine) - [PASS]**:
  - تُحسب نسبة تحمل المريض (Co-pay) والحد الأقصى للتغطية (Max Limit) وحدود الدفع الإضافية (Overage) في الخادم عبر دالة `computePatientShare` في [e11_insurance_engine.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/e11_insurance_engine.js).
  - في حال وجود أي خطأ أو نقص في بيانات بوليصة التأمين أو مبلغ العلاج، يُرجع المحرك فوراً الحالة `Incomplete` ويرفض إرجاع مبالغ صفرية خاطئة (Fail-Closed).
- **آلة الحالات لدورة حياة المطالبات (Claims State Machine) - [PASS]**:
  - يتم تقييد تحولات المطالبات الطبية (مثال: `draft -> submitted -> adjudicated`) بآلة حالات حتمية عبر دالة `canTransitionClaim` في [e11_insurance_engine.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/e11_insurance_engine.js) وتُرفض التحولات غير القانونية بالكامل.
- **حارس الربط الخارجي لـ NPHIES - [PASS]**:
  - مسارات الأهلية (`/api/nphies/eligibility`) والتفويض المسبق والمطالبات معزولة ومحمية بحارس `NPHIES_ENABLED` الفعال بالبيئة، وتمنع النشر غير المرخص أو الربط دون إعداد مفاتيح الاتصال.

---

## 3. حماية خصوصية البيانات والأمن السيبراني (PDPL & NCA Compliance)

تم تقييم التزام النظام بقواعد حماية البيانات الشخصية والخصوصية ومخرجات بوابات الأمان:

### 3.1 مطابقة المتطلبات الإلزامية
- **حظر تسريب السجلات الصحية (No PHI Leakage) - [PASS]**:
  - تم التحقق من أن سجلات التدقيق العام (`logAudit`) وسجلات النظام (Console Logs) لا تقوم مطلقاً بطباعة معلومات المرضى الصحية أو أرقام هوياتهم أو تفاصيل علاجاتهم.
- **فصل بيانات المصادقة الثنائية (MFA Table Isolation) - [PASS]**:
  - تم التحقق من أن بيانات MFA وأكواد الاستعادة الاحتياطية تُخزن وتُعالج في جداول منفصلة ومستقلة (`user_mfa` و `user_mfa_recovery_codes`)، ويتم تشفير أكواد الاستعادة احتياطياً بخوارزمية Bcrypt الآمنة.
- **عزل المستأجرين المطلق (SaaS Tenant Isolation) - [PASS]**:
  - يتم فرض قيود عزل المستأجرين على مستوى الجلسات وخوادم قاعدة البيانات عبر تفعيل RLS الفعال.
  - جميع مسارات واجهة برمجة التطبيقات لـ ZATCA و NPHIES محمية بحارس التحقق من نطاق المستأجر `requireTenantScope` ولا تسمح بتداخل البيانات بين منشأتين طبيتين (IDOR Prevention).

---

## 4. أدلة ونتائج التحقق الفني (Audit Evidence)

| نوع التحقق | الأداة والملف | النتيجة |
| --- | --- | --- |
| اختبارات محرك الفوترة والضريبة | `node e10_finance_engine_test.js` | **31/31 PASSED** |
| اختبارات محرك التأمين الصحي | `node e11_insurance_engine_unit_test.js` | **30/30 PASSED** |
| اختبارات عزل المستأجرين المالي | `node cross_tenant_e10_finance_test.js` | **36/36 PASSED** |
| اختبارات عزل التأمين الصحي | `node cross_tenant_e11_insurance_test.js` | **37/37 PASSED** |
| اختبارات النظام الكاملة (86 ملفاً) | `run_all_tests.js` | **86/86 PASSED (100% success)** |

---

## 5. قرار وملاحظات الإغلاق للمرحلة الأولى

> [!NOTE]
> **قرار المدقق: PHASE-01_SUCCESS (PASS)**  
> إن موديولات الامتثال الوطني لجمانا الطبي متوافقة كلياً وبشكل صارم مع بنود الدستور الهندسي. تم التحقق من تفعيل كافة سياسات العزل وحماة الأمن ومحركات الرياضيات ولا توجد فجوات تستدعي المعالجة.
