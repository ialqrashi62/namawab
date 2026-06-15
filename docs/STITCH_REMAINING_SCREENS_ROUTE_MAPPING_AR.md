# جرد وتنسيق شاشات Stitch مع مسارات تطبيق نما الطبي
(Stitch Screen Inventory & Route Mapping)

يوثق هذا التقرير جرد وتصنيف شاشات Stitch الـ 90 ومطابقتها مع مسارات ونوافذ تطبيق ويب **نما الطبي (Nama Medical)** لضمان تطبيق الأنماط تدريجياً وبأمان.

---

## 1. تصنيف ومطابقة الشاشات الأساسية (Module Route Mapping)

| مجلد شاشة Stitch | تصنيف الحالة | المسار المطابق في نما الطبي | الملاحظات الفنية |
| :--- | :--- | :--- | :--- |
| `saudihealth_premium_landing_page_rtl` | `ALREADY_IMPLEMENTED` | `/login.html` (Landing & Portal Access) | تم التطبيق والتقسية بنجاح. |
| `saudihealth_premium_hospital_operations_dashboard_rtl` | `ALREADY_IMPLEMENTED` | `/` -> لوحة التحكم (الرئيسية) | تم التطبيق والتقسية بنجاح. |
| `saudihealth_premium_patient_digital_portal_rtl` | `MAP_TO_EXISTING_ROUTE` | البند 33: بوابة المرضى (Patient Portal) | سيتم تطبيق الأنماط في Batch A. |
| `saudihealth_premium_laboratory_information_system_rtl` | `MAP_TO_EXISTING_ROUTE` | البند 4: المختبر (Laboratory) | سيتم تطبيق الأنماط في Batch B. |
| `saudihealth_premium_medical_imaging_radiology_rtl` | `MAP_TO_EXISTING_ROUTE` | البند 5: الأشعة (Radiology) | سيتم تطبيق الأنماط في Batch B. |
| `saudihealth_premium_central_pharmacy_management_rtl` | `MAP_TO_EXISTING_ROUTE` | البند 6: الصيدلية (Pharmacy) | سيتم تطبيق الأنماط في Batch B. |
| `saudihealth_premium_supply_chain_inventory_rtl` | `MAP_TO_EXISTING_ROUTE` | البند 10: المخازن (Inventory) | سيتم تطبيق الأنماط في Batch C. |
| `saudihealth_premium_supplier_invoices_payments_registry_rtl`| `MAP_TO_EXISTING_ROUTE` | البند 10/16: الموردين والمشتريات | سيتم تطبيق الأنماط في Batch C. |
| `saudihealth_premium_financial_performance_rtl` | `MAP_TO_EXISTING_ROUTE` | البند 8: المالية (Finance) | سيتم تطبيق الأنماط في Batch D. |
| `saudihealth_premium_human_resources_payroll_command_rtl`| `MAP_TO_EXISTING_ROUTE` | البند 7: الموارد البشرية (HR) | سيتم تطبيق الأنماط في Batch D. |
| `saudihealth_premium_compliance_audit_center_rtl` | `MAP_TO_EXISTING_ROUTE` | البند 27: الجودة والامتثال (Quality) | سيتم تطبيق الأنماط في Batch D. |
| `saudihealth_premium_cybersecurity_governance_rtl` | `NEW_FRONTEND_ONLY_PAGE` | بند إعدادات الأمن والسيبرانية | سيتم تطبيق الأنماط في Batch E. |
| `saudihealth_premium_ai_predictive_maintenance_rtl` | `MAP_TO_EXISTING_ROUTE` | البند 28: الصيانة (Maintenance) | سيتم تطبيق الأنماط في Batch E. |
| `saudihealth_premium_strategic_executive_command_center_rtl`| `ALREADY_IMPLEMENTED` | شاشات لوحة القيادة التنفيذية | مدمج جزئياً في لوحة التحكم. |
| `saudihealth_premium_surgical_suite_command_center_rtl` | `NEEDS_BACKEND_LATER` | البند 18: العمليات | سيتم تطبيق الأنماط في Batch E. |
| `saudihealth_premium_blood_bank_transfusion_center_rtl` | `NEEDS_BACKEND_LATER` | البند 19: بنك الدم | سيتم تطبيق الأنماط لاحقاً. |
| `saudihealth_premium_emergency_tracking_registry_rtl` | `NEEDS_BACKEND_LATER` | البند 21: الطوارئ | سيتم تطبيق الأنماط لاحقاً. |
| `saudihealth_premium_icu_resource_allocation_rtl` | `NEEDS_BACKEND_LATER` | البند 23: العناية المركزة | سيتم تطبيق الأنماط لاحقاً. |
| `saudihealth_premium_central_sterile_supply_center_rtl` | `NEEDS_BACKEND_LATER` | البند 24: التعقيم المركزي | سيتم تطبيق الأنماط لاحقاً. |
| `saudihealth_premium_medical_nutrition_food_services_rtl`| `NEEDS_BACKEND_LATER` | البند 25: التغذية | سيتم تطبيق الأنماط لاحقاً. |
| `saudihealth_premium_physical_rehabilitation_command_center_rtl`| `NEEDS_BACKEND_LATER` | البند 32: إعادة التأهيل | سيتم تطبيق الأنماط لاحقاً. |
| `saudihealth_premium_forensic_medicine_morgue_control_rtl`| `NEEDS_BACKEND_LATER` | البند 38: خدمة الوفيات | سيتم تطبيق الأنماط لاحقاً. |
| `saudihealth_premium_medical_education_training_rtl` | `NEEDS_BACKEND_LATER` | البند 39: التعليم الطبي | سيتم تطبيق الأنماط لاحقاً. |
| `saudihealth_premium_maternal_child_health_center_rtl` | `MAP_TO_EXISTING_ROUTE` | البند 41: النساء والتوليد (OB/GYN) | سيتم تطبيق الأنماط لاحقاً. |

---

## 2. الشاشات المكررة والمنخفضة الأولوية (Duplicate & Low Priority)
تُصنف بقية الشاشات الـ 90 (مثل شاشات محاكاة الفشل الروبوتي، التخطيط الاستثماري، الإحالات الطبية الأولية) كـ **`DUPLICATE_OR_LOW_PRIORITY`** أو **`DO_NOT_USE`** لعدم مطابقتها المباشرة للمتطلبات الوظيفية الحالية لنظام نما الطبي، وسيتم تأجيلها لضمان التركيز الكامل على النواة الطبية والمالية للبرنامج.
