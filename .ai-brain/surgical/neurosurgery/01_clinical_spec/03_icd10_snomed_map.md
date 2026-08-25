# ICD-10 ↔ SNOMED CT Map — NS-NEURO

> Codes resolved via terminology service at runtime (`GET /api/v1/terminology/lookup`). Values below are seed mappings; `(v)` = verify against current SNOMED Intl release before go-live.

| ICD-10 | Concept | SNOMED CT | Module binding |
|---|---|---|---|
| I60.x | Non-traumatic subarachnoid haemorrhage | 95343007 (v) | CBV.case_template=W1 |
| I61.x | Intracerebral haemorrhage | 230690007 (v) | CBV/NONC |
| I63.x | Cerebral infarction (post-op stroke coding) | 275526006 (v) | CBV complication registry |
| I67.1 | Cerebral aneurysm, unruptured | 431672005 (v) | CBV.surveillance |
| Q28.2 | Arteriovenous malformation cerebral | 444668006 (v) | CBV.AVM |
| C71.x | Malignant neoplasm of brain | 93743005 (v) | NONC.tumour_board |
| G40.x | Epilepsy | 128613002 | FUNC.epilepsy_program |
| G20 | Parkinson disease | 18120004 | FUNC.dbs_program |
| G91.x | Hydrocephalus | 230680005 (v) | ENDO.etv |
| M41.x | Scoliosis | 298382003 (v) | SPINE.deformity |

**Rules:** one primary dx per surgical case; secondary dx array allowed; coding locked after final op note signature; audit trail keeps code-change history.
