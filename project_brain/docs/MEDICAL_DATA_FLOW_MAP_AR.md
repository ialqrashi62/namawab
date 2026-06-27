# خريطة تدفّق البيانات (Data Flow Map)

> التاريخ: 2026-06-20 | الأدلة: `server.js` handlers، `db_postgres.js`. مرجع: `GLOBAL_AUDIT_05`.
> رموز: ✅ موجود/مُنفَّذ، ⚠️ جزئي، ❌ مفقود. Tenant Context بعد إصلاح P0 = ✅ (app.tenant_id يُضبط لكل طلب). Facility Entitlement = ❌ (غير مُنفَّذ backend) لكل التدفقات.

| # | Flow | Trigger | UI | API | Auth/RBAC | Tenant Ctx | Facility Ent. | DB Tables | Side Effects | Acct Impact | Inv Impact | Audit | Failure Cases | Tests |
| - | ---- | ------- | -- | --- | --------- | ---------- | ------------- | --------- | ------------ | ----------- | ---------- | ----- | ------------- | ----- |
| 1 | تسجيل مستأجر بنوع منشأة | admin | ⚠️ | ❌ لا provisioning API | admin | n/a | ❌ | tenants/facilities | — | — | — | ⚠️ | لا onboarding | ❌ |
| 2 | تفعيل استحقاق موديول | admin | ⚠️ (settings facility_type) | ❌ | admin | n/a | ❌ backend | tenant_settings | إخفاء قائمة فقط | — | — | ❌ | تجاوز API | ❌ |
| 3 | إنشاء مستخدم + دور | admin | ✅ | ✅ /api/settings/users | role(settings) | ⚠️ | ❌ | system_users/user_tenants | — | — | — | ✅ login | ⚠️ |
| 4 | تسجيل مريض | reception | ✅ | ✅ POST /api/patients | role(patients) | ✅ | ❌ | patients | MRN | — | — | ✅ CREATE_PATIENT | ✅ leak_test |
| 5 | حجز موعد | reception | ✅ | ✅ /api/appointments | role | ✅ | ❌ | appointments | conflict check | — | — | ✅ | ✅ |
| 6 | فتح زيارة/encounter | reception/doctor | ✅ | ✅ /api/visits/lifecycle | auth | ✅ | ❌ | visits | — | — | — | ⚠️ | ⚠️ حالات | ⚠️ |
| 7 | استشارة الطبيب | doctor | ✅ | ✅ /api/medical/records | role(doctor) | ✅ | ❌ | medical_records | — | — | — | ⚠️ | — | ⚠️ |
| 8 | وصفة دواء | doctor | ✅ | ✅ /api/pharmacy/prescriptions | role | ✅ | ❌ | prescriptions/pharmacy_* | **لا خصم مخزون** | — | لا (صحيح) | ⚠️ | — | ✅ pharmacy |
| 9 | صرف الصيدلية | pharmacist | ✅ | ✅ /api/pharmacy/deduct-stock | role | ✅ | ❌ | pharmacy_* | خصم مخزون | — | ⚠️ FEFO غير مؤكّد | ⚠️ | منع منتهٍ ❌ | ✅ |
| 10 | طلب مختبر | doctor | ✅ | ✅ /api/lab/orders | auth | ✅ (FORCE RLS) | ❌ | lab_radiology_orders | — | — | — | ⚠️ | — | ✅ |
| 11 | اعتماد نتيجة مختبر | lab tech | ✅ | ⚠️ /api/lab/orders PUT | auth | ✅ | ❌ | lab_results | نتيجة نهائية | — | — | ⚠️ | اعتماد غير مفصول | ⚠️ |
| 12 | طلب أشعة | doctor | ✅ | ✅ /api/radiology/orders | auth | ✅ | ❌ | lab_radiology_orders | رفع صورة | — | — | ⚠️ | — | ✅ |
| 13 | اعتماد تقرير أشعة | radiologist | ✅ | ⚠️ PUT | auth | ✅ | ❌ | radiology | تقرير نهائي | — | — | ⚠️ | اعتماد غير مفصول | ⚠️ |
| 14 | فاتورة مريض | cashier | ✅ | ✅ /api/invoices | role(invoices) | ✅ (FORCE RLS) | ❌ | invoices | — | ⚠️ ترحيل يدوي | — | ✅ CREATE_INVOICE | ✅ |
| 15 | موافقة/مطالبة تأمين | insurance | ✅ | ⚠️ /api/insurance/claims | role | ✅ | ❌ | insurance_claims | — | ⚠️ | — | ⚠️ | لا EDI/رفض | ⚠️ |
| 16 | إيصال دفع | cashier | ✅ | ✅ /api/invoices/:id/pay | role | ✅ | ❌ | invoices | — | ⚠️ | — | ✅ | — | ✅ |
| 17 | استرداد/إشعار دائن | cashier | ✅ | ✅ /api/invoices/:id/refund,cancel | role | ✅ | ❌ | invoices | — | ⚠️ عكس غير مضبوط | — | ✅ | تعديل صامت | ⚠️ |
| 18 | طلب شراء | store | ⚠️ | ⚠️ /api/dept-requests | auth | ✅ | ❌ | inventory_dept_requests | — | — | — | ⚠️ | — | ✅ |
| 19 | أمر شراء (PO) | procurement | ⚠️ | ⚠️ جزئي | auth | ⚠️ | ❌ | inventory_purchases | — | ⚠️ | استلام | ⚠️ | لا 3-way | ❌ |
| 20 | استلام بضاعة (GRN) | store | ⚠️ | ⚠️ | auth | ⚠️ | ❌ | inventory_purchase_items | زيادة مخزون | — | ✅ | ⚠️ | — | ❌ |
| 21 | فاتورة مورّد | accounts | ⚠️ | ⚠️ | role(finance) | ✅ | ❌ | finance_* | — | ⚠️ AP يدوي | — | ⚠️ | — | ❌ |
| 22 | استهلاك مخزون | clinical | ✅ | ✅ /api/inventory/issue | auth | ✅ | ❌ | inventory_issue_* | خصم | — | ✅ متتبّع | ⚠️ | — | ✅ inventory |
| 23 | تحويل مخزون | store | ⚠️ | ⚠️ | auth | ✅ | ❌ | inventory_* | نقل | — | ✅ | ⚠️ | — | ⚠️ |
| 24 | الترحيل المحاسبي | system | ⚠️ | ⚠️ /api/finance/journal | role(finance) | ✅ | ❌ | finance_journal_* | — | ❌ **آلي مفقود** | — | ⚠️ | لا posting engine | ❌ |
| 25 | تحليلات لوحة التحكم | any | ✅ | ✅ /api/dashboard/* | requireTenantScope | ✅ | ❌ | متعدد | — | — | — | — | — | ✅ dashboard |
| 26 | سجل التدقيق | system | n/a | logAudit | auth | ⚠️ | ❌ | audit_trail | — | — | — | ⚠️ old_values نادر | — | ⚠️ |

## ملاحظات حرجة على التدفّقات
- **Tenant Context ✅ بعد P0**: كل تدفّق يمرّ عبر `/api/*` يضبط `app.tenant_id` تلقائياً (بعد نشر إصلاح الربط)، فالجداول المحمية بـ FORCE RLS تُقرأ صحيحاً وتُعزل.
- **Facility Entitlement ❌ في كل التدفّقات**: لا إنفاذ backend (انظر تقرير 4).
- **أضعف التدفّقات**: المشتريات/فاتورة المورّد/GRN (18-21)، الترحيل المحاسبي الآلي (24)، دورة التأمين (15)، اعتماد المختبر/الأشعة (11/13)، FEFO الصيدلية (9)، وonboarding المستأجر (1-2).

`DATA_FLOW_MAP_COMPLETE`
