# تحديث ذاكرة المشروع (Project Memory Update)

## التغييرات الجوهرية والقرارات المعمارية
1. **أدوار التوقيع السريري (EMR Signature Roles)**:
   - تم قصر قفل وتوقيع السجلات الطبية التابعة للأطباء (`Physician EMR`) على الأدوار المصرحة (`Doctor`, `OB/GYN`, `Neonatologist`, `Pathologist`, `Radiologist`, `Admin`).
   - لا يُسمح للتمريض (`Nurse`) بتوقيع أو قفل سجلات الأطباء؛ وإنما يُسمح لهم فقط بتوقيع وتقييم ملفات الرعاية والتقييمات التمريضية مثل (Braden, Morse, APGAR, Count Sheets).
2. **صلاحيات الإجراءات (Action-Level RBAC)**:
   - تم تفعيل حراس الصلاحيات الحساسة باستخدام `requirePermission('or:cancel')` و `requirePermission('invoices:cancel')` و `requirePermission('messages:delete')`.
3. **توزيع ملاك الأقسام الطبية**:
   - تم ربط الأقسام الطبية بمالك القرار المناسب (`owner_role`):
     - الأقسام السريرية والعيادات -> `CMO`
     - أقسام التنويم والتمريض -> `CNO`
     - أقسام العمليات والنقل -> `COO`
     - أقسام الفوترة والمالية -> `CFO`
     - أقسام الإعدادات والصيانة -> `CIO`
