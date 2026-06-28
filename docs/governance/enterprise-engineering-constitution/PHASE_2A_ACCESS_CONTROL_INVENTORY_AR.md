# تقرير جرد وإحصاء التحكم بالوصول لـ PHASE_2A - ميثاق الهندسة المؤسسية

- **FINAL_STATUS**: PASS ✅
- **Phase 2A Baseline**: تم الانتهاء من جرد كافة المنافذ الإدارية والأمنية والطبية الحساسة.

---

## 1. جدول جرد المنافذ الإدارية والأمنية (Administrative & Security Endpoints)

| المنفذ (Route) | الوظيفة (Function) | المصادقة (Auth) | الصلاحية (Role/Perm) | عزل المستأجر (Tenant Guard) | سجل التدقيق (Audit Event) |
|---|---|---|---|---|---|
| `GET /api/settings` | تحميل ثيم وإعدادات المنشأة | requireAuth | الكل (المصادقة فقط) | لا (عالمي) | لا |
| `PUT /api/settings` | تحديث إعدادات الشركة | requireAuth | requireRole('settings') | لا (عالمي) | لا |
| `GET /api/settings/users` | جرد موظفي النظام | requireAuth | requireRole('settings') | لا (عالمي) | لا |
| `POST /api/settings/users` | إنشاء موظف جديد | requireAuth | requireRole('settings') + Admin | لا (عالمي) | محلي (Blocked فقط) |
| `PUT /api/settings/users/:id` | تعديل بيانات موظف | requireAuth | requireRole('settings') / Self | لا (عالمي) | نعم (`UPDATE_USER`) |
| `DELETE /api/settings/users/:id` | حذف موظف من النظام | requireAuth | Admin | لا (عالمي) | لا (فجوة أمنية) |
| `GET /api/audit-trail` | استعلام سجل التدقيق الأمني | requireAuth | requireRole('settings') | نعم (`tenant_id`) | لا (فجوة أمنية) |

---

## 2. جدول جرد المنافذ الطبية الحساسة (Clinical Sensitive Endpoints)

| المنفذ (Route) | الوظيفة (Function) | المصادقة (Auth) | الصلاحية (Role/Perm) | عزل المستأجر (Tenant Guard) | سجل التدقيق (Audit Event) |
|---|---|---|---|---|---|
| `GET /api/problems` | جرد قائمة مشاكل المريض | requireAuth | requireRole('doctor') | نعم | لا |
| `POST /api/problems` | إضافة مشكلة طبية مشفرة | requireAuth | requireRole('doctor') | نعم | نعم (`ADD_PROBLEM`) |
| `GET /api/clinical-notes` | جرد ملاحظات SOAP للمريض | requireAuth | requireRole('doctor') | نعم | لا |
| `POST /api/clinical-notes` | إنشاء ملاحظة SOAP مسودة | requireAuth | requireRole('doctor') | نعم | نعم (`CREATE_SOAP_NOTE`) |
| `POST /api/clinical-notes/:id/sign` | توقيع وقفل ملاحظة SOAP | requireAuth | requireRole('doctor') | نعم | نعم (`SIGN_LOCK_SOAP_NOTE`) |
| `PATCH /api/clinical-notes/:id` | تعديل ملاحظة SOAP مسودة | requireAuth | requireRole('doctor') | نعم | نعم (`UPDATE_SOAP_NOTE`) |
| `POST /api/clinical-notes/:id/amend` | إضافة تعديل مبرر لملاحظة مقفلة | requireAuth | requireRole('doctor') | نعم | نعم (`AMEND_SOAP_NOTE`) |

---

## 3. تصنيف فجوات التحكم بالوصول ومستويات الخطورة (Access Control Gaps)

1. **فجوة [P0]: عدم تدقيق حذف/تعطيل المستخدمين (DELETE Route Audit Gap):**
   - حذف موظف أو تعطيل حسابه لا يسجل أي حدث تدقيق أمني في جدول `audit_trail` مما يعيق التحقيق الجنائي الرقمي عند التخريب.
2. **فجوة [P1]: عدم تدقيق استعلامات سجل التدقيق (Audit Read Exposure):**
   - قراءة السجل الأمني الحساس `GET /api/audit-trail` تتم دون تسجيل حدث تدقيق يوثق هوية من اطلع على الأنشطة الأمنية.
3. **فجوة [P2]: غياب تسجيل محاولات الفشل (Blocked Access logging):**
   - محاولات الوصول غير المصرح بها (403) المرفوضة عبر requireRole أو requirePermission لا تسجل أحداثاً أمنية مما يصعب كشف هجمات التخمين أو التسلل الداخلي.
