# PHASE 5 — مرشّح فهارس tenant_id الاختياري (للتوسّع)

> 2026-06-22 | لا DDL. مراجعة المرشّح فقط.

## القياس الحيّ
- 147 جدول FORCE RLS؛ **فهرس tenant_id (عمود أول) على 59؛ غائب على 88**.
- **صفر من الـ88 يتجاوز 100 صف** (كلها صغيرة/فارغة) ⇒ **لا عائق أداء حالي**. الجداول الكبيرة مفهرسة.

## المرشّح (موجود، غير مُنفَّذ)
```text
docs/sql/tenant_id_index_candidate_up.sql       (88 × CREATE INDEX CONCURRENTLY IF NOT EXISTS)
docs/sql/tenant_id_index_candidate_validate.sql
docs/sql/tenant_id_index_candidate_down.sql
```

## الحالة
```text
TENANT_ID_INDEX_STATUS: OPTIONAL_CANDIDATE_READY_NOT_DEPLOYED
INDEX_COVERAGE: 59/147   UNINDEXED_OVER_100_ROWS: 0   PERF_BLOCKER: NONE
NEXT_REQUIRED_ACTION: APPROVE_TENANT_ID_INDEX_CANDIDATE_IF_SCALE_NEEDED
```
