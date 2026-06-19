# تقرير تدقيق مخطط قاعدة البيانات للأسرة والأجنحة (Beds & Wards Schema Audit)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا التقرير نتائج فحص وتدقيق بنية جداول الأسرة والأجنحة والعمليات الطبية المرتبطة بها في قاعدة بيانات Staging الحالية.

---

### 1. الكشف الفعلي للجداول ومخططاتها (Schema Audited Tables)

تم التحقق من مخطط قاعدة البيانات (Schema) وتفاصيل الأعمدة والقيود الفعلية للجداول الخمسة الرئيسية كالتالي:

#### أ. جدول الأجنحة والغرف (`wards`) - يحتوي على 11 عموداً:
- `id`: مفتاح أساسي تلقائي (SERIAL PRIMARY KEY).
- `ward_name` / `ward_name_ar`: اسم الجناح (نص).
- `ward_type`: نوع الجناح (مثل General, ICU, Maternity).
- `floor` / `building`: تفاصيل الموقع (نص).
- `total_beds`: عدد الأسرة الكلي بالجناح (integer).
- `status`: حالة الجناح (Active, Inactive).
- `notes`: ملاحظات إضافية.
- `tenant_id` / `branch_id`: معرفات المستأجر والفرع (إضافات من هجرات سابقة).

#### ب. جدول الأسرة (`beds`) - يحتوي على 12 عموداً:
- `id`: مفتاح أساسي تلقائي (SERIAL PRIMARY KEY).
- `ward_id`: مفتاح أجنبي يشير إلى جدول الأجنحة `wards(id)`.
- `bed_number`: رقم السرير الفريد داخل الجناح (نص).
- `bed_type`: نوع السرير (Standard, ICU, Pediatric).
- `room_number`: رقم الغرفة.
- `status`: حالة السرير الحالية (Available, Occupied, Under Maintenance).
- `current_patient_id`: معرف المريض المشغل للسرير حالياً (Integer).
- `current_admission_id`: معرف حركة التنويم الحالية النشطة للسرير (Integer).
- `isolation_type`: نوع عزل السرير الطبي (إن وجد).
- `notes`: ملاحظات إضافية.
- `tenant_id` / `branch_id`: معرفات المستأجر والفرع.

#### ج. جدول أسرة الطوارئ (`emergency_beds`) - يحتوي على 10 أعمدة:
- `id`: مفتاح أساسي (SERIAL PRIMARY KEY).
- `bed_name` / `bed_name_ar`: اسم السرير (نص).
- `zone` / `zone_ar`: منطقة الطوارئ (General, Triage, Red Zone).
- `status`: حالة السرير الحالية.
- `current_patient_id`: معرف المريض الحالي بالطوارئ.
- `notes`: ملاحظات إضافية.
- `tenant_id` / `branch_id`: معرفات المستأجر والفرع.

#### د. جدول التنويم الداخلي (`admissions`) - يحتوي على 29 عموداً:
- `id`: مفتاح أساسي (SERIAL PRIMARY KEY).
- `patient_id` / `patient_name`: معرف المريض واسمه.
- `admission_type`: نوع التنويم (Regular, Emergency, ICU).
- `admission_date` / `discharge_date`: التواريخ الزمنية.
- `admitting_doctor` / `attending_doctor`: الأطباء المسؤولون.
- `department`: القسم التشغيلي.
- `ward_id` / `bed_id`: معرّفات الجناح والسرير المخصصين للمريض.
- `diagnosis` / `icd10_code`: التفاصيل الطبية والتشخيص.
- `status`: حالة التنويم (Active, Discharged).
- `tenant_id` / `facility_id`: معرفات المستأجر والمنشأة.

#### هـ. جدول حركات نقل الأسرة (`bed_transfers`) - يحتوي على 12 عموداً:
- `id`: مفتاح أساسي (SERIAL PRIMARY KEY).
- `admission_id`: مفتاح أجنبي يشير إلى `admissions(id)`.
- `patient_id`: مفتاح أجنبي يشير إلى `patients(id)`.
- `from_ward` / `from_bed`: الجناح والسرير المنقول منهما.
- `to_ward` / `to_bed`: الجناح والسرير المنقول إليهما.
- `transfer_reason` / `transferred_by`: أسباب النقل والمسؤول.
- `transfer_date`: تاريخ النقل.
- `tenant_id` / `branch_id`: معرفات المستأجر والفرع.

---

### 2. مراجعة حالة حماية عزل الصفوف (RLS Status)
بناءً على الفحص المباشر في قاعدة البيانات:
- **`emergency_beds`**: تم تمكين RLS بنجاح وتطبيق سياسة عزل المستأجرين `rls_emergency_beds_tenant_isolation` (Batch 5).
- **`wards`**, **`beds`**, **`admissions`**, **`bed_transfers`**: نظام RLS **غير مفعل** حالياً في قاعدة البيانات على هذه الجداول الأربعة. يتم عزلهم مرحلياً فقط على مستوى طبقة الـ Express API.

---

### 3. سلامة البيانات وخلوها من السجلات اليتيمة (Orphan Data & Nulls Check)
- أثبتت نتائج الفحص خلو الجداول بالكامل من أي سجلات لا تحتوي على `tenant_id` (عدد السجلات ذات القيمة NULL يساوي 0).
- جميع سجلات الاختبارات في بيئة Staging مهيأة حالياً ومسندة تلقائياً للـ Tenant 1 والـ Branch 1 لتلافي انكسار النظام.
