# تقرير PHASE 2B — حُرّاس RBAC للتدقيق + مسارات PHI الثانوية (H-6/H-7)

**الفرع:** audit/phase-1-critical-remediation
**النطاق:** H-6 (audit-trail) + H-7 (cosmetic/social-work/mortuary + employees-GET field filtering).
**القيود:** لا DDL/DB writes/production/deploy/push/أسرار/PHI/history rewrite.

## 1. المشكلة
- H-6: GET /api/audit-trail كان requireAuth فقط + SELECT * بلا فلتر tenant → أي مستخدم يقرأ سجل التدقيق لكل العملاء.
- H-7: cosmetic ×8 + social-work ×3 + mortuary ×3 كانت requireAuth فقط → أي دور يصل بيانات مرضى حساسة. و GET /api/employees يستخدم SELECT * يتضمّن salary → تسريب رواتب.

## 2. الحُرّاس قبل/بعد
| المسار | قبل | بعد |
|---|---|---|
| /api/audit-trail | requireAuth | requireRole('settings') + requireTenantScope + predicate tenant_id صريح + clamp limit |
| /api/cosmetic/* (×8) | requireAuth | requireRole('doctor','surgery') + requireTenantScope |
| /api/social-work/* (×3) | requireAuth | requireRole('him','nursing') + requireTenantScope |
| /api/mortuary/* (×3) | requireAuth | requireRole('him','nursing') + requireTenantScope |
| /api/employees GET | requireAuth + SELECT * | requireAuth (مفتوح) + field projection حسب الدور |
| /api/employees POST/DELETE | requireRole('hr') | بلا تغيير |

### الأدوار ولماذا (وحدات موجودة، بلا توسيع صلاحيات)
- audit-trail → settings (IT+Admin = مشغّلو نظام/أمن)؛ يمنع كل الأدوار السريرية/المالية.
- cosmetic → doctor/surgery (Doctor/OB-GYN+Admin).
- social-work/mortuary → him/nursing (HIM/تمريض/طبيب+Admin)؛ يمنع المختبر/الصيدلية/المالية/التأمين.
- دور غير معروف → 403 (fail-closed).

## 3. employees-GET — التعارض وقرار المالك (OPTION_C)
- التعارض: قرار سابق مُلتزَم (bc24a47 + اختبار + تعليق) أبقى GET مفتوحاً عمداً لقوائم الطاقم، لكن SELECT * يسرّب salary.
- قرار المالك OPTION_C_FIELD_FILTERING: GET يبقى مفتوحاً (لا تغيير middleware → لا تعارض)، والفلترة داخل المعالج.
- لماذا لم نُغلق GET؟ يكسر dropdowns الطاقم/الأطباء + يتعارض مع قرار مُلتزَم.
- لماذا لم نُبقِ SELECT *؟ يسرّب الرواتب لأي مستخدم.
- التطبيق: helper isHrOrAdmin(user) + ثابت EMPLOYEE_DIRECTORY_COLS:
  - HR/Admin → SELECT * (صفحة HR تعمل).
  - غيرهم → id, name, name_ar, name_en, role, department_ar, department_en, status, created_at.
  - المحجوب عن غير HR/Admin: salary, commission_type, commission_value.
  - cols ثابت خادمي (لا إدخال عميل → لا حقن)؛ فلتر role معاملي.
- tenant: جدول employees بلا tenant_id (موثَّق؛ عزله = H-9 منفصل خارج النطاق).

## 4. الاختبارات
- rbac_phi_guard_test.js (مُوسَّع): 76 حالة (منع أدوار خاطئة سلوكياً + تأكيد ساكن + field-filtering: HR/Admin يرون salary؛ 7 أدوار محجوبة؛ الإسقاط يستثني salary/commission ويضمّ الحقول الآمنة؛ GET يستخدم isHrOrAdmin + الإسقاط).
- employees_rbac_guard_test.js (بلا تعديل): أخضر — GET ما زال بلا requireRole.
- npm test: 91/91. node --check: OK. secret scans: CLEAN. git diff --check: نظيف.
- لا PHI/salary في الأخطاء/السجلات (نمط {error:'Server error'} العام).

## 5. خارج النطاق
- H-5 GL خارج النطاق صراحةً (ACCOUNTING_POSTING OFF، journal=0).
- H-9/H-10 (tenant_id employees/system_users + RLS migration) منفصل.
- لا production/DB/DDL/deploy/push. تدوير أسرار C-1/C-1B لا يزال إجراء مالك مطلوباً.
