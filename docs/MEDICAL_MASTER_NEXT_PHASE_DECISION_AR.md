# Master Autopilot — قرار المرحلة التالية (Priority Decision)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_ALL_PHASES_AND_GROUPS` — البوابة 2 | التاريخ: 2026-06-21.

## تطبيق محرك الأولوية
- **Priority 0 (Consistency/Git/Truth)**: local==origin (سليم). لكن **تباين RLS (R1) = truth blocker** صريح (التوثيق 115، سجل المخاطر يقول «الفعلي 13») ⇒ يجب حسمه أولاً.
- **Priority 1 (Security/Isolation)**: refund IDOR + فعالية RLS — وكلاهما يعتمد على معرفة حقيقة تغطية/فعالية RLS أولاً.
- لذا المرحلة الصحيحة أولاً = **تسوية تباين RLS (R1)** قراءة-فقط، لأنها تحسم الحقيقة وتحدّد خطورة كل ما بعدها.

## القرار
```text
SELECTED_NEXT_PHASE: P1_RLS_COVERAGE_RECONCILIATION_R1 (executed read-only this turn)
WHY_SELECTED: truth blocker (P0) + isolation (P1)، read-only بلا موافقة، وأساسي — يحدّد فعالية العزل الحقيقية وخطورة refund IDOR وفجوات Class A. نفّذته قراءة-فقط وكشف حقيقة حرجة: RLS مُسلّح (115 FORCE) لكنه مُتجاوَز لأن التطبيق يتصل بـ superuser.
WHY_NOT_RLS: (هي المختارة) — لم تُؤجَّل.
WHY_NOT_ACCOUNTING: Priority 3 (financial) تحت Priority 1/2؛ ومحجوبة بـ invoice schema drift + refund IDOR (يجب حسمهما أولاً)؛ والمحرك OFF/journal=0 (لا ضرر آني).
WHY_NOT_FEFO: Priority 4 (clinical) تحت العزل/المالية.
WHY_NOT_LAB_RADIOLOGY: Priority 4، تحت المخاطر الأعلى.
WHY_NOT_STITCH: Priority 5، ومحجوبة `BLOCKED_PENDING_MCP_AND_KEY` (لا MCP/key).
WHY_NOT_REFUND_IDOR_FIRST: هو الإجراء التالي مباشرة، لكن وجب أولاً تحديد ما إذا كان RLS يخفّفه؛ التسوية أثبتت أنه **لا يخفّفه** (RLS متجاوَز) ⇒ IDOR مؤكَّد قابل للاستغلال ويصبح NEXT_REQUIRED_ACTION.
BLOCKERS: لا blocker لتنفيذ التسوية (read-only). الإصلاحات اللاحقة (دور أقل صلاحية/ALTER/IDOR deploy) تتطلّب موافقات منفصلة.
APPROVAL_REQUIRED: لا (للتسوية read-only). نعم لاحقاً (role wiring/DDL/deploy).
```

## الإجراءات التالية المرتّبة (بعد التسوية)
1. **`P1_REFUND_IDOR_TENANT_GUARD_CODE_FIX`** — P1، code-only، مؤكَّد قابل للاستغلال (RLS متجاوَز) ⇒ الأعلى أولوية تنفيذية فورية.
2. **تفعيل الدور الأقل صلاحية `nama_medical_app`** — يجعل الـ115 FORCE تنفذ فعلياً (أعلى رافعة عزل) — GRANTs (DDL) + `.env` + redeploy (موافقات).
3. Class A residual (`packages`/`blood_bank_donors`/`blood_bank_units` + audit_trail/portal_users) — candidates بموافقة DDL.
4. invoice schema drift → accounting code-behind-flag.

`MASTER_NEXT_PHASE_DECISION_COMPLETE`
