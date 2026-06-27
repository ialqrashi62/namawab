# P1 — جاهزية الإنتاج لإصلاح Refund IDOR (Production Readiness)

> المرحلة: `P1_REFUND_IDOR_TENANT_GUARD_CODE_FIX` — البوابة 5 | التاريخ: 2026-06-21.

```text
RUNTIME_CODE_CHANGED: YES (namaweb/server.js — refund route only + test file)
DDL_REQUIRED: NO
DATA_CHANGE_REQUIRED: NO
DEPLOYMENT_REQUIRED: YES (نشر كود namaweb + PM2 reload) — بموافقة منفصلة
ACCOUNTING_POSTING_ENABLED: OFF (لم يتغيّر)
JOURNAL_CREATED: NO
ROLLBACK_PLAN: استرجاع الـ commit في namaweb (revert) + إعادة gitlink الأب — تغيير code فقط، لا بيانات؛ rollback فوري وآمن
SMOKE_CHECKS: بعد النشر — (1) refund لفاتورة من نفس المستأجر ينجح؛ (2) محاولة refund عبر مستأجر آخر تُعيد 404؛ (3) لا قيود journal جديدة (journal=0)؛ (4) cancel/pay/إنشاء فاتورة تعمل؛ (5) Redis/session سليم
RECOMMENDED_DEPLOY_DECISION: APPROVE_CONTROLLED_DEPLOY (إصلاح أمني P1 صغير ومعزول، code-only، rollback فوري) — ثم الانتقال إلى P0_RLS_RUNTIME_ROLE_ENFORCEMENT_RESTORE
```

## ملاحظات
- التغيير **code-only** ومعزول على مسار واحد؛ لا DDL ولا بيانات ولا تفعيل علم.
- لا يُغلق هذا الإصلاح خطر RLS الأكبر (التطبيق يتصل superuser) — يبقى `RLS_RUNTIME_ROLE_STILL_BYPASSED: YES`.
- النشر يتطلّب موافقة صريحة (لم يُنفَّذ في هذه المرحلة).

`REFUND_IDOR_PRODUCTION_READINESS_COMPLETE`
