# خريطة دلتا الأمان main↔master (Security Delta Map)

> المرحلة: `OWNER_RESOLVE_NAMAWEB_MAIN_MASTER_DIVERGENCE…` | التاريخ: 2026-06-21 | read-only. canonical=main@039a7d7؛ security-line=origin/master@10ded01؛ merge-base=c6e44ae.

| البند | في main 039a7d7 | في master 10ded01 | NEEDED_NOW | RISK_IF_SKIPPED | METHOD |
| --- | --- | --- | --- | --- | --- |
| **app.tenant_id per-request binding (ALS pool.query wrapper + middleware)** | **❌ غائب** | ✅ موجود | **نعم — P0** | **طبقة بيانات المستأجر معطّلة (قراءات 0، كتابة 42501)** | port من 10ded01 (مرشّح جاهز) |
| logAudit tenant_id stamping | ❌ (6 أعمدة) | ✅ | بعد الربط | NULL-tenant (محمي بـ DB default عند ضبط السياق) | Batch-1 |
| blood_bank_units stamping | ❌ | ✅ | بعد الربط | محمي بـ DB default | Batch-1 |
| blood_bank_donors stamping | ❌ | ✅ | بعد الربط | محمي بـ DB default | Batch-1 |
| transport_requests stamping | ❌ | ✅ | بعد الربط | محمي بـ DB default | Batch-1 |
| insurance_claims stamping | ❌ | ✅ | بعد الربط | محمي بـ DB default | Batch-1 |
| medical_records stamping | ❌ | ✅ | بعد الربط | محمي بـ DB default | Batch-1 |
| medical_certificates stamping | ❌ | ✅ | بعد الربط | محمي بـ DB default | Batch-1 |
| refund/queue/referral/claim/visits/records/multi-update guards | عزل القراءة/التحديث مُغطّى بـ RLS (بعد الربط) | ✅ | دفاع لاحق | منخفض | Batch-2+ |
| initDatabase production guard | ❌ (يشغّل CREATE TABLE) | ✅ (يتخطّى في prod) | يُفضَّل | nama_medical_app قد يفشل CREATE | port |

## الخلاصة
البند الأول (**الربط**) هو **P0 يحجب كل شيء**: بدونه لا قراءة ولا كتابة tenant تعمل تحت nama_medical_app، وBatch-1 وDB default كلاهما بلا أثر. النقل من 10ded01 جاهز كمرشّح. بقية البنود (Batch-1) دفاع-في-العمق **بعد** الربط، ومحمية حالياً وظيفياً بـ DB default (شرط ضبط app.tenant_id ⇐ يحتاج الربط).

`SECURITY_DELTA_MAP_COMPLETE`
