# Wave 4 — Regression (بعد تشغيل وتفكيك الـcontainers)

> 2026-06-23 | كل sandbox containers فُكّكت؛ الإنتاج والمحاكيات سليمة.

| الفحص | النتيجة |
|---|---|
| لا containers sandbox باقية (nama-hapi/mirth/orthanc) | none ✓ (كلها torn down) |
| local health | 200 |
| domain health | 200 |
| Redis PONG | PONG |
| FORCE_RLS | 150 |
| journal | 0 |
| D2 FHIR sandbox tests | 10/10 PASS |
| D1 Mirth simulator | 7/7 PASS |
| D5 Orthanc simulator | 7/7 PASS |
| accounting | OFF |
| git secrets | none (لا أسرار/مفاتيح/PHI/DICOM مُلتزَمة) |
| namaweb dirty | 0 |

## الحقول
```text
REGRESSION: PASS
SANDBOX_CONTAINERS_RUNNING: 0 (all torn down)
HEALTH: local 200, domain 200 | REDIS: PONG | FORCE_RLS: 150 | JOURNAL: 0
D2: 10/10 | D1: 7/7 | D5: 7/7
ACCOUNTING_POSTING_ENABLED: OFF
```
ملاحظة: ملفات STITCH/UI و migrate.ps1/protocol_x.ps1 الظاهرة في حالة المستودع الأب هي تغييرات **سابقة** (من بداية الجلسة)، ليست من هذه الموجة، ولم تُجهَّز للالتزام.
