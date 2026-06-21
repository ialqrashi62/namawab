# خطة توفيق كود ختم tenant_id (Reconciliation Plan)

> المرحلة: `P1_RLS_CODE_LEVEL_TENANT_STAMPING_DEFENSE_IN_DEPTH_AND_NAMAWEB_RECONCILIATION` | التاريخ: 2026-06-21 | candidate/plan فقط.

## القيود الصارمة (مُطبَّقة)
لا force push · لا deploy · لا restart · لا DDL · لا GRANT · لا محاسبة · لا journal · لا .env · لا لمس ملفات الجلسات الموازية · patch minimal · فصل candidate عن موافقة النشر.

## استراتيجية namaweb
الخيارات: A) cherry-pick · B) manual patch على 039a7d7 · C) patch files تحت docs/patches.
- **A مرفوض الآن**: cherry-pick سطري الأمني (10ded01…) فوق 039a7d7 ممكن منطقياً (merge-base c6e44ae) لكنه قرار دمج مالك (أيّ سطر canonical) + يحتاج حلّ تعارضات.
- **B مرفوض الآن**: تعديل server.js الحيّ (working tree المشترك مع التطبيق الجاري) + الدفع إلى master غير ممكن بلا force (تشعّب) ⇒ يخالف "لا force/لا overwrite".
- **✅ C مُختار**: patch spec تحت `docs/patches/` فقط — صفر تعديل/دفع namaweb، صفر مخاطرة على الفرعين أو الجلسة الموازية. يُطبَّق لاحقاً ضمن قرار الدمج + نشر مُصرَّح.

## قرار الدمج المطلوب من المالك (العائق)
namaweb main(039a7d7، منشور) ↔ origin/master(10ded01، سطري) متشعّبان عن c6e44ae. المالك يقرّر:
```text
1. أي سطر canonical؟ (الأرجح: main 039a7d7 المنشور هو الأساس)
2. دمج/إعادة تطبيق إصلاحاتي الأمنية (logAudit + blood-bank stamping) فوقه عبر merge أو cherry-pick انتقائي بلا force.
3. ثم تطبيق Batch-1 patch spec (دفاع-في-العمق) + اختبار + نشر مُصرَّح.
```

## Batch 1 (patch spec جاهز — docs/patches/rls_code_stamping_batch1_AR.md)
logAudit · blood_bank_units · blood_bank_donors · transport_requests · insurance_claims · medical_records · medical_certificates. كلها: ختم tenant_id (+facility_id حيث العمود موجود) من سياق موثوق + requireTenantScope + عدم الثقة بالـbody. **دفاع-في-العمق فوق DB default** (لا يكسره؛ الـDEFAULT يبقى fallback).

## ملاحظة أولوية
الخطر الوظيفي مرفوع بالـDEFAULT؛ هذه المرحلة دفاع-في-العمق + حوكمة. ليست عاجلة. لا توسيع نطاق بلا ضرورة.

`RECONCILIATION_PLAN_COMPLETE`
