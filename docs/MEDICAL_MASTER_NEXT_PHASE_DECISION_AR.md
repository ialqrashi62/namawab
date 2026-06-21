# Master Autopilot — قرار المرحلة التالية (Priority Decision)

> الوضع: `..._CONTINUATION` — البوابة 2 | محدّث 2026-06-21.

## محرك الأولوية
- **P0** تبديل دور RLS: محجوب على سرّ `nama_medical_app` (لم يُعطَ `SECRET_READY_EXECUTE_SWITCH`) ⇒ غير قابل للتنفيذ الآن.
- **P1 Security/Isolation**: بما أن RLS مُتجاوَز (app=superuser)، فلاتر التطبيق هي العزل الوحيد ⇒ مسح المسارات عالية الخطورة بلا حارس tenant = أعلى أولوية آمنة بلا سرّ. **مختار.**

```text
SELECTED_NEXT_PHASE: P1_SECURITY_TENANT_GUARD_SWEEP_FOR_HIGH_RISK_ROUTES (executed code-only this round)
WHY_SELECTED: P1 isolation، code-only، بلا سرّ/DDL؛ يغلق ثغرات كتابة عابرة للمستأجر مؤكَّدة (نفس فئة refund IDOR) بينما RLS متجاوَز.
WHY_NOT_RLS_ROLE_SWITCH: محجوب على سرّ `nama_medical_app` (scram، خارج git، لا يُخمَّن). ينتظر `SECRET_READY_EXECUTE_SWITCH`.
WHY_NOT_ACCOUNTING: P3؛ محجوب بـ invoice schema drift + P0 RLS؛ flag OFF/journal=0 (لا ضرر آني).
WHY_NOT_SCHEMA_DRIFT: P2 precondition للمحاسبة (P3)؛ أقل إلحاحاً من ثغرات العزل النشطة (P1).
WHY_NOT_FEFO: P4 clinical.
WHY_NOT_LAB_RADIOLOGY: P4.
WHY_NOT_STITCH: P5، محجوب MCP/key.
BLOCKERS: لا blocker للمسح (code-only)؛ النشر يحتاج موافقة.
APPROVAL_REQUIRED: نعم للنشر (CONTROLLED_DEPLOY)؛ نعم/سرّ لتبديل دور RLS.
```

التفاصيل والتنفيذ والإغلاق في [P1_SECURITY_TENANT_GUARD_SWEEP_FOR_HIGH_RISK_ROUTES_AR.md](P1_SECURITY_TENANT_GUARD_SWEEP_FOR_HIGH_RISK_ROUTES_AR.md).

`MASTER_NEXT_PHASE_DECISION_CONTINUATION_COMPLETE`
