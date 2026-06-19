# تقرير اكتشاف وتفصيل الجداول المؤجلة (Deferred Tables Deep Discovery Report)
## نظام نما الطبي - تأمين وحوكمة قواعد البيانات الطبية

---

### 1. ملخص الفحص والتدقيق (Discovery Overview)

تم بنجاح تشغيل فحص شامل ودقيق لهياكل الجداول المؤجلة من بيئة الاستضافة الاستباقية (Staging Server) لمعرفة خصائص الحقول والمفاتيح الأساسية والخارجية وعدد السجلات فيها. شمل الفحص 9 جداول (6 جداول مؤجلة سابقاً بالإضافة لـ 3 جداول مرتبطة بها لتغطية العلاقات).

---

### 2. النتائج التفصيلية للجداول المفحوصة (Audited Tables Details)

#### 1. medications (الأدوية)
* **الوصف**: جدول رئيسي لبيانات الأدوية وتدبير المخزون.
* **وجود tenant_id**: **لا** (غير موجود).
* **معرفات أخرى**: لا يوجد `patient_id` أو `facility_id`.
* **الحقول**: `id` (مفتاح أساسي)، `name` (الاسم)، `active_ingredient` (المادة الفعالة)، `stock_quantity` (الكمية المتوفرة)، `price` (السعر).
* **عدد السجلات**: 0 سجلات.
* **العلاقات (FKs)**: لا توجد علاقات خارجية معرفة مباشرة.
* **التصنيف**: جدول بيانات رئيسي مختلط (Mixed Master Data).

#### 2. lab_samples (عينات المختبر)
* **الوصف**: جدول حركات وعينات المختبر.
* **وجود tenant_id**: **لا** (غير موجود).
* **معرفات أخرى**: يحتوي على `order_id` (معرف طلب الفحص المرتبط).
* **الحقول**: `id` (مفتاح أساسي)، `order_id` (معرف الطلب)، `sample_type` (نوع العينة)، `barcode` (الباركود)، `collection_date`، `collected_by`، `status`، `storage_location`، `notes`.
* **عدد السجلات**: 0 سجلات.
* **التصنيف**: بيانات تشغيلية سريرية (Clinical Transaction Data).
* **اشتقاق tenant_id**: يمكن اشتقاقه من جدول الطلبات `lab_radiology_orders` عن طريق `order_id`.

#### 3. emergency_beds (أسرة الطوارئ)
* **الوصف**: أسرة الطوارئ وتوزيع الحالات الطارئة.
* **وجود tenant_id**: **نعم** (موجود).
* **الحقول**: `id` (مفتاح أساسي)، `bed_name`، `bed_name_ar`، `zone`، `zone_ar`، `status`، `current_patient_id`، `notes`، `tenant_id`، `branch_id`.
* **عدد السجلات**: 8 سجلات (كلها تتبع `tenant_id = 1` ولا توجد قيم NULL).
* **التصنيف**: مورد تشغيلي للفرع والمستأجر (Operational Resource).

#### 4. pharmacy_sales (مبيعات الصيدلية)
* **الوصف**: الحركات المالية والعملياتية لصرف أدوية الصيدلية للجمهور والمرضى.
* **وجود tenant_id**: **نعم** (موجود).
* **معرفات أخرى**: `patient_id`، `branch_id`.
* **الحقول**: `id`، `patient_id`، `sale_type`، `total_amount`، `discount`، `insurance_coverage`، `patient_share`، `payment_method`، `cashier`، `invoice_number`، `created_at`، `tenant_id`، `branch_id`.
* **عدد السجلات**: 0 سجلات.
* **التصنيف**: بيانات مالية وعملياتية (Operational Transaction Data).

#### 5. pharmacy_sale_items (تفاصيل مبيعات الصيدلية)
* **الوصف**: جدول تفصيلي يرتبط بجدول مبيعات الصيدلية.
* **وجود tenant_id**: **نعم** (موجود).
* **الحقول**: `id`، `sale_id` (يرتبط بـ pharmacy_sales)، `drug_id`، `qty`، `unit_price`، `total_price`، `bonus_qty`، `discount`، `tenant_id`.
* **عدد السجلات**: 0 سجلات.
* **التصنيف**: تفاصيل العمليات (Operational Transaction Detail).

#### 6. lab_tests_catalog (كتالوج تحاليل المختبر)
* **الوصف**: الدليل الشامل للتحاليل المخبرية.
* **وجود tenant_id**: **لا** (غير موجود).
* **الحقول**: `id`، `test_name`، `category`، `normal_range`، `price`.
* **عدد السجلات**: 455 صفاً.
* **التصنيف**: كتالوج عام مشترك (Shared Reference Catalog).

#### 7. radiology_catalog (كتالوج الأشعة)
* **الوصف**: الدليل الشامل للفحوصات الإشعاعية.
* **وجود tenant_id**: **لا** (غير موجود).
* **الحقول**: `id`، `modality`، `exact_name`، `default_template`، `price`.
* **عدد السجلات**: 305 صفوف.
* **التصنيف**: كتالوج عام مشترك (Shared Reference Catalog).

#### 8. beds (الأسرة العامة للأجنحة والتنويم)
* **الوصف**: أسرة المستشفيات وغرف التنويم.
* **وجود tenant_id**: **نعم** (موجود).
* **الحقول**: `id`، `ward_id`، `bed_number`، `bed_type`، `room_number`، `status`، `current_patient_id`، `current_admission_id`، `isolation_type`، `notes`، `tenant_id`، `branch_id`.
* **عدد السجلات**: 95 صفاً (كلها تتبع `tenant_id = 1` ولا توجد قيم NULL).
* **التصنيف**: مورد تنويمي للمستأجر (Inpatient Resource).

#### 9. bed_transfers (حركات نقل الأسرة)
* **الوصف**: سجل انتقال المرضى بين الأجنحة والأسرة.
* **وجود tenant_id**: **نعم** (موجود).
* **الحقول**: `id`، `admission_id`، `patient_id`، `from_ward`، `from_bed`، `to_ward`، `to_bed`، `transfer_reason`، `transferred_by`، `transfer_date`، `tenant_id`، `branch_id`.
* **عدد السجلات**: 0 سجلات.
* **التصنيف**: بيانات تشغيلية حركية (Operational Transaction).

---

### 3. ضوابط حوكمة وأمان البيانات

* **عدم تسريب السرية**: تم إجراء كافة عمليات الفحص والتدقيق باستخدام الاستعلامات التجميعية وعرض هيكلية المخطط فقط. لم يتم تصدير أو كشف أي بيانات شخصية للمرضى أو نتائج طبية أو مبالغ مالية فعلية.
* **التوافق اللغوي**: التقرير مكتوب بالكامل باللغة العربية بترميز UTF-8 سليم 100%.

---
STATUS:
  MEDICAL_TENANT_ID_BACKFILL_DEFERRED_TABLES_DISCOVERY_COMPLETED
