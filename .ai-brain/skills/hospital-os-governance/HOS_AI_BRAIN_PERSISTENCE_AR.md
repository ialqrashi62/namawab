# HOS_AI_BRAIN_PERSISTENCE_AR
# إلزام توثيق كل تغيير أو تنظيف داخل ai-brain

## القاعدة الأساسية
أي تغيير أو تنظيف أو إصلاح أو مراجعة أو حذف أو إعادة ترتيب أو تحسين يجب أن يُوثّق داخل `.ai-brain`.

لا يكفي تعديل الكود فقط.
لا يكفي إنشاء تقرير في docs فقط.
لا يكفي الرد في المحادثة فقط.

يجب إنشاء أو تحديث ملفات داخل `.ai-brain` توضح:
1. ماذا تغير؟
2. لماذا تغير؟
3. أين تغير؟
4. ما الملفات المتأثرة؟
5. هل يوجد تنظيف؟
6. هل تم حذف شيء؟
7. هل يوجد خطر؟
8. ما الاختبارات التي شُغّلت؟
9. ما الاختبارات التي لم تُشغّل ولماذا؟
10. ما القرار النهائي؟

## المسار المعتمد
كل مرحلة تحفظ في:

`.ai-brain/hospital-os/runs/YYYY-MM-DD/<PHASE_NAME>/`

ويجب أن تحتوي على الأقل على:

- task.md
- walkthrough.md
- change-register.md
- cleanup-register.md
- test-results.md
- risk-register.md
- final-report-ar.md
- memory-update.md

## ممنوعات
لا تحفظ داخل `.ai-brain`:
- كلمات مرور.
- مفاتيح API.
- Tokens.
- ملفات env.
- بيانات مرضى حقيقية.
- PHI.
- سجلات إنتاج حساسة.
- أسرار قواعد البيانات.

إذا احتجت توثيق وجود سر، اكتب:
`SECRET_PRESENT_MASKED`
ولا تكتب قيمة السر.

## حالة الحفظ
أي مرحلة لا تحتوي على سجل داخل `.ai-brain` تعتبر غير مكتملة.

FINAL_STATUS المحتمل:
- AI_BRAIN_PERSISTENCE_PASS
- AI_BRAIN_PERSISTENCE_PARTIAL
- AI_BRAIN_PERSISTENCE_BLOCKED
