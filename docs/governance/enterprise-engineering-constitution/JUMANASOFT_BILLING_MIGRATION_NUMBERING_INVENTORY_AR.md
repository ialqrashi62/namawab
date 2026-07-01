# جرد وترتيب بادئات ملفات هجرة الفوترة (Jumanasoft Billing Migration Numbering Inventory)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** مراجعة وتقوية جداول الفوترة (PHASE_BILLING_TABLES_CANDIDATE_REVIEW_AND_MIGRATION_ORDER_HARDENING)
* **البوابة:** البوابة 1.1 — جرد بادئات الهجرة (Gate 1.1 — Migration Inventory)
* **الحالة:** تم الجرد والتوثيق بنجاح (SUCCESS) ✅

---

## 1. جدول حصر وبادئات ملفات الهجرة المتعلقة بالمدفوعات والفوترة

تم إجراء مسح تفصيلي لمجلد الهجرات `namaweb/migrations/` وتحديد الملفات المرتبطة أو المتعارضة في الترقيم:

| اسم الملف (Filename) | البادئة (Prefix) | الغرض البرمجي (Purpose) | حالة الملف (Status) | مخاطر الترتيب (Ordering Risk) | ملاحظات وإيضاحات (Notes) |
| :--- | :---: | :--- | :---: | :---: | :--- |
| `e24_tenants_control_center_candidate_*` | `e24` | التحكم والتوجيه للمستأجرين. | legacy | Low | أساس إدارة المستأجرين للـ SaaS. |
| `e25_plans_pricing_candidate_*` | `e25` | تحديد الباقات والأسعار والاستحقاقات. | legacy | Low | أساس الاستحقاقات للـ SaaS. |
| `e26_payment_gateway_ref_*` | `e26` | إضافة حقل مرجع Moyasar لفواتير المرضى. | existing | **High** | ملف قائم، يتعارض مع ترقيم جداول الفوترة للـ SaaS. |
| `e26_billing_tables_candidate_*` | `e26` | إنشاء جداول الفوترة السبعة والـ RLS للـ SaaS. | candidate | **High** | قد يؤدي تشغيله آلياً مع هجرة المرضى لخلط الترتيب. |
| `e27_pharmacy_queue_columns_*` | `e27` | تعديل أعمدة قائمة انتظار الصيدلية الطبية. | existing | Low | غير مرتبطة بفوترة الـ SaaS. |
| `e28_patients_schema_reconciliation_*`| `e28` | مطابقة مخطط المرضى. | existing | Low | غير مرتبطة بفوترة الـ SaaS. |
| `e29_prescriptions_rls_reconciliation_*`| `e29` | مطابقة حماية RLS للوصفات الطبية. | existing | Low | غير مرتبطة بفوترة الـ SaaS. |

---
**الخلاصة:** تم حصر البادئات وثبت وجود خطر تعارض مرتفع (High Risk) بسبب مشاركة بادئة `e26` بين ملفين مختلفين للوظائف.
