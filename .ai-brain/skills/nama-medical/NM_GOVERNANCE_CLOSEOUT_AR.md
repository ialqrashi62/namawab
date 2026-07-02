# NM_GOVERNANCE_CLOSEOUT — إغلاق البوابات وتوثيق المرحلة

## متى تُستخدم
نهاية كل بوابة، كل مرحلة، أو أي مهمة تحتاج تقرير إغلاق موثّق.

## الهدف
إغلاق كل بوابة بتقرير مختصر يحمل الأدلة الكاملة ويوضح الحالة النهائية.

## قواعد إلزامية
```
FINAL_STATUS_REQUIRED: YES — لا اعتبار المهمة منتهية بدون final_status
PRODUCTION_TOUCHED_DECLARED: YES — يجب التصريح: YES/NO
SECRETS_PRINTED_DECLARED: YES — يجب التصريح: NO
PHI_PRINTED_DECLARED: YES — يجب التصريح: NO
DDL_EXECUTED_DECLARED: YES — يجب التصريح: YES/NO
DEPLOY_EXECUTED_DECLARED: YES — يجب التصريح: YES/NO
FORCE_PUSH_DECLARED: YES — يجب التصريح: NO
FILES_CHANGED_LISTED: YES — قائمة الملفات المُغيَّرة
TESTS_RUN_DOCUMENTED: YES — الاختبارات المُشغَّلة وإخراجها
BLOCKERS_DOCUMENTED: YES — أي حواجز واضحة ومسبّبة
NEXT_ACTION_STATED: YES — التوصية التالية واضحة
ARABIC_UTF8: YES — التقرير عربي UTF-8 نظيف
```

## هيكل تقرير الإغلاق
```markdown
# تقرير إغلاق البوابة X — [وصف]

## ملخص تنفيذي
[2-3 جمل فقط]

## الملفات المُغيَّرة
| الملف | نوع التغيير | السبب |
|---|---|---|

## الاختبارات المُجراة
| الاختبار | النتيجة | الإخراج |
|---|---|---|

## الأدلة
[إخراج الأوامر الحقيقية — مختصر]

## الحواجز
[NONE أو وصف واضح]

## الإغلاق الرسمي
production_touched: NO/YES
secrets_printed: NO
PHI_printed: NO
DDL_executed: NO/YES (بدون موافقة: NO)
deploy_executed: NO/YES (بدون موافقة: NO)
force_push_used: NO
files_changed: N
tests_run: N passed / N failed
final_status: [STATUS]
next_recommended_action: [وصف]
```

## حالات final_status المسموحة
```
NM_GATE_PASSED — اكتملت البوابة بنجاح
NM_GATE_BLOCKED_TESTS_FAILED — فشل الاختبارات
NM_GATE_BLOCKED_HEALTH_CHECK — فشل health check
NM_GATE_BLOCKED_NO_APPROVAL — لا موافقة على الإنتاج
NM_GATE_BLOCKED_SECRETS_DETECTED — أسرار مكتشفة
NM_GATE_BLOCKED_ENCODING_FAILED — ترميز عربي تالف
NM_GATE_BLOCKED_CROSS_TENANT_LEAK — تسريب بين مستأجرين
NM_GATE_PARTIAL — اكتملت جزئياً (وثّق ما بقي)
```

## حالات الحظر
- لا final_status → BLOCKED_NO_CLOSEOUT
- mojibake في التقرير → BLOCKED_ENCODING_AUDIT_FAILED
- ادعاء نجاح بدون أدلة → BLOCKED_NO_EVIDENCE

## صيغة التقرير المختصر
```
CLOSEOUT: final_status=[STATUS] | gate=[X]
production_touched: NO | secrets_printed: NO | PHI_printed: NO
DDL_executed: NO | deploy_executed: NO | force_push_used: NO
next: [action]
```
