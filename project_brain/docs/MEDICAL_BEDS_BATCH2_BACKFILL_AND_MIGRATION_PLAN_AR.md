# خطة الهجرة والتعبئة وتفعيل RLS المستقبلي - الدفعة الثانية (Backfill & Migration Plan)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يقدم هذا التقرير خطة العمل المستقبلية للهجرة البرمجية وتعبئة بيانات المستأجرين (Backfill) وتفعيل سياسات التحكم بالوصول على مستوى الصف لجدولي التنويم والتحويلات.

---

### 1. خطة الهجرة التدريجية والتحكم في البيئة (Gradual Deployment Plan)
لضمان عدم حدوث أي انقطاع في الخدمة أو تداخل للبيانات، يوصى بالتقسيم الآتي للعمل في المراحل القادمة:
1. **المرحلة الأولى: تعبئة البيانات التاريخية (Backfill Phase)**:
   - تحديد السجلات التاريخية التي تفتقر لمعرف المستأجر (`tenant_id`) وتعيين المعرف المناسب لها بناءً على علاقات المرضى أو الفروع.
   - تشغيل هجرة برمجية غير مدمرة تحافظ على الأعمدة **Nullable** لتجنب توقف خادم التطبيق النشط.
2. **المرحلة الثانية: تفعيل RLS على Staging (Staging RLS Phase)**:
   - تفعيل سياسات RLS وقواعد الحماية على بيئة Staging خاضعة للتحكم أولاً للتحقق من سلامة كافة الاستعلامات وتكاملها.
3. **المرحلة الثالثة: التفعيل على خادم الإنتاج (Production Enablement)**:
   - تفعيل RLS النهائي وإصدار أدوار الاتصال المقيدة للمستأجرين في بيئة الإنتاج الفعلي.

### 2. سكربت الهجرة والتعبئة المستقبلي المقترح (Proposed Migration SQL)
```sql
-- خطة هجرة آمنة لجدول admissions وتعبئة البيانات الافتراضية
-- 1. التأكد من ختم السجلات القديمة بـ tenant_id = 1 و branch_id = 1 في حال خلوها
UPDATE admissions 
SET tenant_id = 1, facility_id = 1 
WHERE tenant_id IS NULL OR facility_id IS NULL;

-- 2. التأكد من ختم سجلات تحويلات الأسرة التاريخية
UPDATE bed_transfers 
SET tenant_id = 1, branch_id = 1 
WHERE tenant_id IS NULL OR branch_id IS NULL;

-- 3. تفعيل القيود المطلوبة مستقبلاً (بعد اكتمال التعبئة 100%)
-- ALTER TABLE admissions ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE bed_transfers ALTER COLUMN tenant_id SET NOT NULL;
```

### 3. سيناريوهات التراجع السريع (Rollback Strategy)
في حال رصد أي خلل أو انخفاض في الأداء بعد التفعيل المستقبلي، يتوفر سكربت تراجع آمن لإلغاء RLS فوراً وإرجاع الجداول لحالتها الطبيعية:
```sql
-- سكربت التراجع السريع المقترح للدفعة الثانية (Rollback SQL)
ALTER TABLE admissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE bed_transfers DISABLE ROW LEVEL SECURITY;
ALTER TABLE admission_daily_rounds DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admissions_tenant_isolation ON admissions;
DROP POLICY IF EXISTS bed_transfers_tenant_isolation ON bed_transfers;
DROP POLICY IF EXISTS daily_rounds_tenant_isolation ON admission_daily_rounds;
```
