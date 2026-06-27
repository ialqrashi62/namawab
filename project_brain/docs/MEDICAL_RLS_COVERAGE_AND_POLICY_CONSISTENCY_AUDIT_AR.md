# تقرير تدقيق تغطية وسياسات RLS ومطابقتها (RLS Coverage and Policy Consistency Audit)
## نظام نما الطبي (NamaMedical)

توثيق نتائج التدقيق الهيكلي لقواعد عزل المستأجرين (RLS) والتأكد من مطابقتها للمعايير الأمنية المعتمدة.

---

### 1. ملخص حالة التغطية لقواعد RLS (RLS Coverage Summary)

تم فحص كامل جداول قاعدة البيانات البالغ عددها 141 جدولاً على بيئة Staging، وجاءت النتيجة كالتالي:

* **الجداول المفعلة بـ RLS**: إجمالي **13 جدولاً** مفعلة بالكامل ومحمية بنجاح.
* **الجداول المعطلة (أو المؤجلة)**: بقية الجداول، وتشمل الجداول العامة أو التي لا تحتوي على `tenant_id` أو الجداول المؤجلة لتقليص حجم الدفعات.
* **القرار التنظيمي**: لم يتبين تفعيل RLS على أي جدول مشترك أو كتالوج بالخطأ، مما يحافظ على تكامل البيانات العامة.

---

### 2. مصفوفة تطابق سياسات العزل (Policy Consistency Matrix)

تم تدقيق مسميات وهياكل السياسات المطبقة للتأكد من تماثلها الكامل مع النمط القياسي المعتمد:

| اسم الجدول المفعل | اسم السياسة المطبقة | نوع الصلاحية | الحالة |
| :--- | :--- | :---: | :---: |
| `patients` | `rls_patients_tenant_isolation` | ALL | **PASS** |
| `appointments` | `rls_appointments_tenant_isolation` | ALL | **PASS** |
| `invoices` | `rls_invoices_tenant_isolation` | ALL | **PASS** |
| `prescriptions` | `rls_prescriptions_tenant_isolation` | ALL | **PASS** |
| `lab_radiology_orders` | `rls_lab_radiology_orders_tenant_isolation` | ALL | **PASS** |
| `emergency_visits` | `rls_emergency_visits_tenant_isolation` | ALL | **PASS** |
| `nursing_vitals` | `rls_nursing_vitals_tenant_isolation` | ALL | **PASS** |
| `lab_results` | `rls_lab_results_tenant_isolation` | ALL | **PASS** |
| `insurance_claims` | `rls_insurance_claims_tenant_isolation` | ALL | **PASS** |
| `pharmacy_prescriptions_queue` | `rls_pharmacy_prescriptions_queue_tenant_isolation` | ALL | **PASS** |
| `emergency_beds` | `rls_emergency_beds_tenant_isolation` | ALL | **PASS** |
| `pharmacy_sales` | `rls_pharmacy_sales_tenant_isolation` | ALL | **PASS** |
| `pharmacy_sale_items` | `rls_pharmacy_sale_items_tenant_isolation` | ALL | **PASS** |

---

### 3. تدقيق صلاحيات أدوار الاختبار (Test Role Permissions Audit)

* **دور الاختبار (`test_rls_user`)**: يمتلك صلاحيات `SELECT`, `INSERT`, `UPDATE`, `DELETE` فقط على الجداول المفعلة ولا يتمتع بأي صلاحيات إدارية (Superuser) أو صلاحيات تعديل البنية (DDL)، مما يعزز مبدأ الصلاحيات الأقل تفضيلاً (Least Privilege).
