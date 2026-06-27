# P1 — تحليل مسار الاسترداد المعرّض (Refund Flow Analysis)

> المرحلة: `P1_REFUND_IDOR_TENANT_GUARD_CODE_FIX` — البوابة 1 | التاريخ: 2026-06-21 | فحص كود.

## المسار: `POST /api/invoices/:id/refund` (server.js ~6472)

### الحالة قبل الإصلاح
| Query/Step | Current Behavior | Tenant Guard? | Risk | Required Fix |
| ---------- | ---------------- | :-----------: | ---- | ------------ |
| middleware | `requireAuth, requireRole('invoices','accounts')` | جزئي (لا tenant scope) | **P1** | إضافة `requireTenantScope` |
| قراءة الفاتورة | `SELECT * FROM invoices WHERE id=$1` (id فقط) | **لا** | **P1 IDOR** | فلتر `AND tenant_id=$2` |
| فحص الوجود | `if (!invoice) 404` | — | منخفض | يبقى (404 لا يكشف الوجود) |
| `pctx.tenantId` | `invoice.tenant_id \|\| tenantId` (من الفاتورة) | يُشتقّ من فاتورة قد تخصّ غير المستأجر | متوسط | يصبح `tenantId` المُتحقَّق بعد الفلتر |
| INSERT الاسترداد | داخل `runEventWithPosting` (flag-governed) | يختم tenant_id من pctx | منخفض | لا تغيير منطقي (يبقى OFF/لا journal) |
| `postRefund` (doPost) | يُستدعى فقط عند `isEnabled()` | — | منخفض (OFF) | لا تغيير |

### جذر الثغرة
بما أن التطبيق يتصل بدور `postgres` (superuser يتجاوز RLS — انظر `P1_RLS_COVERAGE_RECONCILIATION_R1`)، فإن `WHERE id=$1` بلا فلتر tenant يسمح لمستخدم مستأجر A باسترداد فاتورة مستأجر B (إنشاء قيد استرداد سالب في بيانات B) = **IDOR قابل للاستغلال (R22)**. RLS لا يحمي حالياً.

### مقارنة بمسارات شقيقة (نمط مُثبت)
مسارا `pay` (1729) و`cancel` (5596) يتحقّقان من ملكية tenant قبل التعديل؛ مسار `refund` كان الوحيد بلا تحقّق ⇒ الإصلاح يوائمه (بل أصرم: `requireTenantScope` + فلتر إلزامي).

```text
GATE1_STATUS: FLOW_ANALYSIS_COMPLETE
ROOT_CAUSE: id-only lookup + RLS bypassed (superuser) → cross-tenant refund
NEXT: GATE2_CODE_FIX
```

`REFUND_IDOR_FLOW_ANALYSIS_COMPLETE`
