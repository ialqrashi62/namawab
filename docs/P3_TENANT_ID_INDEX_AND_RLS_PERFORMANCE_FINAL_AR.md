# PHASE 3 — فهارس tenant_id وأداء RLS

> 2026-06-22 | تحليل حيّ (postgres قراءة-فقط) + مرشّح فهارس اختياري غير مُنفَّذ.

## القياس الحيّ
- **147 جدول FORCE RLS**؛ سياسة كل منها تُرشّح `tenant_id = current_setting('app.tenant_id')`.
- **فهرس tenant_id (كعمود أول) موجود على 59 جدولاً؛ غائب على 88**.
- **صفر من الـ88 غير المفهرسة يتجاوز 100 صف** (كلها صغيرة/فارغة: branches=1، company_settings=8، الباقي 0). الجداول الكبيرة (patients/invoices/medical_records...) ضمن الـ59 المفهرسة.
- ⇒ **لا أثر أداء حالي** على ترشيح RLS. الفهرس على جدول فارغ لا يفيد.

## المرشّح الاختياري (غير مُنفَّذ)
أُنشئت ملفات candidate لإضافة فهرس tenant_id للـ88 (للتوسّع المستقبلي عند نمو الجداول):
```text
docs/sql/tenant_id_index_candidate_up.sql        (88 × CREATE INDEX CONCURRENTLY IF NOT EXISTS)
docs/sql/tenant_id_index_candidate_validate.sql  (يتحقق أن كل جدول FORCE له فهرس يقود بـtenant_id)
docs/sql/tenant_id_index_candidate_down.sql      (DROP INDEX CONCURRENTLY)
```
`CONCURRENTLY` يتجنّب القفل الطويل (يُشغَّل خارج معاملة، كمالك الجدول). DDL ⇒ **يحتاج موافقة**.

## الحالة
```text
FINAL_STATUS: TENANT_ID_INDEX_CANDIDATE_READY_OPTIONAL_NOT_DEPLOYED
INDEX_COVERAGE: 59/147   UNINDEXED_OVER_100_ROWS: 0   PERF_IMPACT_NOW: NONE
NEXT_REQUIRED_ACTION: APPROVE_TENANT_ID_INDEX_CANDIDATE_IF_SCALE_NEEDED
```
