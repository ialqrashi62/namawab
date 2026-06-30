---
name: jumanasoft-multi-tenant-rbac
description: عزل المستأجرين + RBAC + الصلاحيات/التفعيلات في جمانة سوفت — كيف تضيف جدولاً/مساراً معزولاً بأمان.
---

# جمانة سوفت — العزل متعدّد المستأجرين + RBAC

## نموذج العزل (RLS)
- كل جدول حسّاس يحمل `tenant_id INTEGER` + سياسة RLS:
  ```sql
  ALTER TABLE t ENABLE ROW LEVEL SECURITY;
  ALTER TABLE t FORCE  ROW LEVEL SECURITY;
  CREATE POLICY rls_t_tenant ON t
    USING      (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
  GRANT SELECT,INSERT,UPDATE,DELETE ON t TO nama_medical_app;
  ```
- `app.tenant_id` يُضبط لكل طلب عبر `tenantStore` (AsyncLocalStorage) + pool مُرقَّع. الدور `nama_medical_app`: super=false, bypassrls=false.
- **اختم `tenant_id` من الجلسة (`getRequestTenantContext`) لا من الجسم** — منع IDOR/التزوير.
- أثبت العزل: ctx=A → بيانات A فقط؛ ctx مجهول → 0؛ كتابة عبر مستأجر آخر → 42501.

## طبقات RBAC
1. **legacy**: `requireRole(...roles)` — حارس سريع على المسار.
2. **matrix (fail-closed)**: `requirePermission` من مصفوفة DB — المصدر الرسمي للصلاحيات الدقيقة.
- حماية P0: إنشاء/تعديل/حذف مستخدمي النظام + ترقية Admin محروسة.

## التفعيلات / أعلام الميزات (Entitlements)
- `facility_entitlements` / وحدات الميزات تحدّد ما يُتاح لكل منشأة/مستأجر.
- في SaaS: اربط الميزات بالـ **خطة** (`plan_features`) → التفعيل يُشتقّ من الاشتراك. راجع [[jumanasoft-billing-payments]].
- نمط الفحص: `requireEntitlement('module')` middleware fail-closed (يرجع 403 + code عند غياب التفعيل).

## وصفة إضافة مورد معزول جديد (checklist)
1. جدول + `tenant_id` + RLS (أعلاه) + grants.
2. هجرة `eNN_*_{up,down,validate}.sql` + تحقّق معزول (G9).
3. مسار: `requireAuth, requireRole/requirePermission, requireTenantScope, [validateBody], [idemGuard], handler`.
4. اختم tenant_id من الجلسة في الكتابة؛ صفِّ القراءة بالـ RLS (لا WHERE يدوي للمستأجر إلا دفاعاً مزدوجاً).
5. audit للطفرة. اختبار cross-tenant (نمط `cross_tenant_*_test.js`).

> راجع [[jumanasoft-global-gates]] G1/G5 و [[jumanasoft-security-audit]].
