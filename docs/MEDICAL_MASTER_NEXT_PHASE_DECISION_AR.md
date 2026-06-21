# Master Autopilot — قرار المرحلة التالية (Priority Decision)

> الوضع: `..._CONTINUE_FROM_PHASE_134` — البوابة 2/3 | محدّث 2026-06-21.

## محرك الأولوية
- **P0** تبديل دور RLS: محجوب على سرّ `nama_medical_app` (لم يُعطَ `SECRET_READY_EXECUTE_SWITCH`) ⇒ غير قابل للتنفيذ.
- **P1 Security/Isolation**: الموقع الحيّ (8f012a0) ما زال يحوي 3 ثغرات IDOR (queue status/referral/claim) — الإصلاحات في Git غير منشورة ⇒ أعلى خطر حيّ ⇒ Option A (نشر) هو الأعلى أولوية.

```text
SELECTED_NEXT_PHASE: P1_TENANT_GUARD_SWEEP_CONTROLLED_PRODUCTION_DEPLOY (Option A)
WHY_SELECTED: يغلق 3 ثغرات IDOR حيّة فوراً (أعلى تقليل خطر آمن، بلا سرّ).
WHY_NOT_RLS_ROLE_SWITCH: محجوب على سرّ nama_medical_app (لم يُعطَ SECRET_READY_EXECUTE_SWITCH).
WHY_NOT_TENANT_GUARD_DEPLOY: (هي المختارة) — لكن **النشر مُنع**: التصليب الأمني غيّر الكود إلى 3768bf3، وتفويض المالك كان لـ e52a140 فقط ⇒ يلزم موافقة جديدة.
WHY_NOT_EXTENDED_IDOR_SWEEP: قيمة أقل من إغلاق ثغرات حيّة الآن؛ يُسجَّل لاحقاً (employees/system_users/form_templates — بلا tenant_id، قرار تصميم).
WHY_NOT_INVOICE_SCHEMA_DRIFT: P2 precondition للمحاسبة (P3)؛ تحت أولوية العزل.
WHY_NOT_ACCOUNTING: P3؛ محجوب بـ drift + P0 RLS؛ flag OFF/journal=0.
WHY_NOT_FEFO: P4 clinical.
WHY_NOT_LAB_RADIOLOGY: P4.
WHY_NOT_STITCH: P5، محجوب MCP/key.
BLOCKERS: نشر 3768bf3 يتجاوز تفويض e52a140 ⇒ BLOCKED_PENDING_DEPLOY_APPROVAL.
APPROVAL_REQUIRED: نعم — موافقة نشر `3768bf3` (fail-closed) بدل e52a140 (fail-open).
```

ملاحظة: استجابةً للمراجعة الأمنية الآلية، صُلِّب الكود من fail-open إلى **fail-closed** (namaweb e52a140→3768bf3، code-only مدفوع). التفاصيل في [P1_TENANT_GUARD_SWEEP_CONTROLLED_DEPLOY_CLOSEOUT_AR.md](P1_TENANT_GUARD_SWEEP_CONTROLLED_DEPLOY_CLOSEOUT_AR.md).

`MASTER_NEXT_PHASE_DECISION_CONTINUE134_COMPLETE`
