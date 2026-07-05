# HOS_AI_BRAIN_CLOSEOUT_GATE_AR
# بوابة الإغلاق الإلزامية داخل ai-brain

## قبل إعلان PASS أو PARTIAL أو BLOCKED
يجب فحص وجود الملفات التالية:

- task.md
- walkthrough.md
- change-register.md
- cleanup-register.md
- test-results.md
- risk-register.md
- final-report-ar.md
- memory-update.md

## إذا لم توجد
لا تعلن PASS.
أعلن:

`AI_BRAIN_CLOSEOUT_BLOCKED`

واكتب الملفات الناقصة.

## إذا وجدت جزئياً
أعلن:

`AI_BRAIN_CLOSEOUT_PARTIAL`

## إذا اكتملت
أعلن:

`AI_BRAIN_CLOSEOUT_PASS`

## فحص الترميز
كل ملفات `.ai-brain` العربية يجب أن تكون UTF-8.
ممنوع وجود أنماط mojibake أو replacement characters، ومنها:
- الحرف اللاتيني O مع شرطة قطرية المستخدم عادة في النص العربي التالف.
- الحرف اللاتيني U مع علامة علوية المستخدم عادة في النص العربي التالف.
- تسلسل BOM ظاهر كنص بدلاً من ترميز.
- رمز الاستبدال الأسود الذي يظهر عند تلف UTF-8.

إذا ظهر mojibake:
أوقف المرحلة وأعلن:

`ARABIC_MOJIBAKE_BLOCKED`
