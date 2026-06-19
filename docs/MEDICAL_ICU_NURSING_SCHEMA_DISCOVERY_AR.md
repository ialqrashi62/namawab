# تقرير استكشاف جداول وقنوات العناية المركزة والتمريض - الدفعة الرابعة (ICU & Nursing Schema Discovery Report)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا التقرير نتائج الفحص والتحليل الهيكلي لجداول وقنوات موديولات العناية المركزة (ICU)، التمريض (Nursing)، وإعطاء الأدوية الإلكتروني (eMAR) بقاعدة بيانات Staging.

---

### 1. الجداول المكتشفة وتصنيفاتها (Discovered Tables)

تم تحديد 9 جداول رئيسية معنية بالتمريض والعناية الحرجة وتصنيفها كالتالي:

| اسم الجدول | نوع الجدول | أعمدة الربط الطبية | وجود RLS | FORCE RLS | الأعمدة الحالية للـ RLS |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `nursing_vitals` | Clinical | `patient_id` | **نعم** | **لا** | `tenant_id`, `facility_id` |
| `nursing_care_plans` | Clinical | `patient_id`, `admission_id` | **لا** | **لا** | `tenant_id`, `facility_id` |
| `nursing_assessments` | Clinical | `patient_id` | **لا** | **لا** | **مفقودة بالكامل** (تتطلب DDL لاحقاً) |
| `icu_monitoring` | Clinical | `patient_id`, `admission_id` | **لا** | **لا** | `tenant_id`, `facility_id` |
| `icu_ventilator` | Clinical | `patient_id`, `admission_id` | **لا** | **لا** | `tenant_id`, `facility_id` |
| `icu_scores` | Clinical | `patient_id`, `admission_id` | **لا** | **لا** | `tenant_id`, `facility_id` |
| `icu_fluid_balance` | Clinical | `patient_id`, `admission_id` | **لا** | **لا** | `tenant_id`, `facility_id` |
| `emar_orders` | Clinical / Workflow | `patient_id`, `admission_id` | **لا** | **لا** | `tenant_id`, `facility_id` |
| `emar_administrations` | Clinical / Workflow | `patient_id` | **لا** | **لا** | `tenant_id`, `facility_id` |

---

### 2. الفجوات الهيكلية المرصودة (Structural Gaps)

1. **جدول تقييمات التمريض (`nursing_assessments`)**:
   - **الخلل**: الجدول يفتقر تماماً لأعمدة `tenant_id` و `facility_id` / `branch_id`.
   - **التوصية**: يجب إجراء تعديل هيكلي (DDL) في مرحلة التنفيذ لاحقاً لإضافة هذه الأعمدة وضمان إمكانية تفعيل RLS.
2. **جدول العلامات الحيوية للتمريض (`nursing_vitals`)**:
   - **الخلل**: RLS مفعل ولكن خيار `FORCE ROW LEVEL SECURITY` معطل، مما يسمح لمالك الجدول (Table Owner) بتجاوز السياسة، وهو ما يتعارض مع معايير المشروع الصارمة.
   - **التوصية**: فرض `FORCE RLS` على الجدول لضمان تكامل العزل.
3. **الجداول السبعة الأخرى**:
   - RLS معطل بالكامل حالياً بالرغم من وجود أعمدة المستأجرين في هيكل الجداول.

---

### 3. تقييم المخاطر وحساسية البيانات (Security Risk Assessment)

* **نوع البيانات**: بيانات صحية سرية للغاية (PHIS) تشمل مؤشرات التنفس الميكانيكي، تقييم غيبوبة غلاسكو (GCS)، الميزان المائي للمريض، وجداول صرف الأدوية الحرجة.
* **مخاطر التسريب (Cross-Tenant Leak Risks)**:
  - **عالي جداً (P0)**: أي ثغرة IDOR في جلب العلامات الحيوية أو خطط العلاج تسمح للممرضين من منشأة طبية برؤية أو تعديل بيانات مرضى منشأة أخرى، مما يهدد سلامة المرضى والامتثال للأنظمة المحلية (نفيس/وزارة الصحة السعودية).
