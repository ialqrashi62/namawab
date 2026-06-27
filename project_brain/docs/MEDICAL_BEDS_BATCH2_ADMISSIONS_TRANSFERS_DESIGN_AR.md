# مستند تصميم عزل حركات التنويم والتحويلات - الدفعة الثانية (Admissions & Transfers Design Document)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يقدم هذا المستند التصميم المعماري والأمني التفصيلي لنموذج عزل حركات التنويم والتحويلات للدفعة الثانية (Batch 2 Admissions & Bed Transfers) تحت مظلة عزل المستأجرين (Multi-Tenancy).

---

### 1. نموذج ملكية البيانات (Data Ownership Model)
تُصنف جداول الدفعة الثانية (Admissions, Bed Transfers, Daily Rounds) كجداول **تشغيلية مملوكة بالكامل للمستأجر (Tenant-Owned Operational)**.
- يحتوي كل سجل في هذه الجداول على العمودين `tenant_id` و `branch_id` (أو `facility_id`) لتأكيد التبعية المطلقة لفرع ومستأجر محدد.
- يتم ربط الهويات الطبية بشكل صارم؛ حيث يجب أن ينتمي المريض والسرير وسجل التنويم وحركة النقل لنفس المستأجر لضمان تكامل البيانات ومنع أي تسريب أمني أو عابر للمستأجرين.

### 2. معايير أمان الهوية وتكامل السياق (Context Integrity Standards)
لمنع ثغرات الوصول غير المصرح به (IDOR) وتداخل الفروع، يتوجب على الطبقة البرمجية ونظام قواعد البيانات فرض الضوابط التالية:
1. **تطابق معرف المستأجر (Tenant ID Alignment)**:
   - يمنع تماماً قبول أي عملية تنويم مريض (`admissions`) أو نقل سرير (`bed_transfers`) ما لم يكن `tenant_id` الخاص بالمريض والسرير المستهدف متطابقاً 100% مع `tenant_id` للمستخدم الحالي النشط في الجلسة.
2. **منع خلط الفروع (Cross-Branch Isolation)**:
   - يتم عزل حركات التنويم والتحويلات على مستوى الفرع الفعلي (`branch_id` / `facility_id`).
   - يمنع نقّل المريض أو حجز سرير يقع في فرع آخر أو يتبع مستأجراً آخر، وتتم كافة التحقق المسبق في قاعدة البيانات والـ API.

### 3. سياسات RLS المقترحة (Proposed RLS Policies)
تعتمد حماية قاعدة البيانات مستقبلاً لـ `admissions` و `bed_transfers` و `admission_daily_rounds` على فرض سياسات RLS التالية:
```sql
-- سياسة حماية التنويم (Admissions Policy)
CREATE POLICY admissions_tenant_isolation ON admissions
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::integer)
    WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::integer);

-- سياسة حماية تحويلات الأسرة (Bed Transfers Policy)
CREATE POLICY bed_transfers_tenant_isolation ON bed_transfers
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::integer)
    WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::integer);

-- سياسة حماية الجولات اليومية للأطباء (Daily Rounds Policy)
CREATE POLICY daily_rounds_tenant_isolation ON admission_daily_rounds
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::integer)
    WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::integer);
```

### 4. حماية واجهة التطبيق (Application Layer Hardening)
- يتم سحب `tenant_id` و `facility_id` مباشرة من سياق الطلب الموثق عبر `getRequestTenantContext(req)` وتجاوز أي قيم مرسلة في الـ Request Body لمنع التلاعب البرمجي.
- يتم تفعيل الحظر الصارم وإرجاع `403 Forbidden` في بيئات الإنتاج في حال غياب هوية المستأجر.
- في بيئة التطوير والاختبار، يتم تفعيل الاسترجاع التلقائي (Dev Fallback) لضمان استمرارية تشغيل الاختبارات الأحادية.
