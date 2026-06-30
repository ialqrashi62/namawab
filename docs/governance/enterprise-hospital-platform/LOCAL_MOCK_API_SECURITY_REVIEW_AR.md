# تقرير المراجعة الأمنية للواجهات المحلية التجريبية (Local Mock API Security Review)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** النموذج الأولي للواجهات البرمجية المحلية التجريبية (PHASE_LOCAL_MOCK_API_RUNTIME_PROTOTYPE_NO_STAGING_NO_PRODUCTION)
* **الحالة:** تم الفحص الأمني والمصادقة على خلو النموذج من أي مخاطر (Approved - Zero Risk)

---

## 1. تحليل ضوابط الأمان الفعالة (Active Security Controls)

تم إدراج مجموعة من الحواجز الأمنية الصارمة داخل الملف [mock-api-runtime.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/public/js/mock-api-runtime.js) لضمان عزل النموذج الأولي بالكامل:

### أ. أعلام التحكم بالبيئة (Environment Control Flags)
* تم ضبط الأعلام التالية بشكل ثابت وقاطع في الذاكرة:
  * `mockApiRuntimeEnabled = true` (تفعيل وضع المحاكاة المحلية).
  * `liveApiRuntimeEnabled = false` (تعطيل أي تشغيل للواجهات الحقيقية).
  * `writeRuntimeEnabled = false` (تعطيل أي عمليات كتابة).
* تظل الأعلام المركزية في الملف [enterprise-contracts.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/public/js/enterprise-contracts.js) مغلقة:
  * `isLiveEndpointEnabled() = false`
  * `isWriteOperationEnabled() = false`

### ب. حظر عمليات الكتابة والعمليات النهائية (Blocking Write Operations)
* تم تصميم الدالة `assertNoWriteOperation(action)` لفحص نوع العملية.
* في حال محاولة تنفيذ أي عملية من نوع `POST`, `PUT`, `DELETE`, `PATCH` أو أي عملية نهائية مثل `FINAL_SIGNATURE` أو `FINAL_DISPENSE` أو `SUBMIT_CLAIM`؛ يقوم النظام فوراً بقطع التنفيذ وإرجاع الاستجابة التالية:
  ```json
  {
    "status": "BLOCKED",
    "reason": "WRITE_OPERATION_DISABLED",
    "message": "WRITE_OPERATION_DISABLED: Cannot perform write/final actions in local mock runtime."
  }
  ```

---

## 2. منع تسريب البيانات والاتصالات الخارجية (Data Leakage & Network Prevention)

يتضمن التصميم حماية ثلاثية ضد الاتصالات الخارجية وتسريب البيانات:

1. **حظر الشبكة (Zero Network Footprint):**
   * لا يحتوي الملف [mock-api-runtime.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/public/js/mock-api-runtime.js) أو [local-api-preview-ui.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/public/js/local-api-preview-ui.js) على أي استخدام لـ `fetch` أو `XMLHttpRequest`.
   * يتم استرجاع ومعالجة كافة البيانات محلياً بالكامل في الذاكرة (In-Memory Processing).
2. **منع استخدام عناوين الإنتاج أو الاختبار (No External URLs):**
   * تقوم الدالة `assertNoLiveEndpoint(endpoint)` بفحص العنوان المطلوب. إذا تبين أنه يشير إلى أي نطاق خارجي (خلاف `localhost` أو `127.0.0.1`)، يتم إيقاف الطلب فوراً واعتباره خرقاً أمنياً (`SECURITY_VIOLATION`).
3. **حماية المعلومات الصحية المحمية (Zero PHI Policy):**
   * البيانات المدرجة في نموذج المحاكاة هي بيانات مصطنعة ووهمية 100% (Synthetic Data).
   * تقوم الدالة `assertNoPhiPayload(payload)` بفحص محتوى أي طلب مدخل. إذا احتوى الطلب على كلمات مفتاحية مثل `ssn`, `nationalid`, `phone`, أو `creditcard`؛ يتم رفض الطلب فوراً لمنع أي محاولة لإدخال بيانات حقيقية للمرضى.

---

## 3. الامتثال للأنظمة والتشريعات السعودية (Saudi Regulatory Compliance)

* **الامتثال لنظام حماية البيانات الشخصية (PDPL):**
  * نظراً لأن النظام يعمل محلياً بالكامل في المتصفح ويستخدم بيانات وهمية، فإنه لا يقوم بجمع أو معالجة أو نقل أي بيانات شخصية أو صحية للمرضى خارج الحدود الجغرافية للمملكة أو حتى خارج جهاز الفاحص.
* **الامتثال لمتطلبات ديوان الرقابة والتدقيق (CBAHI):**
  * يتم إنشاء سجل تدقيق وهمي لكل حركة استعلام للقراءة عبر الدالة `getMockAuditPreview` وعرضها في لوحة المعاينة، مما يثبت قدرة النظام المستقبلية على تسجيل الحركات دون الحاجة للكتابة الفعلية في جداول الإنتاج حالياً.

---
**الخلاصة:** إن التصميم الحالي للنموذج الأولي المحلي آمن تماماً، ويعمل كبيئة معزولة ومغلقة بالكامل (Sandboxed) لا تشكل أي خطر على سرية أو سلامة بيانات منصة نما الطبية الحية.
