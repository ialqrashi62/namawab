# PHASE 8 — الأداء/الفهارس/قابلية التوسّع

> 2026-06-22 | تحقّق حيّ. لا DDL.

## فهارس tenant_id
- 147 FORCE RLS؛ فهرس tenant_id (عمود أول) على **59؛ غائب على 88**.
- **0 من الـ88 يتجاوز 100 صف** (كلها صغيرة/فارغة) ⇒ **لا عائق أداء حالي** على ترشيح RLS. الجداول الكبيرة (patients/invoices/medical_records...) مفهرسة.

## أداء سياسات RLS
- سياسة بسيطة (مساواة على current_setting) ⇒ كلفة ضئيلة؛ الجداول الكبيرة مفهرسة tenant_id.

## التشغيل
- PM2 nama-app online (ذاكرة ~37-124MB بعد restart، تستقر). Redis Up. watchdog يسجّل OK كل 5 دقائق (تدوير عند 1MB).

## المرشّح (اختياري، غير مُنفَّذ)
`docs/sql/tenant_id_index_candidate_{up,validate,down}.sql` (88 × CREATE INDEX CONCURRENTLY) للتوسّع المستقبلي.

## الحالة
```text
TENANT_ID_INDEX_STATUS: OPTIONAL_CANDIDATE_READY_NOT_DEPLOYED
INDEX_COVERAGE: 59/147   UNINDEXED_OVER_100_ROWS: 0   PERF_BLOCKER: NONE
NEXT_REQUIRED_ACTION: APPROVE_TENANT_ID_INDEX_CANDIDATE_IF_SCALE_NEEDED
```
