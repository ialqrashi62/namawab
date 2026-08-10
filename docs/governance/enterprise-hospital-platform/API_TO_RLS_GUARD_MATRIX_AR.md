# مصفوفة ربط المنافذ البرمجية بسياسات أمان RLS

تربط هذه المصفوفة كل منفذ برمجية مخطط بنطاق التحقق وسياسات الـ RLS المقابلة له بالواجهة الخلفية.

## جدول ربط المنافذ (API-to-RLS Matrix)
| المنفذ البرمجي | الدور المطلوب | سياسة الـ RLS المطبقة | مستوى التعرض للبيانات PHI | حالة الكتابة |
| :--- | :--- | :--- | :---: | :---: |
| `/api/v1/facilities` | جميع الأدوار | `facility_view_policy` | منخفض | معطل |
| `/api/v1/queue` | طبيب / ممرض | `queue_department_policy` | متوسط | معطل |
| `/api/v1/clinical-orders` | طبيب / صيدلي | `orders_encounter_policy` | مرتفع | معطل |
| `/api/v1/clinical-billing` | موظف فوترة | `billing_tenant_policy` | مرتفع | معطل |