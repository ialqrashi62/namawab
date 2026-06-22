# Phase B — HAPI FHIR Transaction Ingest — نتائج الاختبار

> HAPI محلي (cached image) loopback `127.0.0.1:8090`، dummy فقط. `node tools/fhir-sandbox/hapi_transaction_test.js`.

## النتيجة: 7/7 PASS
| الفحص | النتيجة |
|---|---|
| metadata 200 | PASS |
| transaction bundle built (type=transaction, 10 entries) | PASS |
| transaction POST 200 | PASS |
| response is transaction-response Bundle | PASS |
| all entries persisted (2xx) | PASS (10 × `201 Created`) |
| read-back created Patient (200) | PASS (مثال `/Patient/1012`) |
| reference integrity: Encounter.subject -> Patient/... | PASS (المرجع يُحلّ لمريض مُنشأ) |

## ملاحظة
المحاولة الأولى أظهرت "10×201 Created" لكن تأكيدَين في الـtest كانا يتوقّعان 8 (قبل احتساب الـOrganizations) — صُحّحت العدّ إلى عدد إدخالات الـBundle الفعلي ⟹ 7/7. الإدخال نفسه نجح من المرة الأولى (كل الإدخالات 201).

## الحقول
```text
HAPI_TRANSACTION_STATUS: PASS
TRANSACTION_RESULT: 200 transaction-response; 10/10 entries 201 Created
RESOURCES_PERSISTED_IN_SANDBOX: YES (local HAPI only)
READ_BACK_STATUS: PASS (Patient 200)
REFERENCE_INTEGRITY: PASS
REAL_PHI_USED: NO | EXTERNAL_HEALTHCARE_CALLS: NO | LOOPBACK_ONLY: YES
```
