# تقرير تدقيق مخطط حركات التنويم والتحويلات - الدفعة الثانية (Admissions & Transfers Schema Audit)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوضح هذا التقرير تفاصيل تدقيق البنية الهيكلية والمخطط العام (Schema) لجداول الدفعة الثانية وتوزع الحقول والمفاتيح في قاعدة البيانات.

---

### 1. تحليل حقول جدول التنويم (`admissions`)
يحتوي جدول `admissions` على الحقول الأساسية لتوثيق وإدارة حركة التنويم:
- `id` (SERIAL, Primary Key) - المعرف الفريد للتنويم.
- `patient_id` (INTEGER, Foreign Key to `patients`) - معرف المريض المنوم.
- `ward_id` (INTEGER, Foreign Key to `wards`) - معرف الجناح الطبي.
- `bed_id` (INTEGER, Foreign Key to `beds`) - معرف السرير المخصص.
- `tenant_id` (INTEGER) - معرف المستأجر (مفتاح العزل).
- `facility_id` (INTEGER) - معرف الفرع / المنشأة الطبية.
- `status` (TEXT, default 'Active') - حالة التنويم ('Active', 'Discharged').
- حقول تشغيلية إضافية: التشخيص الطبي (`diagnosis`)، كود المرض (`icd10_code`)، خطة التغذية (`diet_order`)، الطبيب المعالج والمنوّم، وتواريخ الدخول والخروج.

### 2. تحليل حقول جدول تحويلات الأسرة (`bed_transfers`)
يستخدم جدول `bed_transfers` لتوثيق التحويلات الداخلية للمرضى بين الأجنحة والأسرة:
- `id` (SERIAL, Primary Key) - المعرف الفريد لحركة التحويل.
- `admission_id` (INTEGER, Foreign Key to `admissions`) - معرف سجل التنويم المرتبط.
- `patient_id` (INTEGER, Foreign Key to `patients`) - معرف المريض المنقول.
- `from_ward` (INTEGER) - معرف الجناح المحوّل منه.
- `from_bed` (INTEGER) - معرف السرير المحوّل منه.
- `to_ward` (INTEGER) - معرف الجناح المحوّل إليه.
- `to_bed` (INTEGER) - معرف السرير المحوّل إليه.
- `tenant_id` (INTEGER) - معرف المستأجر (مفتاح العزل).
- `branch_id` (INTEGER) - معرف فرع المستأجر.
- حقول تشغيلية: سبب النقل (`transfer_reason`)، الشخص القائم بالنقل وتاريخ ووقت العملية.

### 3. الفهارس والقيود المقترحة (Proposed Indexes & Constraints)
لضمان الأداء الفائق والوقاية من تسريب سياق المستأجرين، تم إعداد الفهارس التالية كجزء من التصميم:
1. **فهرس تكامل سياق التنويم**:
   - `CREATE INDEX IF NOT EXISTS idx_admissions_tenant_facility ON admissions (tenant_id, facility_id);`
2. **فهرس تكامل سياق التحويلات**:
   - `CREATE INDEX IF NOT EXISTS idx_bed_transfers_tenant_branch ON bed_transfers (tenant_id, branch_id);`
3. **فهرس جولات الأطباء اليومية**:
   - `CREATE INDEX IF NOT EXISTS idx_daily_rounds_tenant_facility ON admission_daily_rounds (tenant_id, facility_id);`

### 4. تكامل البيانات والتحقق الهيكلي
تم فحص الجداول وثبت توافر الأعمدة اللازمة (`tenant_id` و `branch_id` / `facility_id`) بنجاح في مخطط بيئة Staging الحالي دون أي حاجة لتشغيل migrations هيكلية جديدة، مما يضمن أمان المخطط واستقراره التام.
