# Phase B — Mirth Channel Import — Regression (بعد التفكيك)

| الفحص | النتيجة |
|---|---|
| sandbox containers running | 0 ✓ |
| local health | 200 |
| domain health | 200 |
| Redis PONG | PONG |
| FORCE_RLS | 150 |
| journal | 0 |
| D2 FHIR sandbox | 10/10 PASS |
| HAPI transaction (during run) | 200 / 10×201 |
| D1 Mirth simulator | 7/7 PASS |
| D5 Orthanc simulator | 7/7 PASS |
| accounting | OFF |

```text
REGRESSION: PASS
TEARDOWN_STATUS: CLEAN (no sandbox containers)
HEALTH: local 200, domain 200 | REDIS: PONG | FORCE_RLS: 150 | JOURNAL: 0
```
