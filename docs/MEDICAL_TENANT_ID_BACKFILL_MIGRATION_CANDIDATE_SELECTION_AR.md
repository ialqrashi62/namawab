# تقرير تصنيف واختيار جداول الهجرة - (Migration Candidate Selection Report)
## نظام نما الطبي (NamaMedical)

تصنيف الجداول المؤجلة وتحديد مدى ملاءمتها لإضافة معرف المستأجر والتعبئة بأثر رجعي.

---

### 1. تصنيف الجداول المؤجلة حسب الجاهزية

1. **الفئة الأولى: جداول جاهزة للهجرة المباشرة (`MIGRATION_CANDIDATE_DIRECT_TENANT_ID`)**:
   * **[lab_samples](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/tenant_id_backfill_design_draft.sql)** (عينات المختبر):
     * **الحالة**: يفتقر لعمود `tenant_id`.
     * **المصدر**: يمكن اشتقاق `tenant_id` مباشرة من جدول `lab_radiology_orders` المرتبط به عبر `order_id`.
     * **عدد السجلات**: 0 سجلات حالياً، مما يجعل الهجرة آمنة تماماً ودون مخاطر على البيانات التاريخية.
     * **القرار**: تم اختيار هذا الجدول كمرشح وحيد ومناسب جداً للدفعة الحالية.

2. **الفئة الثانية: جداول مهيأة مسبقاً (`ALREADY_CONFIGURED`)**:
   * **[beds](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/tenant_id_backfill_design_draft.sql)** (الأسرة) و **[bed_transfers](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/tenant_id_backfill_design_draft.sql)** (حركات الأسرة):
     * **الحالة**: العمود `tenant_id` موجود ومطحون مسبقاً في المخطط الإنشائي للـ Staging.
     * **القرار**: لا تحتاج لهجرة إضافة عمود، بل مؤجلة للتفعيل في RLS Batch 6 لاحقاً.

3. **الفئة الثالثة: كتالوجات مشتركة (`SHARED_CATALOG_READ_ONLY`)**:
   * **[medications](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/tenant_id_backfill_design_draft.sql)** (الأدوية)، **[lab_tests_catalog](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/tenant_id_backfill_design_draft.sql)** (فحوصات المختبر)، و **[radiology_catalog](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/tenant_id_backfill_design_draft.sql)** (الأشعة):
     * **الحالة**: كتالوجات عامة موحدة تشترك فيها كافة المنشآت الطبية.
     * **القرار**: يُمنع إضافة `tenant_id` عليها مباشرة؛ لكونها تشغيلية عامة وتحتاج مستقبلاً لنموذج جدول وسيط للتسعير أو التخصيص لكل مستأجر.
