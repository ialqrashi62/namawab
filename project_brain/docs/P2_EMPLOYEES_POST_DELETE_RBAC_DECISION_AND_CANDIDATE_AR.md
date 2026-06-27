# PHASE 2 — قرار RBAC لإنشاء/حذف الموظفين (منشور)

> 2026-06-22 | code-only، منشور بعد اختبار. لا DDL/DATA/GRANT.

## القرار
- **GET `/api/employees`** يبقى مفتوحاً (requireAuth فقط): يغذّي قوائم الأطباء المنسدلة في شاشات كثيرة (الحجز/العمليات/المريض). تقييده يكسر سير العمل السريري. كشف الراتب هنا **داخل المستأجر فقط** (RLS يمنع عبر المستأجرين؛ employees جدول FORCE RLS).
- **POST `/api/employees`** و**DELETE `/api/employees/:id`** ⇐ **`requireRole('hr')`** (يمرّ HR + Admin='*'). إنشاء/حذف الموظف عملية HR/Admin بحكم تعليمات المالك في هذه البوابة.
- **لا PUT/PATCH** لهذا المسار (تحقّقت — غير موجود).
- **audit**: أُضيف `CREATE_EMPLOYEE` و`DELETE_EMPLOYEE` على النجاح.

## الاختبار + النشر
- `employees_rbac_guard_test.js` = 6/6 PASS (GET مفتوح؛ POST/DELETE مقيّدان؛ audit حاضر)؛ `node --check` OK.
- نشر pm2 restart: health 5/5؛ **unauth POST=401، unauth DELETE=401**؛ عزل سليم (patients 3/0، FORCE=147).
- namaweb `ae539b2→bc24a47` مدفوع FF إلى `origin/main`.

## الحالة
```text
FINAL_STATUS: EMPLOYEES_POST_DELETE_RBAC_CODE_DEPLOYED_PASS
GET_EMPLOYEES: open (requireAuth) — by design (doctor lists)
POST/DELETE_EMPLOYEES: requireRole('hr') (HR+Admin) + audit — DEPLOYED
DDL/DATA/GRANT: NO   tenant trust from body/query: NONE
```
