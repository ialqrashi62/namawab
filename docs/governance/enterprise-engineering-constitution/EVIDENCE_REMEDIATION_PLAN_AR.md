# خطة معالجة وسد فجوات الأدلة (Evidence Remediation Plan)

| رمز الوثيقة | EEC-EVIDENCE-REMEDIATION-PLAN |
|---|---|
| المرحلة | خطة معالجة وسد فجوات الأدلة لمصفوفة التغطية |
| تاريخ التحديث | 2026-06-27 |
| المشروع | NamaMedical / الطبيب |
| المُنفّذ | مراجع جودة الحوكمة والأمن السيبراني (Senior Governance Auditor) |
| الحالة النهائية | **PLAN_CREATED (تم إنشاء خطة المعالجة بنجاح)** |

---

## 1. الملخص التنفيذي (Executive Summary)
بناءً على نتائج تقرير تدقيق مصفوفة تغطية المبادرات المعدّل، تم رصد فجوات الأدلة لمبادرات مشروع **NamaMedical / الطبيب**. تهدف هذه الخطة إلى تحويل الفجوات التشغيلية إلى خطوات عملية مرتبة حسب الأولوية والمخاطر، دون تنفيذ أي تغييرات برمجية أو إنتاجية في هذه المرحلة.

---

## 2. سبب الخطة (Reason for the Plan)
لضمان أمان النظام وحماية خصوصية المرضى وعزل المستأجرين (Multi-Tenancy)، يمنع الدستور الهندسي إغلاق أي مبادرة برمجية دون توثيق كامل للـ Code/Test/Production Proof. تعطي هذه الوثيقة خريطة طريق آمنة ومدروسة لسد الفجوات عبر موجات تنفيذية محكومة.

---

## 3. جدول فجوات الأدلة ورصد المخاطر (Evidence Gaps & Risk Matrix)

| Priority | Item ID | النوع | الاسم | الحالة الحالية | الأدلة الناقصة | مستوى الخطورة | طريقة الإثبات الآمنة | مسموح الآن؟ | موافقة المالك؟ | البوابة المقترحة |
|---|---|---|---|---|---|---|---|---|---|---|
| **1** | **Epic 01** | Epic | محطة الطبيب والسجل الطبي (EMR) | `CLOSED_CONDITIONAL` | browser/auth smoke | مرتفع | Owner-authenticated browser smoke | نعم (كقرارات) | لا (للمتصفح) | Gate_EMR_Smoke |
| **2** | **E-X** | Epic | الأساسيات وعزل المستأجرين | `CLOSED_CONDITIONAL` | browser/auth smoke | مرتفع | Local test & browser smoke | نعم | لا | Gate_Security_Smoke |
| **3** | **Epic 10** | Epic | الفوترة الإلكترونية ZATCA Phase 2 | `CLOSED_CONDITIONAL` | ZATCA/accounting/browser | مرتفع | Sandbox validation & accounting proof | نعم | نعم | Gate_ZATCA_UBL |
| **4** | **Epic 11** | Epic | التأمين الصحي NPHIES | `CLOSED_CONDITIONAL` | integration/test proof | مرتفع | Sandbox validation (Synthetic data) | نعم | نعم | Gate_NPHIES_Sandbox |
| **5** | **Batch B** | Batch | الخدمات الطبية السريرية | `COMPLETED_REPORTED_BUT_NOT_REVALIDATED` | test/browser proof | متوسط | Read-only commands & unit tests | نعم | لا | Gate_Clinical_Tests |
| **6** | **Batch D** | Batch | المالية والموارد البشرية والجودة | `COMPLETED_REPORTED_BUT_NOT_REVALIDATED` | test/accounting proof | متوسط | Read-only accounting & audit check | نعم | نعم | Gate_Finance_Checks |
| **7** | **E2 - E9** | Epic | مبادرات P0 الطبية المتبقية | `NOT_STARTED` | code/test/prod proof | متوسط | Step-by-step dev worktrees & tests | لا | نعم | Gate_P0_Phases |
| **8** | **Batch C, E** | Batch | التوريد والحوكمة السيبرانية | `COMPLETED_REPORTED_BUT_NOT_REVALIDATED` | test/browser proof | منخفض | Read-only config check | نعم | لا | Gate_Config_Verify |

---

## 4. موجات التنفيذ المقترحة (Proposed Execution Waves)

### Wave 1: أدلة القراءة فقط (Read-only Evidence Only)
- **النطاق**: مراجعة الفهارس، مطابقة الـ Git Commits، فحص حالة PM2 وسجلات النظام.
- **الحالة**: مسموح بها بالكامل ولا تتطلب موافقة خاصة لعدم تأثيرها على النظام.

### Wave 2: الاختبارات المحلية والافتراضية (Local & Synthetic Tests)
- **النطاق**: تشغيل اختبارات الوحدة محلياً، واختبارات منع تسريب البيانات باستخدام بيانات وهمية (Synthetic Data) دون لمس الإنتاج.
- **الحالة**: مسموح بها في بيئة التطوير.

### Wave 3: اختبار المتصفح الموثق للمالك (Owner-Authenticated Browser Smoke)
- **النطاق**: تشغيل سيناريوهات Playwright لواجهات الاستقبال والمواعيد ومحطة الطبيب للتأكد من خلوها من الأخطاء.
- **الحالة**: تتطلب تهيئة حسابات فحص آمنة.

### Wave 4: أدلة الربط في بيئة التجربة (Staging Integration Evidence)
- **النطاق**: التحقق من فك تشفير استجابات ZATCA Sandbox و NPHIES Sandbox ومطابقة مواصفات FHIR.
- **الحالة**: تتطلب تفعيل البيئة التجريبية وعزلها.

### Wave 5: أدلة الإنتاج المحكومة بموافقة صريحة (Production-Controlled Evidence)
- **النطاق**: أي تشغيل أو ربط حقيقي أو ترحيل قيود مالية على خادم الإنتاج الفعلي.
- **الحالة**: **ممنوع منعاً باتاً** إلا بعد استلام موافقة صريحة ومكتوبة من المالك (`REQUIRES_EXPLICIT_OWNER_APPROVAL`).

---

## 5. ضوابط الأمان والموافقات (Safety Guards & Approvals)

### 5.1 العناصر التي يمكن إغلاقها بـ Read-only
- مطابقة انحراف الأكواد (Drift Verification) لجميع المكونات.
- فحوصات الترميز (Mojibake Audit) وامتثال ترميز UTF-8 للمستندات والتقارير.

### 5.2 العناصر التي تتطلب موافقة المالك الصريحة
- ترحيل اليوميات والقيود المحاسبية لـ Batch D.
- إرسال طلبات الربط الخارجية للبوابة الفعلية لـ ZATCA و NPHIES.
- أي تنفيذ لملفات DDL أوmigrations جديدة على قاعدة بيانات الإنتاج.

### 5.3 العناصر الممنوع تنفيذها حالياً
- أي تعديل مباشر في منطق عزل المستأجرين على الإنتاج دون المرور بـ Worktree معزول واختبارات نجاح 100%.

---

## 6. التوصية للمرحلة التالية (Next Recommendation)
نوصي بالبدء الفوري في **أول بوابة تنفيذ آمنة**:
- **البوابة المستهدفة**: `Gate_EMR_Smoke` و `Gate_Clinical_Tests` لتشغيل اختبارات التحقق من عزل مسارات محطة الطبيب السريرية وتوثيق أدلتها محلياً وعلى بيئة Staging كخطوة تمهيدية آمنة.
