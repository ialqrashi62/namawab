# مطابقة الاستجابات الوهمية لعقود البيانات (Contract-Backed Mock Responses)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** النموذج الأولي للواجهات البرمجية المحلية التجريبية (PHASE_LOCAL_MOCK_API_RUNTIME_PROTOTYPE_NO_STAGING_NO_PRODUCTION)
* **الهدف:** توثيق كيفية مطابقة بيانات المحاكاة المحلية مع عقود البيانات (DTOs) المعرفة في ملف [enterprise-contracts.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/public/js/enterprise-contracts.js).

---

## 1. جدول مطابقة الموارد مع كائنات DTO (Resource-to-DTO Mapping)

تم تصميم وربط كل مورد من موارد المحاكاة الـ 10 بكائن DTO المقابل له لضمان سلامة الهيكل البرمجي:

| المورد (Resource) | اسم كائن العقد (DTO Name) | الخصائص التي يتم التحقق منها (Verified Fields) |
| :--- | :--- | :--- |
| **facilities** | `FacilityDTO` | `id`, `name_en`, `name_ar`, `type` |
| **departments** | `DepartmentDTO` | `id`, `name_en`, `name_ar`, `facilityType` |
| **appointments** | `AppointmentDTO` | `id`, `type`, `preferredDate` |
| **queue** | `QueueItemDTO` | `queueNo`, `type`, `status`, `priority`, `waitTimeMin`, `deptPage` |
| **encounters** | `EncounterDTO` | `id`, `patientId`, `encounterTypeId` |
| **clinical-orders**| `ClinicalOrderDTO` | `id`, `type`, `itemCode`, `status` |
| **clinical-results**| `ClinicalResultDTO` | `id`, `code`, `value`, `abnormal` |
| **clinical-pharmacy**| `PharmacyReviewDTO` | `id`, `medicationCode`, `status` |
| **clinical-billing**| `BillingPreviewDTO` | `encounterId`, `totalAmount`, `copayPercent` |
| **audit-events** | `AuditPreviewDTO` | `timestamp`, `role`, `action`, `status` |

---

## 2. آلية التحقق أثناء التشغيل (Runtime Validation Mechanism)

يتم تشغيل فحص المطابقة تلقائياً عند طلب أي مورد عبر محرك المحاكاة:

1. يتم تحديد اسم الـ DTO المناسب للمورد المطلوب عبر مصفوفة المطابقة.
2. يتم استدعاء دالة التحقق المركزية:
   `window.validateDtoShapePreview(dtoName, dataItem)`
3. تقوم الدالة بمطابقة وجود كافة الحقول المطلوبة ونوع البيانات الخاص بها.
4. في حال وجود أي نقص أو اختلاف في هيكل البيانات، يتم حجب الاستجابة فوراً وإرجاع حالة خطأ تمنع عرض البيانات:
   ```json
   {
     "status": "CONTRACT_VIOLATION",
     "reason": "DTO_SHAPE_MISMATCH",
     "message": "Mock data item in [Resource] does not match the contract DTO: [DTOName]"
   }
   ```

---

## 3. نتائج فحص المطابقة (Validation Results)

* **حالة فحص الموارد الـ 10:** **ناجح بنسبة 100%** ✅.
* تم التحقق برمجياً عبر ملف الاختبار المخصص من أن كافة كائنات البيانات المخزنة في `MOCK_DATA_STORE` متطابقة تماماً مع عقود البيانات الحالية ولا تحتوي على أي حقول إضافية أو ناقصة قد تسبب خللاً عند الانتقال للتشغيل الحقيقي لاحقاً.
