# تقرير استكشاف الجداول الجاهزة للتفعيل - Batch 5 (Ready Tables Discovery Report)
## نظام نما الطبي (NamaMedical)

توثيق التحليل الهيكلي وإحصائيات الجداول المستهدفة بالتفعيل بدون تعديل للمخطط الإنشائي (Schema).

---

### 1. إحصائيات الجداول المكتشفة (Audited Tables Summary)

تم فحص الجداول الثلاثة المعتمدة للتفعيل وتبين جاهزيتها الكاملة:

1. **جدول أسرة الطوارئ ([emergency_beds](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/rls_staging_batch5_enable_without_schema_change.sql))**:
   * **عدد السجلات الحالي**: 8 سجلات.
   * **عدد السجلات الفارغة من معرف المستأجر (tenant_id IS NULL)**: 0.
   * **توزيع السجلات**: جميعها تنتمي للمستأجر `1` (توزيع: `1 | 8`).
   * **معرف المستأجر (`tenant_id`)**: موجود من نوع `integer`.
   * **معرف الفرع (`branch_id`)**: موجود من نوع `integer`.

2. **جدول مبيعات الصيدلية ([pharmacy_sales](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/rls_staging_batch5_enable_without_schema_change.sql))**:
   * **عدد السجلات الحالي**: 0 سجلات (جدول فارغ).
   * **عدد السجلات الفارغة من معرف المستأجر (tenant_id IS NULL)**: 0.
   * **معرف المستأجر (`tenant_id`)**: موجود من نوع `integer`.
   * **معرف الفرع (`branch_id`)**: موجود من نوع `integer`.

3. **جدول عناصر مبيعات الصيدلية ([pharmacy_sale_items](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/rls_staging_batch5_enable_without_schema_change.sql))**:
   * **عدد السجلات الحالي**: 0 سجلات (جدول فارغ).
   * **عدد السجلات الفارغة من معرف المستأجر (tenant_id IS NULL)**: 0.
   * **معرف المستأجر (`tenant_id`)**: موجود من نوع `integer`.
   * **معرف الفرع (`branch_id`)**: غير موجود (يتم عزله بـ `tenant_id` فقط).

---

### 2. البنية البرمجية للجداول (Columns & Schema Discovery)

* **emergency_beds**:
  * الأعمدة: `id` (integer, PK), `bed_name` (text), `bed_name_ar` (text), `zone` (text), `zone_ar` (text), `status` (text), `current_patient_id` (integer), `notes` (text), `tenant_id` (integer), `branch_id` (integer).
* **pharmacy_sales**:
  * الأعمدة: `id` (integer, PK), `patient_id` (integer), `sale_type` (text), `total_amount` (real), `discount` (real), `insurance_coverage` (real), `patient_share` (real), `payment_method` (text), `cashier` (text), `invoice_number` (text), `created_at` (timestamp), `tenant_id` (integer), `branch_id` (integer).
* **pharmacy_sale_items**:
  * الأعمدة: `id` (integer, PK), `sale_id` (integer), `drug_id` (integer), `qty` (integer), `unit_price` (real), `total_price` (real), `bonus_qty` (integer), `discount` (real), `tenant_id` (integer).
