# Phase C Clinical Advanced — تنفيذ وتصنيف

> CANDIDATE_FIRST؛ لا PHI حقيقي؛ لا أتمتة قرار سريري غير مختبَرة في الإنتاج.

| البند | الإجراء | التصنيف | مالك | DDL | نشر | PHI | مخاطرة | البوابة |
|---|---|---|---|---|---|---|---|---|
| BCMA (barcode med admin) | تصميم candidate (يحتاج أجهزة باركود + DDL) | CANDIDATE_READY | نعم | نعم | نعم | نعم | متوسطة | APPROVE_PHASE_C_BCMA_CANDIDATE |
| eMAR hardening | يبني على A1 lock؛ candidate تحسينات | CANDIDATE_READY | نعم | محتمل | نعم | نعم | متوسطة | candidate سريري |
| ICU scores | منطق حسابي (APACHE/SOFA) candidate | CANDIDATE_READY | نعم | محتمل | نعم | لا(logic) | منخفضة | APPROVE_PHASE_C_CLINICAL_SCORES_CANDIDATE |
| ESI triage | منطق فرز candidate | CANDIDATE_READY | نعم | محتمل | نعم | لا | منخفضة | = scores |
| WHO surgery checklist | قائمة تحقّق candidate | CANDIDATE_READY | نعم | محتمل | نعم | لا | منخفضة | candidate سريري |
| clinical decision support (CDS) | candidate؛ لا أتمتة قرار في الإنتاج بلا اختبار | BLOCKED_PENDING_SAFE_TEST_DATA | نعم | محتمل | نعم | نعم | متوسطة–عالية | candidate + خطة اختبار |
| drug interaction checks | جدول `drug_interactions` موجود؛ تفعيل فحص candidate | CANDIDATE_READY | نعم | لا | نعم | نعم | متوسطة | candidate سريري |
| allergy interaction checks | candidate (يحتاج تمثيل حساسيات) | CANDIDATE_READY | نعم | محتمل | نعم | نعم | متوسطة | candidate سريري |
| clinical BI dashboards | قراءة تجميعية candidate | CANDIDATE_READY | نعم | لا | نعم | تجميعي | منخفضة | candidate BI |
| quality / readmission / infection indicators | مؤشرات تجميعية candidate | CANDIDATE_READY | نعم | لا | نعم | تجميعي | منخفضة | candidate BI |
| clinical audit trail completeness | تحقّق قراءة: audit_trail=163 صف، A1 sign/amend مُدقّقان | COMPLETED_DOCS_ONLY | لا | لا | لا | لا | منخفضة | (مراجعة دورية) |
| beta clinical pages (R17) review | read-only؛ R17=b4270c7 محفوظة، غير مدموجة | COMPLETED_DOCS_ONLY (review) | نعم(للترقية) | — | لا(بلا merge) | لا | منخفضة | APPROVE_R17_BETA_REVIEW_ONLY (لا merge) |

## قواعد مطبّقة
لم يُنفَّذ أي DDL أو نشر سريري؛ كل البنود candidate-first. CDS مُصنّف الأكثر حذراً (لا أتمتة قرار سريري في الإنتاج دون اختبار ببيانات آمنة). beta pages مراجعة فقط (لا merge لـR17).

## الخلاصة
مسار سريري متقدّم واضح كـcandidates منخفضة–متوسطة المخاطرة؛ لا شيء ينفّذ بلا بوابة سريرية + بيانات اختبار آمنة. سلامة التدقيق السريري (A1) قائمة.
