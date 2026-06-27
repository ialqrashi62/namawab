# تقرير تفعيل سياسات التحكم بالوصول على مستوى الصف - الدفعة الثانية (Batch 2 RLS Enablement Report)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا التقرير التفاصيل الكاملة لتفعيل سياسات التحكم بالوصول على مستوى الصف (Row-Level Security) وتأثيرها على حماية بيانات التنويم والتحويلات للدفعة الثانية.

---

### 1. سياسات RLS المفعلة ومحدداتها (Activated Policies)
تم تفعيل السياسات الأمنية التالية في قاعدة البيانات:
1. **سياسة عزل جدول التنويم (`rls_admissions_tenant_isolation`)**:
   - **المنطق (USING)**: `tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer`
   - **ضوابط التحقق (WITH CHECK)**:
     - تطابق `tenant_id` مع سياق الجلسة النشط.
     - منع ربط التنويم بمريض أو سرير يتبع مستأجراً آخر:
       `(patient_id IS NULL OR (SELECT tenant_id FROM patients WHERE id = patient_id) = tenant_id) AND (bed_id IS NULL OR (SELECT tenant_id FROM beds WHERE id = bed_id) = tenant_id)`
2. **سياسة عزل جدول تحويلات الأسرة (`rls_bed_transfers_tenant_isolation`)**:
   - **المنطق (USING)**: `tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer`
   - **ضوابط التحقق (WITH CHECK)**:
     - تطابق `tenant_id` مع سياق الجلسة.
     - منع نقل مريض لسرير يتبع مستأجراً آخر:
       `(patient_id IS NULL OR (SELECT tenant_id FROM patients WHERE id = patient_id) = tenant_id) AND (to_bed IS NULL OR (SELECT tenant_id FROM beds WHERE id = to_bed) = tenant_id)`

### 2. تدابير الحماية الفائقة (Force RLS)
تم تفعيل خاصية `FORCE ROW LEVEL SECURITY` على كلا الجدولين للتأكد من خضوع حساب المدير أو دور الاتصال الرئيسي (`postgres`) لنفس قيود العزل عند تشغيل الاستعلامات داخل التطبيق، مما يسد أي ثغرة لتداخل البيانات.

### 3. نتائج التحقق (Validation Results)
- تم تشغيل سكربت التحقق `validate.sql` بنجاح كامل.
- تم التحقق من فشل محاولات إدخال سجلات تنويم أو نقل أسرة متقاطعة (Cross-Tenant) أو لا تتطابق مع معرف المستأجر، حيث تم رفض الإدراج وإرجاع أخطاء RLS بشكل سليم من محرك قاعدة البيانات.
