# خريطة تدفّق البيانات (Data Flow Map)

> التاريخ: 2026-06-20 | مرجع: [MEDICAL_DATA_FLOW_MAP_AR.md](MEDICAL_DATA_FLOW_MAP_AR.md). هذا تحديث للحالة الراهنة (binding + entitlement + accounting wired-OFF).

## طبقات كل طلب (الحالة الراهنة)
```
Client (SPA app.js) → HTTPS/Nginx → Express
  → session middleware (Redis store)
  → TENANT CONTEXT middleware: getRequestTenantContext → tenantStore.run({tenantId})
  → FACILITY ENTITLEMENT guard: pathToModule(req.path) → fail-closed (403/422) أو تمرير
  → route: requireAuth [+ requireRole/requireTenantScope]
  → pool.query (wrapped): يحجز اتصالاً → set_config('app.tenant_id') → query → reset → release
  → PostgreSQL (RLS policies على الجداول المحمية) → استجابة
```

## تدفّقات أساسية (مختصرة)
| # | التدفّق | Auth/RBAC | Tenant ctx | Facility ent. | DB/RLS | أثر محاسبي |
| - | ------- | --------- | ---------- | ------------- | ------ | ---------- |
| 1 | تسجيل دخول | login (rate-limited) | يُحقن tenantId بالجلسة | bypass (auth) | system_users | — |
| 2 | تسجيل مريض | requireRole(patients) | ✅ ختم tenant | patients allowed | INSERT patients (RLS) | — |
| 3 | موعد/زيارة | requireRole | ✅ | reception | appointments/visits | — |
| 4 | وصفة → صرف | requireRole/Scope | ✅ | pharmacy | prescriptions/stock | (عند التفعيل: COGS/Inventory) |
| 5 | مختبر/أشعة | requireAuth | ✅ | lab/radiology | orders/results (FORCE RLS) | — |
| 6 | فاتورة | requireRole(invoices) | ✅ | billing | invoices (FORCE RLS) | **OFF**: Dr ذمم/Cr إيراد/Cr ضريبة (داخل معاملة، app.tenant_id) |
| 7 | سند قبض/استرداد | requireRole | ✅ | billing | — | **OFF**: Dr نقد/Cr ذمم ؛ استرداد fail-closed |
| 8 | تنويم/إفراغ | requireTenantScope | ✅ (SET LOCAL في المعاملة) | inpatient | admissions/beds | — |
| 9 | ترحيل محاسبي | — | app.tenant_id داخل المعاملة | — | journal_entries/lines | **معطّل (flag OFF)؛ CoA+mapping مطبَّقان (30/23) — لا قيود بعد (journal=0)** |
| 10 | تدقيق | — | tenant | — | audit_trail | — |

## fail-closed مضمون
- المحاسبة: `runEventWithPosting` — الحدث + الترحيل في معاملة واحدة؛ أي فشل → ROLLBACK كامل (لا فاتورة جزئية/قيد يتيم).
- نوع المنشأة: غياب/جهل/خطأ قراءة على مسار حساس → 403/422.
- العزل: غياب tenant context في الإنتاج على مسار scoped → 403.

`DATA_FLOW_MAP_COMPLETE`
