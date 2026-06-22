# PHASE 5 — تسليم الأمن والامتثال

> 2026-06-22 | حالة أمنية للتسليم.

## وضع العزل (RLS)
- **148 جدول FORCE RLS** + سياسة لكل منها + DEFAULT tenant_id؛ 0 فجوة (مملوءة + خاملة مغلقة).
- التطبيق يتصل كـ`nama_medical_app` (**rolsuper=false, rolbypassrls=false**) ⇒ least privilege؛ RLS مفروض على مسار التطبيق (مُثبَت: ctx1→بيانات، ctx999→0، بلا سياق→0).

## RBAC (حراسات منشورة)
- `system_users`: POST(Admin)/PUT(privilege guard)/DELETE(Admin).
- `employees`: POST/DELETE → requireRole('hr')؛ GET مفتوح (قوائم).
- `daily_close`: RLS مفعّل.
- 366/371 مسار requireAuth؛ **0 ثقة بمستأجر من body/query**.

## الخصوصية
- PHI كله تحت FORCE RLS؛ لا تسريب عبر المستأجرين. مالية معزولة. لا أسرار في الكود/التقارير. .env غير مُلتزَم.

## التدقيق (audit)
- `audit_trail` FORCE RLS + append-only؛ logAudit يختم tenant من ALS. أحداث: LOGIN، BLOCKED_USER_CREATE، BLOCKED_PRIVILEGE_ESCALATION، CREATE/DELETE_EMPLOYEE...
- **audit-reader**: `nama_audit_reader` NOLOGIN/NOSUPER/NOBYPASSRLS، **غير ممنوح** (candidate جاهز، gated).

## الامتثال
- عربي UTF-8 نظيف (لا mojibake). ZATCA: حقول الفاتورة حاضرة. NPHIES/MOH: مرجع MEDICAL_HEALTHCARE_COMPLIANCE_SAUDI skill.

```text
SECURITY_COMPLIANCE_HANDOVER: READY
RESIDUAL: audit-reader GRANT (gated); accounting OFF
```
