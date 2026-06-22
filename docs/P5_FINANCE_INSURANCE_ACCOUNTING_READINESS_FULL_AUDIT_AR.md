# PHASE 5 — تدقيق المالية/التأمين/جاهزية المحاسبة

> 2026-06-22 | لا تفعيل محاسبة. تحقّق حيّ.

## الدورة الإيرادية (RLS مفروض)
| المكوّن | RLS | RBAC | ملاحظة |
|---|---|---|---|
| invoices | ✅ FORCE | requireRole('invoices','accounts') | ختم صريح؛ refund محصّن (requireTenantScope) سابقاً |
| receipts/payments | ✅ (ضمن invoices/finance) | requireRole | — |
| refunds | ✅ | requireTenantScope | محصّن |
| insurance_claims/companies/contracts | ✅ FORCE | requireRole | — |
| cash_drawer | user-scoped | requireAuth | بالتصميم (Batch A) |
| **daily_close** | ⚠ بلا RLS، **0 صف** | requireRole | فجوة خاملة — مرشّح مُرهَّن PASS، gated |
| finance_* (cost_centers/fiscal_years/CoA) | ✅ FORCE | requireRole | — |
| ZATCA | ✅ FORCE | requireRole | حقول الفاتورة حاضرة |

## المحاسبة (OFF)
- `journal_entries` غير موجود (42P01) ⇒ **JOURNAL_COUNT=0**، لا محرّك ترحيل مُفعَّل.
- posting engine + CoA + idempotency + VAT/ZATCA = مرشّحات مُختبَرة معزولة (63/63 سابقاً)، غير منشورة. rollback جاهز.

## الحالة
```text
ACCOUNTING_POSTING_ENABLED: OFF   JOURNAL_COUNT: 0
POSTING_ENABLEMENT: BLOCKED_PENDING_ACCOUNTING_APPROVAL
DAILY_CLOSE_ROWS: 0   DAILY_CLOSE_RLS_CANDIDATE: REHEARSED_PASS_READY_NOT_DEPLOYED
NEXT_REQUIRED_ACTION: APPROVE_DAILY_CLOSE_TENANT_RLS_DDL (finance isolation, before populated)
```
