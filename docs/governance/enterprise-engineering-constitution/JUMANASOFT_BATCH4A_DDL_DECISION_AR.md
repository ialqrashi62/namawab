# الدفعة 4A — قرار DDL (GATE 4)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-entitlements-runtime`.

## القرار: **NO-DDL** (لا migration جديد، ولا تشغيل لـ e25)

طبقة الـ Entitlements Runtime Resolver **منطقية بالكامل** (قراءة فقط فوق جداول الدفعة 3) ولا تتطلّب أي تغيير مخطط:

| الحاجة | كيف عولجت بلا DDL |
|---|---|
| قراءة خطة المستأجر | من `tenant_plan_assignments` (مرشّح e25 الموجود من الدفعة 3) عند توفّره. |
| قراءة استحقاقات الخطة | من `plan_entitlements` (e25) عند توفّره. |
| **غياب e25** | الـ resolver يُرجِع `DEFAULT_ENTITLEMENTS` بأمان (**fail-open**) — لا استثناء، لا crash، لا حاجة لإنشاء جداول. |

- **لا migration جديد** في 4A (لا حاجة قاهرة).
- **لم يُشغَّل `e25`** على أي قاعدة (production أو test/staging) في هذه الدفعة — الاختبارات تستخدم pool وهمياً وتحاكي «الجداول غائبة» عبر رفض الاستعلام.
- توفير `e25` الفعلي مُؤجَّل إلى runbook منفصل لـ staging (GATE 10، غير مُنفَّذ الآن).

## التأكيدات
- لا DDL/migration شُغّل (لا production، لا test، لا local).
- لا destructive. لا لمس `tenants`/`plan_type`.
- لا rollback قاعدة بيانات لازم لهذه الدفعة.
