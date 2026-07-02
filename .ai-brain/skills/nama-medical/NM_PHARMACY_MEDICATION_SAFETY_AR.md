# NM_PHARMACY_MEDICATION_SAFETY — سلامة الصيدلية والدواء

## متى تُستخدم
أي ميزة تمس الوصفات الطبية، صرف الأدوية، مخزون الصيدلية، أو تنبيهات الأدوية.

## الهدف
ضمان سير عمل آمن للصيدلية مع تنبيهات تفاعل الأدوية والحساسية كمتطلبات نظامية، لا كقرار طبي نهائي.

## قواعد إلزامية
```
PHARMACIST_APPROVAL: YES — كل صرف يحتاج مراجعة صيدلاني
DDI_ALERTS_AS_SYSTEM_REQUIREMENTS: YES — تنبيهات التفاعل متطلب نظامي، لا قرار علاجي
DAI_ALLERGY_CHECK: YES — فحص الحساسية إلزامي
AUDIT_DISPENSING: YES — كل صرف موثّق بـ pharmacist_id و timestamp
CONTROLLED_SUBSTANCES: YES — أدوية المخدرات تحتاج صلاحية مضاعفة
NO_AUTO_DISPENSE: YES — لا صرف تلقائي بدون مراجعة
TENANT_ISOLATION: YES — مخزون كل مستشفى معزول
CLINICAL_DISCLAIMER: YES — النظام دعم قرار صيدلاني، لا قرار نهائي
```

## خطوات التنفيذ
1. تحقق من وجود pharmacist role guard على endpoints الصرف
2. تحقق من تشغيل DDI check عند إضافة دواء جديد
3. تحقق من تشغيل allergy check قبل الصرف
4. تحقق من تسجيل audit log لكل صرف
5. اختبر محاولة صرف بدون صلاحية صيدلاني → 403
6. اختبر تنبيه تداخل دواء → يظهر التنبيه

## CDS Rules (Clinical Decision Support)
```
DDI_CRITICAL: حظر مع طلب سبب تجاوز من الصيدلاني
DDI_WARNING: تنبيه مع إمكانية المتابعة
DAI_ALLERGY: حظر مع طلب مراجعة طبيب
DOSE_RANGE: تنبيه عند خروج الجرعة عن النطاق الآمن
```

## أدلة النجاح
- `/api/pharmacy/queue/:id/verify` محمي بـ `requireRole('pharmacy')`
- DDI/DAI alerts تظهر عند تحريك الوصفة
- audit log يسجل verified_by و verified_at
- مخزون الصيدلية معزول بـ tenant_id

## حالات الحظر
- صرف بدون مراجعة صيدلاني → BLOCKED_DISPENSE_WITHOUT_PHARMACIST
- لا DDI check → BLOCKED_MISSING_DDI_CHECK
- بيانات مخزون بدون tenant_id → BLOCKED_INVENTORY_NO_TENANT

## صيغة التقرير المختصر
```
PHARMACY_GATE: PASS/BLOCKED | PHARMACIST_GUARD: YES/NO
DDI_ENABLED: YES/NO | DAI_ENABLED: YES/NO
DISPENSE_AUDITED: YES/NO | TENANT_ISOLATED: YES/NO
clinical_disclaimer: YES/NO
```
