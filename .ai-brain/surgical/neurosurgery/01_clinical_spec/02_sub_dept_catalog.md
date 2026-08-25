# Sub-Department Catalog — NS-NEURO

| Code | Name | Representative procedures | Engine hooks | ICD anchor |
|---|---|---|---|---|
| CBV | Cerebrovascular | Aneurysm clipping, endovascular coiling, AVM resection, bypass | gradeHuntHess, scoreSpetzlerMartin, assessAneurysmRisk | I60–I67 |
| NONC | Neuro-oncology | Awake/stereotactic craniotomy, biopsy, LITT | (shared) case framework; board notes | C71, C79.3 |
| FUNC | Functional | Seizure focus resection, corpus callosotomy, DBS implant/revision | evaluateSeizureSurgery, screenDbsCandidate | G40, G20 |
| PN | Peripheral nerve | Carpal/cubital tunnel decompression, nerve graft/transfer | (v1: manual scoring) | G56, G50 |
| SB | Skull base | Transsphenoidal pituitary, petrosectomy, endoscopic approaches | (shared) + ENDO tooling | D35, C70 |
| ENDO | Endoscopic neurosurgery | ETV, septostomy, endoscopic colloid cyst removal | (shared) | G91 |
| SPINE | Spine (MIS/deformity) | MIS TLIF, ACDF, posterior spinal fusion for scoliosis | assessScoliosis | M41, M47–M51 |

Status flags per sub-dept drive module visibility: `active | pilot | blueprint-only`. v1 active set = CBV, FUNC, SPINE.
