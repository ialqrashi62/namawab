-- ============================================================================
-- WARNING: DO NOT EXECUTE - DESIGN ONLY
-- مسودة تصميم هجرة وتعبئة معرف المستأجر (Tenant ID Backfill Design Draft)
-- نظام نما الطبي - تأمين وحوكمة قواعد البيانات الطبية
-- ============================================================================

/*
--------------------------------------------------------------------------------
1. مقترح جدول الأدوية والمخزون (Medications & Inventory Schema Redesign Proposal)
--------------------------------------------------------------------------------

أ. خيار فصل المخزون عن كتالوج الأدوية (الخيار الموصى به):
------------------------------------------------------
-- أ.1 إنشاء جدول المخزون المخصص للمستأجرين
CREATE TABLE IF NOT EXISTS public.medication_stock (
    id SERIAL PRIMARY KEY,
    medication_id INTEGER NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL,
    branch_id INTEGER NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- أ.2 ترحيل حقل المخزون والأسعار الحالي من medications إلى الجدول الجديد للمستأجر الأول (tenant_id = 1)
INSERT INTO public.medication_stock (medication_id, tenant_id, branch_id, stock_quantity, price)
SELECT id, 1, 1, stock_quantity, price FROM public.medications;

-- أ.3 حذف حقول المخزون والأسعار من جدول medications العام
ALTER TABLE public.medications DROP COLUMN IF EXISTS stock_quantity;
ALTER TABLE public.medications DROP COLUMN IF EXISTS price;

-- أ.4 تفعيل RLS على جدول المخزون الجديد
ALTER TABLE public.medication_stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY rls_med_stock_tenant_isolation ON public.medication_stock
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);


ب. خيار إضافة tenant_id مباشرة إلى medications (الخيار الهجين):
--------------------------------------------------------------
-- ب.1 إضافة الحقل كعمود يقبل قيم فارغة
ALTER TABLE public.medications ADD COLUMN IF NOT EXISTS tenant_id INTEGER;

-- ب.2 تعبئة معرف المستأجر لبيانات المخزون الحالية محلياً (المستأجر 1)
UPDATE public.medications SET tenant_id = 1 WHERE tenant_id IS NULL;

-- ب.3 تفعيل RLS هجين (يسمح برؤية الأدوية العامة والأدوية الخاصة بالمستأجر)
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY rls_medications_hybrid_isolation ON public.medications
    FOR ALL
    USING (
        tenant_id IS NULL OR 
        tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer
    )
    WITH CHECK (
        tenant_id IS NULL OR 
        tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer
    );
*/


/*
--------------------------------------------------------------------------------
2. مقترح تعديل وهجرة جدول عينات المختبر (Lab Samples Migration Proposal)
--------------------------------------------------------------------------------

-- أ. إضافة عمود tenant_id إلى جدول عينات المختبر
ALTER TABLE public.lab_samples ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE public.lab_samples ADD COLUMN IF NOT EXISTS branch_id INTEGER;

-- ب. إنشاء فهرس لتحسين كفاءة البحث والعزل
CREATE INDEX IF NOT EXISTS idx_lab_samples_tenant ON public.lab_samples (tenant_id, branch_id);

-- ج. سكربت هجرة وتعبئة البيانات (Backfill Migration Update)
-- يتم اشتقاق معرف المستأجر من جدول طلبات المختبر المرتبط
UPDATE public.lab_samples s
SET tenant_id = o.tenant_id,
    branch_id = o.branch_id
FROM public.lab_radiology_orders o
WHERE s.order_id = o.id AND s.tenant_id IS NULL;

-- د. تفعيل RLS على جدول عينات المختبر بعد هجرة البيانات
ALTER TABLE public.lab_samples ENABLE ROW LEVEL SECURITY;

CREATE POLICY rls_lab_samples_tenant_isolation ON public.lab_samples
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
*/


/*
--------------------------------------------------------------------------------
3. استعلامات التحقق والتدقيق بعد التعبئة (Post-Backfill Validation Queries)
--------------------------------------------------------------------------------

-- أ. التحقق من عدم وجود أي سجلات عينات مختبر بدون tenant_id
SELECT COUNT(*) as orphan_samples FROM public.lab_samples WHERE tenant_id IS NULL;

-- ب. التحقق من توزيع السجلات بين المستأجرين في جدول المخزون المكتوب حديثاً
SELECT tenant_id, COUNT(*) FROM public.medication_stock GROUP BY tenant_id;
*/


/*
--------------------------------------------------------------------------------
4. خطة التراجع المقترحة في حال الفشل (Rollback Design Considerations)
--------------------------------------------------------------------------------

-- في حال حدوث خطأ أو انكسار في تدفق المختبر أو الصيدلية:
-- أ. تعطيل RLS وحذف السياسات المضافة حديثاً
ALTER TABLE public.lab_samples DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_lab_samples_tenant_isolation ON public.lab_samples;

-- ب. حذف الأعمدة المضافة لجدول عينات المختبر
ALTER TABLE public.lab_samples DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE public.lab_samples DROP COLUMN IF EXISTS branch_id;

-- ج. إعادة هيكل الأدوية والأسعار لوضعه السابق (في حال تطبيق خيار فصل المخزون)
-- ALTER TABLE public.medications ADD COLUMN IF NOT EXISTS stock_quantity INTEGER;
-- ALTER TABLE public.medications ADD COLUMN IF NOT EXISTS price REAL;
-- UPDATE public.medications m SET stock_quantity = s.stock_quantity, price = s.price FROM public.medication_stock s WHERE s.medication_id = m.id;
-- DROP TABLE IF EXISTS public.medication_stock;
*/
