# NM_HR_WORKFORCE_ACCESS — الموارد البشرية والصلاحيات وإدارة القوى العاملة

## متى تُستخدم
أي ميزة تمس الموظفين، الأدوار، الصلاحيات، الحضور، الجداول، أو إدارة الدخول.

## الهدف
ضمان أن كل موظف يملك الصلاحيات الدنيا اللازمة فقط، مع audit trail كامل.

## قواعد إلزامية
```
LEAST_PRIVILEGE: YES — كل مستخدم يملك الحد الأدنى من الصلاحيات
ROLE_SEPARATION: YES — أدوار واضحة ومنفصلة (طبيب/ممرض/صيدلاني/تقني/إداري)
JOINING_WORKFLOW: YES — إجراء توثيق عند تعيين موظف جديد
LEAVING_WORKFLOW: YES — إلغاء كل الصلاحيات فور مغادرة الموظف
SHIFT_MANAGEMENT: YES — جدولة الورديات مع منع تعارض الجداول
ATTENDANCE_AUDIT: YES — تسجيل الحضور والغياب موثّق
NO_CROSS_TENANT_STAFF: YES — موظف لا يظهر إلا في مستشفاه
SECURE_PASSWORD_RESET: YES — إعادة تعيين كلمة المرور تحتاج موافقة إدارية
```

## الأدوار المعرّفة
```
super_admin: إدارة كل المستأجرين (منفصل تماماً)
admin: إدارة مستشفى واحد
doctor: طبيب — يرى مرضاه فقط
nurse: ممرض — يرى مرضى قسمه فقط
pharmacist: صيدلاني — الصيدلية فقط
lab_tech: تقني مختبر
radiology_tech: تقني أشعة
receptionist: استقبال
accountant: محاسب
hr_officer: موارد بشرية
```

## خطوات التنفيذ
1. تحقق من جدول users يحمل `tenant_id` و`role`
2. تحقق من وجود `requireRole()` guard على كل endpoint حساس
3. تحقق من أن تعديل صلاحية موظف يُسجَّل في audit_logs
4. اختبر وصول كل دور للـ endpoints غير المخوّل لها → 403
5. تحقق من أن تعطيل حساب موظف يمنع الدخول فوراً

## أدلة النجاح
- كل user record يحمل tenant_id, role, is_active
- محاولة وصول غير مخوّل تُعيد 403
- audit log يسجل كل تغيير في الصلاحيات مع admin_id
- حساب معطّل لا يستطيع تسجيل الدخول

## حالات الحظر
- مستخدم بدون tenant_id → BLOCKED_USER_NO_TENANT
- endpoint حساس بدون role guard → BLOCKED_MISSING_ROLE_GUARD
- إعادة تعيين كلمة مرور بدون audit → BLOCKED_INSECURE_PASSWORD_RESET

## صيغة التقرير المختصر
```
HR_GATE: PASS/BLOCKED | ROLES_DEFINED: N | ROLE_GUARDS_OK: N
LEAST_PRIVILEGE: YES/NO | AUDIT_TRAIL: YES/NO
TENANT_ISOLATION: YES/NO | JOINING_WORKFLOW: YES/NO
```
