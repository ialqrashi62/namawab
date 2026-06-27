# P1 إنفاذ استحقاقات المنشأة — 02 التصميم (Design)

> التاريخ: 2026-06-20

## 1. الأنواع الحالية مقابل المطلوبة
- **الحالية (3)**: hospital، health_center، clinic (واجهة فقط).
- **المطلوبة (10)**: Medical City، Large Hospital، Medium Hospital، Small Hospital، Polyclinic، Primary Healthcare Center، Specialized Medical Center، Pharmacy Only، Laboratory Only، Radiology Only.
- **التوافق**: hospital→large_hospital، health_center→primary_healthcare_center، clinic→polyclinic (aliases).

## 2. أين يُحدَّد/يُستخدم
- يُحدَّد: `company_settings.setting_key='facility_type'`.
- يُستخدم حالياً: الواجهة فقط (`app.js`).
- **يجب إنفاذه**: حارس عالمي على مستوى الـ API في `server.js` (backend).

## 3. مصفوفة الموديول × نوع المنشأة (المُنفَّذة في السجل)
> "Full" = '*' (كل الموديولات). الموديولات المشتركة (dashboard/reports/settings/messaging/forms/audit/catalog/print/consent/notifications) مسموحة للجميع دائماً.

| الموديول | Medical City | Large H | Medium H | Small H | Polyclinic | PHC | Specialized | Pharmacy | Lab | Radiology |
| -------- | :----------: | :-----: | :------: | :-----: | :--------: | :-: | :---------: | :------: | :-: | :-------: |
| patients | Full | Full | Full | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ |
| reception_appointments | Full | Full | Full | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ |
| emr | Full | Full | Full | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| nursing | Full | Full | Full | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| inpatient | Full | Full | Full | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| emergency | Full | Full | Full | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| surgery | Full | Full | Full | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ |
| icu | Full | Full | Full | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| pharmacy | Full | Full | Full | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| lab | Full | Full | Full | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ |
| pathology | Full | Full | Full | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ |
| radiology | Full | Full | Full | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| blood_bank | Full | Full | Full | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| billing | Full | Full | Full | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| insurance | Full | Full | Full | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ |
| accounting | Full | Full | Full | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| inventory | Full | Full | Full | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| hr | Full | Full | Full | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| facility_ops (maint/transport/cssd/mortuary) | Full | Full | Full | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| rehab/telemedicine/obgyn/dietary | Full | Full | Full | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| cosmetic | Full | Full | Full | ✗ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| social_work | Full | Full | Full | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| quality | Full | Full | Full | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |

## 4. مصفوفة API → موديول (خريطة المقطع الأول)
`/api/<seg>` → موديول عبر `SEGMENT_TO_MODULE`. أمثلة: lab→lab، admissions/beds/wards→inpatient، pharmacy/clinical-pharmacy/prescriptions→pharmacy، icu→icu، blood-bank→blood_bank، invoices/orders/zatca/cash-drawer→billing، finance→accounting، medical/medical-records/doctor/referrals→emr، dashboard/reports/settings/messages/...→common. (التفصيل الكامل في `facility_entitlements.js`.)

## 5. نقطة الإنفاذ
حارس عالمي `app.use(async ...)` **بعد** middleware سياق المستأجر، **قبل** static والمسارات:
1. غير `/api/` أو auth/health → تمرير.
2. moduleKey = pathToModule(req.path)؛ إن كان common → تمرير.
3. لا tenant context → تمرير (تتركه requireAuth/requireTenantScope).
4. facility_type (cache 60s) → normalize:
   - فارغ/null → افتراضي large_hospital (الكل) [توافق].
   - مضبوط غير معروف → **422**.
   - معروف → فحص isModuleEntitled → **403** إن لم يُسمح، وإلا تمرير.

رسائل الخطأ: `403 Facility type not entitled`، `422 Unknown facility type`، و401/403 لغياب السياق عبر طبقات auth القائمة.

## 6. code-only؟ DDL؟
- **code-only بالكامل** — نستخدم `company_settings` القائم. **لا DDL.**
- (تحسين مستقبلي اختياري: نقل الاستحقاقات لجداول DB FacilityType/Entitlement — يحتاج خطة DDL منفصلة، خارج هذه المرحلة.)

## 7. مخاطر التوافق مع المستأجرين الحاليين
- الإنتاج الحالي: `facility_type` غالباً غير مضبوط أو 'hospital' → الحارس يسمح بالكل (لا كسر).
- الكاش (60s) + إبطاله عند تحديث الإعدادات يمنع التأخير.
- fail-open عند خطأ قراءة غير متوقع (الحماية الأساسية auth+RLS قائمة) — مقبول لطبقة feature-gating.

`DESIGN_COMPLETE`
