# HOS_PRO_05_RBAC_PRIVACY_AUDIT_AR

## الغرض
بناء RBAC Matrix احترافية تمنع خلط الصلاحيات السريرية والإدارية وتضمن الخصوصية والتدقيق.

## الأدوار الأساسية
- Super Admin.
- Hospital Admin.
- CMO.
- CNO.
- COO.
- CFO.
- CIO.
- Department Manager.
- Consultant.
- Specialist.
- Doctor.
- Resident.
- Nurse.
- Charge Nurse.
- Head Nurse.
- Pharmacist.
- Clinical Pharmacist.
- Lab Technician.
- Lab Specialist.
- Radiology Technician.
- Radiologist.
- Pathologist.
- Receptionist.
- Appointment Coordinator.
- Billing Officer.
- Insurance Officer.
- Medical Coder.
- Medical Records Officer.
- Quality Officer.
- Infection Control Officer.
- Risk Officer.
- Social Worker.
- Dietitian.
- Physiotherapist.
- CSSD Technician.
- Inventory Officer.
- Maintenance Officer.
- Auditor.
- Patient Portal User.

## الصلاحيات
Read, Create, Update, Approve, Cancel, Soft Delete, Print, Export, View Sensitive Data, Override, Assign, Close, Audit Access.

## قواعد منع الخلط
- الطبيب لا يملك صلاحيات فوترة إلا عرض محدود عند الحاجة.
- التمريض لا يعدل التشخيص النهائي.
- الصيدلية لا تغير التشخيص.
- الصيدلية تراجع الوصفة والتداخلات والحساسية والجرعات.
- المختبر لا يعدل أمر الطبيب.
- الأشعة لا تعدل أمر الطبيب.
- الفوترة لا تعدل الأوامر الطبية.
- التأمين لا يعدل السجل السريري.
- الإداري لا يملك صلاحيات سريرية إلا في نطاق إداري واضح.
- المريض لا يرى نتائج غير معتمدة إذا السياسة تمنع ذلك.
- كل وصول حساس يجب أن يسجل Audit Log.

## خصوصية وAudit
لكل عملية حساسة حدد:
- Who accessed?
- What changed?
- When?
- From where?
- Reason if required.
- Before/After values if safe.
- Patient/Encounter reference.
- Tenant reference if SaaS.

## المخرجات
- RBAC Matrix.
- Sensitive Access Matrix.
- Audit Event Catalog.
- Over-Permission Risks.
- Segregation of Duties Risks.

## ملف التقرير
احفظ في:
.ai-brain/hospital-rbac-privacy-audit-ar.md
