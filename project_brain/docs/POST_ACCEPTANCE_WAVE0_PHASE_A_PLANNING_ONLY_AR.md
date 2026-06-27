# Wave 0D — تخطيط Phase A (تخطيط فقط، لا تنفيذ)

> 2026-06-22 | مراجعة بنود Phase A (أمن/أساس) من الـBlueprint. **لا تنفيذ، لا كود، لا DDL، لا deploy.**

| Feature | Risk | لماذا Phase A | يحتاج نشر كود | يحتاج DDL | يحتاج data migration | اعتماد خارجي | استراتيجية الاختبار | Rollback | موافقة مالك | الترتيب الموصى |
|---|---|---|---|---|---|---|---|---|---|---|
| **EMR lock/signature** | عالٍ (سلامة قانونية للسجل) | السجل الطبي يجب أن يُقفل/يُوقّع (أساس امتثال CBAHI) | نعم | نعم (document_signatures) | لا (جداول جديدة فارغة) | لا | TDD + static guard + E2E توقيع/قفل + محاولة تعديل بعد القفل=409 | down.sql (drop) + checkout كود | نعم (بوابة + شجرة نظيفة) | **1** |
| **MFA/2FA** | عالٍ (حماية الدخول) | منع اختطاف الحسابات | نعم | نعم (mfa_secrets) | لا | مكتبة TOTP | unit + E2E دخول بـMFA + تعطيل | إزالة الإلزام + drop | نعم | **2** |
| **at-rest encryption / PHI vault** | عالٍ (خصوصية PHI) | حماية البيانات الساكنة والملفات | محتمل (طبقة تخزين) | محتمل | محتمل (ترحيل ملفات) | إدارة مفاتيح | اختبار تشفير/فك + استرداد | استعادة من نسخة | نعم (+مراجعة) | **3** |
| **offsite encrypted backup (مجدول)** | متوسط (تعافٍ) | حماية ضد فقد البيانات | لا (سكربت/مهمة) | لا | لا | تخزين خارجي | drill استرداد دوري | لا (إضافي) | نعم | **4** |
| **accounting posting enablement** | عالٍ جداً (مالي، شبه-لا-رجعة) | يُنشئ قيوداً مالية فعلية | نعم (wiring) | محتمل (الجداول موجودة finance_journal_*) | لا | لا | rehearse معزول 63/63 + smoke ROLLBACK + idempotency | معقّد (لا تُحذف قيود) | **بوابة مستقلة منفصلة** | **منفصل — ليس ضمن دفعة A** |

## المبادئ
- كل بند عبر **بوابة بموافقة صريحة** + بروتوكول: rehearse على قاعدة معزولة → backup → execute → validate → smoke → rollback جاهز.
- **شرط مسبق لكل البنود الكودية**: شجرة namaweb نظيفة (Wave 0B).
- **المحاسبة**: لا تُدمَج مع غيرها — بوابة `APPROVE_ACCOUNTING_POSTING_ENABLEMENT` مستقلة، الأعلى خطراً.

## الترتيب الموصى
1) EMR lock/signature (P0) → 2) MFA → 3) at-rest/vault → 4) offsite backup. (المحاسبة في مسارها المنفصل متى قرّر المالك.)

## الحالة
```text
PHASE_A_STATUS: PLANNED_ONLY_NOT_EXECUTED
PREREQUISITE: namaweb worktree clean + per-gate owner approval
```
