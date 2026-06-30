# الدفعة 4D — قرار DDL (GATE 4)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-user-tenant-linkage-integrity`.

## القرار: **NO-DDL**

إغلاق فجوة الربط **لا يتطلّب أي تغيير مخطط**:
- جدول `user_tenants` موجود مع القيد الفريد `uq_user_tenant UNIQUE(user_id, tenant_id)` ([db_postgres.js:1712](../../../namaweb/db_postgres.js#L1712)) — يدعم `ON CONFLICT DO NOTHING` مباشرة.
- الإصلاح منطقي بحت: إضافة `INSERT INTO user_tenants` داخل معاملة مسار إنشاء المستخدم.

| البند | الحالة |
|---|---|
| migration جديد | **لا**. |
| تشغيل e25 | **لا**. |
| schema جديد | **لا** — لو لزم لكانت الدفعة blocked (لم يلزم؛ القيد الفريد قائم). |
| تعديل جداول | **لا**. |

## التأكيد
- لا DDL/migration شُغّل (لا production/staging/local). لا rollback قاعدة بيانات لازم.
