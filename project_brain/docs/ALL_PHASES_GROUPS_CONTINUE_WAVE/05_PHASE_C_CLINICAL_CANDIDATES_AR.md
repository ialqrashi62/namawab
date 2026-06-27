# Wave 5 — Phase C Clinical Candidates (docs فقط، بلا PHI)

> candidate docs فقط؛ لا PHI؛ لا تشغيل سريري إنتاجي. كل بند ينتهي: CANDIDATE_READY / BLOCKED_PENDING_SAFE_TEST_DATA / BLOCKED_PENDING_CLINICAL_OWNER_APPROVAL.

| البند | الوصف المختصر | DDL؟ | التصنيف | البوابة |
|---|---|---|---|---|
| BCMA | مطابقة باركود الدواء↔المريض↔الوصفة عند الإعطاء؛ يحتاج أجهزة + DDL | نعم | CANDIDATE_READY | APPROVE_PHASE_C_BCMA_CANDIDATE |
| eMAR hardening | يبني على A1 lock؛ سجل إعطاء محكوم + توقيع | محتمل | CANDIDATE_READY | candidate سريري |
| ICU scores (APACHE/SOFA) | حساب من قياسات؛ منطق بحت | محتمل | CANDIDATE_READY | APPROVE_PHASE_C_CLINICAL_SCORES_CANDIDATE |
| ESI triage | خوارزمية فرز 1–5 | محتمل | CANDIDATE_READY | = scores |
| WHO surgery checklist | قائمة تحقّق ما قبل/أثناء/بعد | محتمل | CANDIDATE_READY | candidate سريري |
| drug interaction checks | يستخدم `drug_interactions` الموجود | لا | CANDIDATE_READY | candidate سريري |
| allergy interaction checks | يحتاج تمثيل حساسيات المريض | محتمل | CANDIDATE_READY | candidate سريري |
| clinical BI indicators | مؤشرات تجميعية (قراءة) | لا | CANDIDATE_READY | candidate BI |
| infection/readmission indicators | معدلات العدوى/إعادة الدخول (تجميعي) | لا | CANDIDATE_READY | candidate BI |
| **CDS (أتمتة قرار سريري)** | تنبيهات/توصيات؛ يتطلّب اختبار ببيانات آمنة | محتمل | **BLOCKED_PENDING_SAFE_TEST_DATA** | candidate + dataset آمن + موافقة سريرية |

## قواعد مطبّقة
لا DDL/تشغيل سريري؛ candidate-first. **CDS** الأعلى حذراً (لا أتمتة قرار في الإنتاج دون اختبار ببيانات آمنة + موافقة سريرية). أي بند يلمس قراراً سريرياً مباشراً = BLOCKED_PENDING_CLINICAL_OWNER_APPROVAL قبل الإنتاج.

```text
PHASE_C_STATUS: CANDIDATES_CLASSIFIED (most CANDIDATE_READY; CDS BLOCKED_PENDING_SAFE_TEST_DATA)
REAL_PHI_USED: NO | PRODUCTION_CLINICAL_AUTOMATION: NO
```
