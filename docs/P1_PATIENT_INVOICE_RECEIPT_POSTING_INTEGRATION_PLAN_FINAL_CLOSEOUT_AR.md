# P1 — إغلاق خطة ربط ترحيل الفواتير/السندات (Integration Plan Closeout)

> المرحلة: `P1_PATIENT_INVOICE_RECEIPT_POSTING_INTEGRATION_PLAN` — البوابة 7
> التاريخ: 2026-06-21 | **PLAN_ONLY**: لا كود، لا DDL، لا seed، لا تغيير بيانات، لا نشر، لا restart، لا تفعيل flag، لا ربط فعلي، لا journal، لا Stitch، لا RLS Wave، لا force push، لا إعادة تنفيذ candidates (`DO_NOT_RERUN: YES`).

## ملخص
خطة كاملة لربط محرك الترحيل المحاسبي بمسارات الفواتير وسندات القبض. **اكتشاف محوري**: الربط **موجود جزئياً بالفعل** في `server.js` (4 مسارات تستدعي `runEventWithPosting` خلف flag OFF: إنشاء/دفع/إلغاء/استرداد). الخطة توثّق الموجود، وتحدّد الفجوات (توليد فاتورة، دفع جزئي، فلتر tenant في الاسترداد)، و precondition انحراف مخطط `invoices`، وتصمّم rollout + قرار الفواتير القديمة + خطة اختبار + معايير جاهزية.

## المخرجات (7 تقارير)
`..._POSTING_BASELINE` · `..._FLOW_DISCOVERY` · `..._POSTING_INTEGRATION_DESIGN` · `P1_ACCOUNTING_POSTING_FLAG_ROLLOUT_STRATEGY` · `P1_ACCOUNTING_LEGACY_INVOICE_BACKFILL_DECISION` · `..._POSTING_TEST_PLAN` · `..._POSTING_PRODUCTION_READINESS` (+ هذا الإغلاق).

## أهم النتائج/المخاطر للمرحلة التالية
- **موصول (4)**: `POST /api/invoices` (738)، `PUT /api/invoices/:id/pay` (1742)، `POST /api/invoices/cancel/:id` (5609)، `POST /api/invoices/:id/refund` (6485).
- **فجوات (3)**: G1 `POST /api/invoices/generate` بلا ترحيل؛ G2 `PUT /api/invoices/:id/partial-pay` بلا ترحيل (+قرار مرجع idempotency للدفعة الجزئية)؛ G3 فلتر/ملكية tenant مفقود في SELECT الاسترداد (IDOR).
- **precondition**: انحراف مخطط `invoices` (أعمدة يكتبها الكود وغير موجودة) — تسوية ALTER محكومة بموافقة منفصلة قبل أي تفعيل.

## الحقول
```text
FINAL_STATUS: DOCS_ONLY_INTEGRATION_PLAN_PASS
USER_VISIBLE_ON_WEBSITE: NO
LOCAL_CHANGES_REMAINING: NO (بعد commit؛ ملفات Stitch/UI سابقة خارج النطاق لم تُلمَس)
COMMITTED: YES
PUSHED: YES (fast-forward، بلا force)
PRODUCTION_DEPLOYED: NO
DEPLOYMENT_APPROVAL_REQUIRED: YES
DDL_EXECUTED: NO
SEED_EXECUTED: NO
DATA_CHANGED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_CREATED: NO
ENGINE_WIRED: PARTIAL_PREEXISTING (4 routes wired behind OFF flag; not by this phase)
FILES_CHANGED: 8 (7 تقارير خطة + ذاكرة Phase 129)
FILES_DEPLOYED: 0
FILES_NOT_DEPLOYED: كل التقارير (وثائق فقط)
OUT_OF_SCOPE_FILES_PRESENT: NO (Stitch/UI untracked لم تُلمَس)
NEXT_REQUIRED_ACTION: P1_PATIENT_INVOICE_RECEIPT_POSTING_CODE_BEHIND_FLAG
```

## تدقيق ترميز UTF-8 العربي
`UTF8_ARABIC_AUDIT: PASS` (لا mojibake فعلي).

## معيار PASS — مُستوفى
تحديد المسارات ✅ · تصميم الربط ✅ · استراتيجية flag ✅ · قرار الفواتير القديمة ✅ · خطة الاختبار ✅ · لا DDL/Seed/data/deploy/journal/تفعيل ✅ · UTF-8 PASS ✅ · push بلا force ✅.

`PATIENT_INVOICE_RECEIPT_POSTING_INTEGRATION_PLAN_FINAL_CLOSEOUT_COMPLETE`
