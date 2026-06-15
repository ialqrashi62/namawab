# تقرير تدقيق قاعدة البيانات ونماذج عزل المستأجرين (Database & Tenant Isolation Audit Report)

وثيقة تدقيق تقنية شاملة لتقييم جاهزية البنية التحتية لقاعدة البيانات والشيفرة المصدرية لنظام **نما الطبي** للتحول إلى منصة سحابية متعددة المستأجرين (Multi-tenant Healthcare SaaS) متوافقة مع المتطلبات التنظيمية والأمنية المحلية والدولية.

---

## 1. الملخص التنفيذي (Executive Summary)
أجرى الفريق الفني تدقيقاً شاملاً ومعمقاً لقاعدة بيانات نظام نما الطبي (PostgreSQL) ونهايات واجهات البرمجة (APIs) المحددة في `server.js` و `db_postgres.js`. يظهر الفحص أن النظام الحالي يعمل كمنظومة أحادية للمنشأة الفردية (Single-tenant Monolith) حيث يتم حفظ بيانات المرضى، الفحوصات الطبية، الفواتير، والملفات الطبية في جداول عامة ومفتوحة دون أي عزل على مستوى قاعدة البيانات أو الواجهات البرمجية. 

بالإضافة إلى ذلك، تم اكتشاف خلل برمجي جسيم يؤدي إلى تعطيل حفظ سجلات التدقيق (Audit Logs) بالكامل، بجانب وجود ثغرات حاسمة تتعلق بالتحقق المفتوح من الصلاحيات ووجود خيارات تسجيل الدخول بكلمات مرور نصية صريحة (Plaintext Fallback) وضعف حماية ملفات الجلسات (Sessions).

تحويل النظام إلى منصة SaaS متعددة المستأجرين يتطلب إعادة هيكلة جذرية لنماذج البيانات والواجهات البرمجية، وتطبيق سياسات عزل صارمة لضمان خصوصية بيانات المرضى ومنع أي تسريب بين المنشآت الطبية المختلفة.

---

## 2. مستوى خطورة قاعدة البيانات الحالية (Current DB Risk Level)
تم تصنيف مستوى الخطورة الحالي بـ **حرِج جداً (Critical - P0)** في حال تشغيل النظام كخدمة سحابية مشتركة أو محاولة ربطه بعدة منشآت.
* **الأسباب الرئيسية**:
  1. **الغياب التام لعزل البيانات**: لا توجد حقول عزل (`tenant_id` أو `facility_id`) في أي جدول، مما يعني دمج بيانات كافة المنشآت في جدول واحد دون حواجز منطقية.
  2. **ثغرة الحذف الحاد (Hard Delete)**: عمليات حذف المرضى تحذف تاريخهم الطبي والمالي بالكامل من قاعدة البيانات عبر استعلامات `DELETE FROM` المباشرة، وهو ما يتعارض مع لوائح وزارة الصحة السعودية وهيئة التخصصات الصحية.
  3. **عجز سجلات التدقيق (Audit Trail Malfunction)**: استعلامات إدراج السجلات تعتمد على حقول غير موجودة في المخطط الهيكلي، مما يعطف تتبع عمليات الوصول للملفات الطبية.
  4. **ضعف الجلسات**: استخدام `secure: false` و `httpOnly: false` لملفات تعريف الارتباط.

---

## 3. قائمة الجداول أو النماذج الحالية (Current Tables & Models List)
يحتوي النظام حالياً على **135 جدولاً** معرفة في `db_postgres.js` تغطي الموديلات الطبية والتشغيلية والمالية:
1. `patients` (المرضى)
2. `appointments` (المواعيد)
3. `employees` (الموظفين)
4. `invoices` (الفواتير)
5. `insurance_companies` (شركات التأمين)
6. `insurance_contracts` (عقود التأمين)
7. `insurance_policies` (سياسات التأمين)
8. `icd10_codes` (رموز التشخيص القياسية)
9. `approvals` (موافقات التأمين)
10. `insurance_claims` (مطالبات التأمين)
11. `medical_records` (السجل الطبي)
12. `prescriptions` (الوصفات الطبية)
13. `medications` (الأدوية العامة)
14. `lab_radiology_orders` (طلبات المختبر والأشعة)
15. `dental_records` (سجلات طب الأسنان)
16. `lab_tests_catalog` (دليل تحاليل المختبر)
17. `lab_results` (نتائج تحاليل المختبر)
18. `radiology_catalog` (دليل الأشعة)
19. `pharmacy_prescriptions_queue` (طابور صرف صيدلية)
20. `pharmacy_drug_catalog` (دليل الأدوية الفعلي)
21. `pharmacy_suppliers` (موردو الصيدلية)
22. `pharmacy_sales` (مبيعات الصيدلية)
23. `pharmacy_sale_items` (أصناف مبيعات الصيدلية)
24. `pharmacy_purchase_orders` (طلبات شراء الصيدلية)
25. `pharmacy_purchase_items` (أصناف شراء الصيدلية)
26. `pharmacy_opening_balances` (أرصدة افتتاحية صيدلية)
27. `finance_chart_of_accounts` (شجرة الحسابات)
28. `finance_journal_entries` (قيود اليومية)
29. `finance_journal_lines` (سطور قيود اليومية)
30. `finance_fiscal_years` (السنوات المالية)
31. `finance_cost_centers` (مراكز التكلفة)
32. `finance_tax_declarations` (الإقرارات الضريبية)
33. `finance_doctor_commissions` (عمولات الأطباء)
34. `finance_vouchers` (سندات القبض والصرف)
35. `hr_employees` (موظفو الموارد البشرية)
36. `hr_salaries` (الرواتب والأجور)
37. `hr_leaves` (الإجازات)
38. `hr_advances` (السلف المالية)
39. `hr_employee_documents` (وثائق الموظفين)
40. `hr_attendance` (الحضور والانصراف)
41. `hr_employee_custody` (العهد العينية)
42. `inventory_items` (أصناف المخزون العام)
43. `inventory_opening_balances` (أرصدة افتتاحية مخزون)
44. `inventory_purchases` (مشتريات المخزون)
45. `inventory_purchase_items` (أصناف المشتريات)
46. `inventory_issue_to_dept` (صرف مخزني للأقسام)
47. `inventory_issue_items` (أصناف الصرف)
48. `inventory_dept_requests` (طلبات الأقسام للمخزون)
49. `inventory_dept_request_items` (أصناف طلبات الأقسام)
50. `inventory_stock_count` (جرد المخزون)
51. `medical_services` (الخدمات الطبية والأسعار)
52. `form_templates` (نماذج النماذج الطبية)
53. `internal_messages` (الرسائل الداخلية)
54. `packages` (الباقات الطبية)
55. `package_sessions` (جلسات الباقات)
56. `discount_rules` (قواعد الخصومات)
57. `online_bookings` (الحجوزات الإلكترونية)
58. `lab_samples` (عينات المختبر)
59. `user_permissions` (صلاحيات المستخدمين التفصيلية)
60. `doctor_inventory_requests` (طلبات الأطباء للمستلزمات)
61. `doctor_inventory_request_items` (تفاصيل طلبات الأطباء)
62. `queue_advertisements` (شاشات عرض الإعلانات)
63. `integration_settings` (إعدادات الربط الخارجي)
64. `company_settings` (إعدادات المنشأة)
65. `system_users` (مستخدمو النظام)
66. `nursing_vitals` (العلامات الحيوية للتمريض)
67. `medical_certificates` (الشهادات الطبية والإجازات المرضية)
68. `patient_referrals` (الإحالات الطبية الداخلية)
69. `surgeries` (العمليات الجراحية)
70. `surgery_preop_assessments` (تقييمات ما قبل الجراحة)
71. `surgery_preop_tests` (فحوصات ما قبل الجراحة)
72. `surgery_anesthesia_records` (سجلات التخدير)
73. `operating_rooms` (غرف العمليات)
74. `blood_bank_donors` (متبرعو بنك الدم)
75. `blood_bank_units` (وحدات الدم المتوفرة)
76. `blood_bank_crossmatch` (توافق وحدات الدم)
77. `blood_bank_transfusions` (عمليات نقل الدم)
78. `consent_forms` (نماذج الإقرار والموافقة)
79. `emergency_visits` (زيارات الطوارئ)
80. `emergency_trauma_assessments` (تقييم الحالات الحرجة والحوادث)
81. `emergency_beds` (أسرّة الطوارئ)
82. `wards` (أجنحة التنويم)
83. `beds` (أسرّة التنويم)
84. `admissions` (عمليات التنويم والقبول)
85. `admission_daily_rounds` (المرور اليومي للأطباء)
86. `bed_transfers` (انتقالات الأسرّة)
87. `icu_monitoring` (مراقبة العناية المركزة)
88. `icu_ventilator` (أجهزة التنفس الصناعي)
89. `icu_scores` (مؤشرات خطورة العناية المركزة)
90. `icu_fluid_balance` (ميزان السوائل للعناية المركزة)
91. `cssd_instrument_sets` (أطقم أدوات التعقيم)
92. `cssd_sterilization_cycles` (دورات التعقيم المركزية)
93. `cssd_load_items` (عناصر دورات التعقيم)
94. `diet_orders` (طلبات الحمية الغذائية للمرضى)
95. `diet_meals` (الوجبات الغذائية المقدمة)
96. `nutrition_assessments` (التقييم الغذائي للمرضى)
97. `infection_surveillance` (رصد العدوى الذاتي)
98. `infection_outbreaks` (فاشيات العدوى الوبائية)
99. `employee_exposures` (تعرض الموظفين للعدوى والأخطار)
100. `hand_hygiene_audits` (تدقيق غسيل الأيدي للكوادر)
101. `quality_incidents` (حوادث الجودة والسلامة)
102. `quality_patient_satisfaction` (استبيانات رضا المرضى)
103. `quality_kpis` (مؤشرات الأداء للجودة)
104. `maintenance_work_orders` (أوامر صيانة المعدات الطبية)
105. `maintenance_equipment` (الأجهزة والمعدات الطبية)
106. `maintenance_pm_schedules` (الصيانة الوقائية الدورية)
107. `transport_requests` (نقل وحركة المرضى داخلياً)
108. `audit_trail` (سجل تدقيق العمليات)
109. `medical_records_files` (ملفات الأرشيف الورقي للمرضى)
110. `medical_records_requests` (طلبات سحب الملفات الطبية)
111. `medical_records_coding` (الترميز الطبي للتشخيصات)
112. `clinical_pharmacy_reviews` (مراجعات الصيدلة السريرية)
113. `drug_interactions` (تعارضات الأدوية)
114. `patient_drug_education` (تثقيف المرضى الدوائي)
115. `rehab_patients` (مرضى التأهيل والعلاج الطبيعي)
116. `rehab_sessions` (جلسات التأهيل والعلاج الطبيعي)
117. `rehab_goals` (أهداف خطة التأهيل)
118. `rehab_assessments` (تقييمات حالات التأهيل)
119. `emar_orders` (سجل إعطاء الأدوية الإلكتروني)
120. `emar_administrations` (توثيق إعطاء الجرعات الدوائية)
121. `nursing_care_plans` (خطة الرعاية التمريضية للمريض)
122. `portal_users` (مستخدمو بوابة المرضى الإلكترونية)
123. `portal_appointments` (حجوزات بوابة المرضى)
124. `zatca_invoices` (الفواتير الإلكترونية المعتمدة لـ ZATCA)
125. `telemedicine_sessions` (جلسات الطب الاتصالي وعن بعد)
126. `pathology_cases` (حالات المختبر الباثولوجي والأنسجة)
127. `social_work_cases` (حالات الخدمة الاجتماعية للمرضى)
128. `mortuary_cases` (سجلات الوفيات والثلاجة)
129. `cme_activities` (أنشطة التعليم الطبي المستمر)
130. `cme_registrations` (تسجيلات الكادر بأنشطة التعليم)
131. `cosmetic_procedures` (كتالوج الإجراءات التجميلية)
132. `cosmetic_cases` (عمليات وحالات قسم التجميل)
133. `cosmetic_consents` (إقرارات عمليات التجميل)
134. `cosmetic_photos` (صور الحالات قبل وبعد التجميل)
135. `cosmetic_followups` (متابعات ما بعد عمليات التجميل)

---

## 4. تصنيف الجداول حسب الحساسية (Tables Classification by Sensitivity)
بناءً على طبيعة البيانات وتأثيرها على خصوصية المريض والمنشأة:

### أ. بيانات طبية عالية الحساسية (PHW / PHI)
تتطلب تشفيراً أثناء الحفظ (Encryption at rest) وضوابط صارمة للوصول تمنع تسريبها قانونياً بموجب نظام حماية البيانات الشخصية السعودي (PDPL):
* `patients`, `medical_records`, `prescriptions`, `dental_records`, `lab_radiology_orders`, `lab_results`, `pharmacy_prescriptions_queue`, `nursing_vitals`, `medical_certificates`, `patient_referrals`, `surgeries`, `surgery_preop_assessments`, `surgery_preop_tests`, `surgery_anesthesia_records`, `blood_bank_crossmatch`, `blood_bank_transfusions`, `consent_forms`, `emergency_visits`, `emergency_trauma_assessments`, `admissions`, `admission_daily_rounds`, `icu_monitoring`, `icu_ventilator`, `icu_scores`, `icu_fluid_balance`, `diet_orders`, `diet_meals`, `nutrition_assessments`, `infection_surveillance`, `medical_records_files`, `medical_records_requests`, `medical_records_coding`, `clinical_pharmacy_reviews`, `patient_drug_education`, `rehab_patients`, `rehab_sessions`, `rehab_goals`, `rehab_assessments`, `emar_orders`, `emar_administrations`, `nursing_care_plans`, `telemedicine_sessions`, `pathology_cases`, `social_work_cases`, `mortuary_cases`, `cosmetic_cases`, `cosmetic_consents`, `cosmetic_photos`, `cosmetic_followups`.

### ب. بيانات مالية (Financial Data)
تخضع لقوانين الضرائب (ZATCA) ومراجعة الحسابات والتأمين (NPHIES):
* `invoices`, `insurance_claims`, `pharmacy_sales`, `pharmacy_sale_items`, `pharmacy_purchase_orders`, `pharmacy_purchase_items`, `finance_journal_entries`, `finance_journal_lines`, `finance_tax_declarations`, `finance_doctor_commissions`, `finance_vouchers`, `daily_close`, `zatca_invoices`.

### ج. بيانات تشغيلية (Operational Data)
تخدم سير العمل والجدولة وحركة المرضى داخل المنشأة:
* `appointments`, `waiting_queue`, `blood_bank_donors`, `blood_bank_units`, `emergency_beds`, `wards`, `beds`, `bed_transfers`, `cssd_sterilization_cycles`, `cssd_load_items`, `hand_hygiene_audits`, `quality_incidents`, `quality_patient_satisfaction`, `maintenance_work_orders`, `transport_requests`, `portal_appointments`, `cme_registrations`, `doctor_inventory_requests`, `doctor_inventory_request_items`.

### د. بيانات إعدادات وبيانات رئيسية (Settings & Master Data)
أدلة قياسية وكتالوجات خدمات وأسعار يمكن مشاركتها جزئياً أو تخصيصها لكل منشأة:
* `insurance_companies`, `insurance_contracts`, `insurance_policies`, `icd10_codes`, `medications`, `lab_tests_catalog`, `radiology_catalog`, `pharmacy_drug_catalog`, `pharmacy_suppliers`, `pharmacy_opening_balances`, `finance_chart_of_accounts`, `finance_fiscal_years`, `finance_cost_centers`, `inventory_items`, `inventory_opening_balances`, `inventory_purchases`, `inventory_purchase_items`, `inventory_issue_to_dept`, `inventory_issue_items`, `inventory_dept_requests`, `inventory_dept_request_items`, `inventory_stock_count`, `medical_services`, `form_templates`, `discount_rules`, `lab_samples`, `queue_advertisements`, `integration_settings`, `company_settings`, `cssd_instrument_sets`, `quality_kpis`, `maintenance_equipment`, `maintenance_pm_schedules`, `drug_interactions`, `cme_activities`, `cosmetic_procedures`.

### هـ. بيانات مستخدمين وصلاحيات (Users & Access Data)
تخضع لحماية قصوى وإدارة الهوية والصلاحيات:
* `system_users`, `user_permissions`, `portal_users`, `employees`, `hr_employees`, `hr_salaries`, `hr_leaves`, `hr_advances`, `hr_employee_documents`, `hr_attendance`, `hr_employee_custody`.

---

## 5. الجداول التي تفتقد معرف المستأجر (Tables Missing tenant_id)
جميع الجداول الـ 135 تفتقد لحقل `tenant_id`.
لكن **الجداول التي تحتاج عزل مستأجرين إلزامي فوري** لمنع تداخل العمليات بين الشركات والمستشفيات المختلفة هي:
* الجداول الطبية للمرضى: `patients`, `medical_records`, `prescriptions`, `lab_radiology_orders`, `lab_results`, `dental_records`, `nursing_vitals`, `medical_certificates`, `patient_referrals`, `surgeries`, `admissions`, `telemedicine_sessions`, `pathology_cases`, `cosmetic_cases`.
* الجداول المالية: `invoices`, `insurance_claims`, `daily_close`, `finance_journal_entries`, `finance_journal_lines`, `finance_vouchers`, `zatca_invoices`.
* الجداول الأمنية للمستخدمين: `system_users`, `user_permissions`, `portal_users`.

---

## 6. الجداول التي تفتقد معرف المنشأة أو الفرع (Tables Missing facility_id / branch_id)
تحتاج الجداول التشغيلية واليومية لعزل على مستوى الفروع التابعة لنفس المستأجر لتمكين التقارير الجغرافية وتخطيط الموارد:
* الجداول التشغيلية: `appointments`, `waiting_queue`, `emergency_visits`, `admissions`.
* الجداول اللوجستية والمخزون: `inventory_items`, `inventory_opening_balances`, `inventory_purchases`, `inventory_issue_to_dept`, `pharmacy_drug_catalog`.
* الفواتير والمقبوضات: `invoices`, `daily_close` (التقفيل اليومي يكون لكل فرع وصندوق مستقل).
* الموظفين: `hr_employees`, `employees` (لتحديد موقع عمل الموظف الفعلي).

---

## 7. الجداول التي تحتاج سجل تدقيق تفصيلي (Tables Needing Audit Log)
عمليات الاطلاع والكتابة والتعديل والحذف على هذه الجداول يجب أن تخضع لقوانين تتبع صارمة:
* `medical_records` (أي اطلاع أو تعديل للسجل الطبي للمريض).
* `patients` (التعديل على هوية المريض أو حذفه).
* `prescriptions` & `dispensed_at` (صرف الأدوية الخاضعة للرقابة).
* `invoices` (حذف أو تعديل فواتير أو إصدار مرتجعات مالية).
* `system_users` (تغيير الصلاحيات أو تفعيل الحسابات).

---

## 8. الجداول التي تحتاج حذف مرن (Soft Delete Mapping)
يُحظر الحذف النهائي للملفات والبيانات القانونية والطبية. يجب استبدال الحذف الفيزيائي بحقل `is_deleted` و `deleted_at`:
1. `patients`
2. `medical_records`
3. `prescriptions`
4. `lab_radiology_orders`
5. `invoices`
6. `system_users`
7. `hr_employees`
8. `appointments`

---

## 9. العلاقات الخطرة بين الجداول (Dangerous Table Relationships)
العلاقات الحالية مبنية على مفاتيح خارجية مباشرة دون قيد المستأجر، مما ينشئ ثغرات أمنية خطيرة:
* `appointments.patient_id` -> `patients.id`: إذا مرر المستخدم رقم `patient_id` لشركة أخرى، سيكشف موعد المريض دون تحقق.
* `medical_records.patient_id` -> `patients.id`: يمكن لمستخدم من منشأة "أ" استعراض السجل الطبي لمريض في منشأة "ب" بمجرد إرسال المعرف الرقمي في استعلامات API.
* `invoices.patient_id` -> `patients.id`: ثغرة استعراض المديونيات والفواتير المالية لمنشأة أخرى.
* `pharmacy_sales.patient_id` -> `patients.id`: تسريب مبيعات الصيدلية ووصفاتها للمرضى.

> [!WARNING]
> المفاتيح الخارجية بدون قيد المستأجر تسمح لثغرات الـ IDOR (Insecure Direct Object Reference) بالانتشار في كامل كود الاستعلامات المباشرة.

---

## 10. مسارات واجهات البرمجة الخطرة (Dangerous API Routes)
المسارات المحددة في `server.js` تفتقر للتحقق من ملكية المستأجر أو فحص الأدوار الدقيق:
1. `GET /api/patients`
   * **الخطر**: يرجع كافة المرضى في قاعدة البيانات. بمجرد تسجيل الدخول كـ `Staff` من أي منشأة، يسترجع التطبيق قائمة الـ 200 مريض الأحدث لجميع المنشآت الطبية الطبية دون تفرقة.
2. `GET /api/patients/:id` & `PUT /api/patients/:id`
   * **الخطر**: يقبل معرف المريض كمعامل في الرابط ويسترجعه/يعدله بمجرد وجود جلسة مسجلة `requireAuth` دون التحقق من تطابق `tenant_id` الخاص بالموظف الحالي مع المستأجر الخاص بالمرتضى.
3. `DELETE /api/patients/:id`
   * **الخطر**: يقوم بحذف المريض وكافة متعلقاته الطبية والمالية نهائياً من قاعدة البيانات بمجرد تحقق `requireAuth` العام، دون فحص الأدوار ودون الاحتفاظ بـ soft delete.
4. `GET /api/medical/records`
   * **الخطر**: يسترجع كافة السجلات الطبية لجميع المرضى في قاعدة البيانات دفعة واحدة إذا لم يُمرر المعرف، ولا يتحقق من دور الطالب (يمكن للـ Receptionist سحب ملفات المرضى الطبية بالتفصيل).
5. `GET /api/invoices` & `GET /api/reports/financial`
   * **الخطر**: يرجع مجموع الإيرادات الإجمالي والتقارير المالية للشركة الأم لكافة المستشفيات والعيادات معاً دون تصفية.

---

## 11. مخاطر تسريب بيانات بين المستأجرين (Cross-Tenant Leakage Risks)
* **تسريب عبر الاستعلام العام**: استخدام `SELECT * FROM table` بدون `WHERE tenant_id = current_tenant` في واجهات برمجة التقارير والإحصائيات والبحث.
* **تسريب عبر التوقعات (Sequence Guessing)**: استخدام معرفات تسلسلية `SERIAL` (مثل `patients.id = 1, 2, 3`) يتيح للمهاجمين تجربة الأرقام لاستخراج البيانات.
* **تسريب عبر الذاكرة المشتركة (In-Memory Cache & Maps)**: المتغير `activeUserSessions` في `server.js` يقوم بحفظ الجلسات على مستوى الذاكرة العشوائية للخادم. في بيئة متعددة الخوادم (Load Balanced)، سيفقد النظام تتبع تسجيل الدخول الموحد، وفي حال تداخل الجلسات قد يتم قراءة الذاكرة بشكل غير صحيح.

---

## 12. مخاطر الصلاحيات (Authorization & RBAC Risks)
* **غياب الفحص على نهايات التعديل والحذف**:
  * حذف المريض وتعديله يتطلب فقط `requireAuth` (وجود جلسة مستخدم) وليس `requireRole('Admin')` أو دور مخصص يملك صلاحية `can_delete`.
* **مصفوفة الصلاحيات الثنائية المفقودة**:
  * جدول `user_permissions` يحتوي على الصلاحيات التفصيلية (`can_view`, `can_add`, `can_edit`, `can_delete`) ولكن نهايات API في `server.js` لا تتحقق من هذا الجدول على الإطلاق، بل تكتفي بمقارنة الدور العام للمستخدم عبر مصفوفة `ROLE_PERMISSIONS` الثابتة في الكود.

---

## 13. مخاطر تسجيل الدخول والجلسات (Session & Auth Risks)
* **plaintext password fallback (ثغرة P1)**:
  * في حال عدم تطابق التشفير، يقارن الكود النص الصريح المدخل بـ `password_hash` المخزن بالـ DB. هذا يمثل خطراً أمنياً داهماً يسمح للمشرفين بقراءة كلمات مرور المستخدمين المخزنة قبل الهجرة.
* **إعدادات كوكيز الجلسة (`secure: false` و `httpOnly: false`)**:
  * يسمح بقراءة المعرف الخاص بالجلسة عبر أكواد JS الخبيثة (XSS Session Hijacking) ونقله عبر بروتوكولات غير مشفرة.
* **تخزين الجلسات في الذاكرة (Memory Store Default)**:
  * استخدام `express-session` بدون تخزين خارجي (مثل Redis أو PostgreSQL Session Table) يسبب تسريب ذاكرة وعجز النظام عن التوسع الأفقي (Horizontal Scaling).

---

## 14. خطة تحويل قاعدة البيانات إلى Multi-tenant SaaS (Database SaaS Roadmap)
سنعتمد نموذج **قاعدة بيانات مشتركة مع عزل منطقي صارم (Shared Database - Logical Schema Isolation)** كحل متوازن للتكلفة والسرعة، مع دعم خيار **قاعدة بيانات منفصلة لكل مستأجر (Database-per-tenant)** للمستشفيات الكبرى.

### الهيكل التنظيمي المقترح:
1. إجبار الموظفين والمرضى على تسجيل الدخول عبر نطاق مخصص (Subdomain) مثل `clinic1.namamedical.com`.
2. استخراج `tenant_id` ديناميكياً من النطاق وتمريره إلى سياق الطلب (Request Context).
3. تحديث كافة استعلامات قاعدة البيانات لتتضمن تصفية تلقائية بناءً على `tenant_id`.

---

## 15. اقتراح النماذج المستقبلية (Proposed Future Models Schema)
سنقوم بإنشاء النماذج التالية برمجياً في المخطط المستقبلي:

### 1. جدول المستأجرين (Tenants)
```sql
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active', -- Active, Suspended, Trial
    plan_type VARCHAR(50) DEFAULT 'Standard',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. جدول الفروع والمنشآت (Facilities)
```sql
CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    tax_number VARCHAR(100), -- للربط مع ZATCA لكل فرع بشكل مستقل
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. جدول الأقسام الطبية (Departments)
```sql
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    name_ar VARCHAR(255),
    name_en VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);
```

### 4. جدول أدوار المستخدمين والمستأجرين (UserTenantRoles)
```sql
CREATE TABLE user_tenant_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES system_users(id) ON DELETE CASCADE,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    role_id INTEGER, -- مرجع لجدول الأدوار المستقبلي
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. سجلات الوصول الطبية الصارمة (MedicalAccessLog)
```sql
CREATE TABLE medical_access_logs (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    user_id INTEGER,
    username VARCHAR(150),
    patient_id INTEGER,
    record_id INTEGER,
    action VARCHAR(100), -- VIEW, EDIT, PRINT, EXPORT
    ip_address VARCHAR(45),
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 16. خطة الهجرة المستقبلية (Conceptual Future Migration Plan)
خطة نقل قاعدة البيانات دون إيقاف الخدمة:
1. **المرحلة 1**: إنشاء جدول `tenants` وجدول `facilities` وإدراج مستأجر افتراضي (Default Tenant) يمثل العيادة الحالية.
2. **المرحلة 2**: تشغيل هجرة قاعدة بيانات (SQL Migration) لإضافة حقل `tenant_id` و `facility_id` لكافة الجداول الـ 135، مع تعيين قيمتها الافتراضية إلى المستأجر الحالي لمنع كسر البيانات القديمة.
3. **المرحلة 3**: إزالة القيمة الافتراضية وجعل حقل `tenant_id INTEGER NOT NULL`.
4. **المرحلة 4**: إنشاء مؤشرات فريدة (Composite Indexes) تتضمن `tenant_id` لضمان سرعة الاستعلامات (مثال: `CREATE INDEX idx_patients_tenant ON patients(tenant_id, id)`).

---

## 17. خطة التراجع المستقبلية (Conceptual Future Rollback Plan)
خطوات إرجاع قاعدة البيانات في حال حدوث ععل أثناء عملية النشر والترحيل:
1. **تأمين نسخة احتياطية**: أخذ نسخة فيزيائية كاملة من قاعدة البيانات قبل تشغيل الـ Migration عبر `pg_dump`.
2. **برمجية التراجع**: توفير نص عكسي (Rollback Script) يقوم بـ:
   * إسقاط القيود الخاصة بالمفاتيح الخارجية المضافة.
   * إزالة حقول `tenant_id` و `facility_id` من كافة الجداول.
   * إرجاع شفرة خادم التطبيق إلى الإصدار السابق المستقر.
   * استعادة الجلسات المحلية القديمة.

---

## 18. سيناريوهات الاختبار المطلوبة (Required Testing Scenarios)
لتأكيد العزل التام للمستأجرين والتوافق الوظيفي:
* **سيناريو اختبار 1 (منع تسريب الهوية المعرفية - IDOR)**:
  * محاولة جلب السجل الطبي برقم `patient_id = 5` ينتمي للمستأجر 1 بواسطة موظف ينتمي للمستأجر 2. يجب أن يستجيب الخادم بـ `403 Forbidden` أو `404 Not Found` حتى لو كان الموظف يملك دور `Doctor`.
* **سيناريو اختبار 2 (التقارير المالية المشتركة)**:
  * التحقق من أن استدعاء `/api/reports/financial` يرجع فقط الفواتير الخاصة بالـ `tenant_id` المرتبط بجلسة المستخدم الحالي، ويقيس نسبة التباين المالي بشكل منعزل تماماً.
* **سيناريو اختبار 3 (تسجيل دخول نطاقات فرعية)**:
  * محاولة تسجيل دخول مستخدم عيادة "أ" عن طريق نطاق عيادة "ب". يجب أن يرفض النظام عملية تسجيل الدخول لعدم تطابق الهوية مع النطاق الفعلي للمستأجر.
* **سيناريو اختبار 4 (الحذف المرن والتأثير)**:
  * محاولة استرجاع مريض محذوف عن طريق واجهة البحث للتأكد من عدم ظهوره، مع التحقق من وجود بياناته الفاعلة داخل قاعدة البيانات وعودتها لقيمتها الحالية في حال التراجع.

---

## 19. أولويات الإصلاح (Fix Priorities)
* **الأولوية 1 (حرجة فورا - P0)**:
  1. تصحيح استعلام جدول سجلات التدقيق `audit_trail` لإصلاح الخلل البرمجي المستمر ومنع فشل إدراج السجلات.
  2. تحديث إعدادات الكوكيز للجلسة لتكون `secure: true` (عند تفعيل HTTPS) و `httpOnly: true` في بيئات العمل.
  3. حظر الحذف الحاد (Hard Delete) للمرضى في نهايات API وتحويلها فوراً إلى حذف مرن.
* **الأولوية 2 (عالية - P1)**:
  1. إزالة ثغرة كلمات المرور النصية الصريحة (Plaintext Fallback) من خادم تسجيل الدخول وفرض التشفير التلقائي.
  2. تطبيق التحقق من مصفوفة الصلاحيات والـ Roles على جميع مسارات واجهة برمجة التطبيقات الطبية والمالية الحساسة.
* **الأولوية 3 (متوسطة - P2)**:
  1. بدء هيكلة جداول المستأجرين والفروع ونقل الحسابات للعمل عليها تدريجياً.

---

## 20. توصية المرحلة التالية (Next Phase Recommendation)
نوصي بالانتقال فوراً إلى مرحلة **مراجعة وتطوير نظام الصلاحيات والأدوار (Roles & Permissions Hardening)** لمعالجة فجوات واجهات الـ API المفتوحة وضبط سجل التدقيق المعطل قبل البدء في تعديل جداول قاعدة البيانات منطقياً للتحول إلى SaaS، لضمان استقرار البيئة التشغيلية وحمايتها أولاً.
