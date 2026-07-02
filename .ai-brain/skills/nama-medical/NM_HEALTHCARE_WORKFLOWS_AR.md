# NM_HEALTHCARE_WORKFLOWS — سير عمل أقسام نظام الطبيب

## متى تُستخدم
أي ميزة سريرية أو إدارية أو تشغيلية تمس أي قسم من أقسام المستشفى.

## الهدف
ضمان أن كل قسم يتبع السير الوظيفي الصحيح مع الصلاحيات المناسبة وتكامل البيانات.

## الأقسام المشمولة
```
OUTPATIENT: عيادات خارجية — مواعيد، كشف، وصفة، تقرير
EMERGENCY: طوارئ — تريدج، كشف سريع، إحالة، تسريح
INPATIENT: تنويم — قبول، نقل، خطة علاج، تسريح
NURSING: تمريض — تقييم، MAR، علامات حيوية، ملاحظات
EMR_EHR: سجلات طبية — تاريخ، تشخيص، مستندات، موافقة
LABORATORY: مختبر — طلب، عينة، نتيجة، مراجعة
RADIOLOGY: أشعة — طلب، جلسة، تقرير، PACS
PHARMACY: صيدلية — وصفة، مراجعة، صرف، مخزون
SURGERY_OR: عمليات — جدولة، موافقة، تخدير، تقرير جراحي
ICU: عناية مركزة — مراقبة، تنفس، تدخل، نقل
DENTAL: أسنان — فحص، خطة علاج، تدخل، رسم الأسنان
PHYSIOTHERAPY: علاج طبيعي — تقييم، خطة، جلسة، تقدم
OBGYN: نساء وتوليد — حمل، سونار، ولادة، فترة نفاس
PEDIATRICS: أطفال — تطعيم، نمو، تطور، رسائل والدين
INSURANCE: تأمين — موافقة مسبقة، مطالبة، رفض، استئناف
BILLING: فوترة — فاتورة، سداد، تقسيط، تسوية
ADMIN: إدارة — لوحة تحكم، تقارير، إحصاء، تدقيق
```

## قواعد إلزامية
```
ROLE_BASED_ACCESS: YES — كل دور يرى ما يخصه فقط
TENANT_ISOLATION: YES — بيانات كل مستشفى معزولة
AUDIT_TRAIL: YES — كل تغيير موثّق في audit_logs
CLINICAL_DISCLAIMER: YES — النظام دعم قرار، لا قرار نهائي
NO_PHI_IN_LOGS: YES — لا بيانات مرضى في السجلات
NO_AUTO_PRESCRIBE: YES — لا وصف دواء تلقائي بدون طبيب
CONSENT_REQUIRED: YES — الموافقة مطلوبة للإجراءات الكبرى
```

## خطوات التنفيذ
1. حدد القسم المستهدف من القائمة أعلاه
2. حدد الدور المنفّذ (طبيب / ممرض / صيدلاني / تقني / إداري)
3. تحقق من وجود RLS policy للجداول المرتبطة
4. تحقق من وجود role guard في API endpoint
5. تحقق من وجود audit log لكل write operation
6. اختبر الوظيفة بمستخدم صحيح ومستخدم خاطئ

## أدلة النجاح
- كل API endpoint محمي بـ `requireRole()`
- كل جدول محمي بـ RLS policy
- Audit log يسجل الكاتب والوقت والقسم
- اختبار دور خاطئ يُعيد 403

## حالات الحظر
- endpoint بدون role guard → BLOCKED_MISSING_ROLE_GUARD
- جدول بيانات سريرية بدون RLS → BLOCKED_CLINICAL_TABLE_NO_RLS
- وصف دواء تلقائي بدون طبيب → BLOCKED_AUTO_PRESCRIBE_VIOLATION

## صيغة التقرير المختصر
```
WORKFLOW_GATE: PASS/BLOCKED | DEPARTMENT: [name] | ROLE: [name]
endpoints_checked: N | role_guards_ok: N | missing_guards: N
rls_tables_ok: N | audit_log_verified: YES/NO
clinical_disclaimer_present: YES/NO
```
