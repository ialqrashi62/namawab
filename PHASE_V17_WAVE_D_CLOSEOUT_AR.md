# WAVE D Closeout — v17.0

## Phases delivered
| Phase | Files | Smoke |
|---|---|---|
| F-8 DICOM | `lib/dicom/PACSAdapter.js`, `routes/dicomweb/wado.js`, `stow.js`, `qido.js` | 59/63 |
| F-9 Voice Scribe | `lib/voice/Deidentifier.js`, `SOAPBuilder.js`, `routes/voice_scribe.js` | 60/63 |
| F-12 i18n L2 | `lib/i18n/LocaleLoader.js`, `ClinicalTranslator.js`, `public/js/i18n_grid.js` | 61/63 |
| F-18 Genomics | `lib/genomics/VCF.js`, `Pharmaco.js`, `CoolStore.js` | 62/63 |
| F-19 NLP v2 | `lib/nlp/Deidentify.js`, `KnowledgeGraph.js`, `routes/nlp_query.js` | **63/63** |

## Total: 63/63 PASS — +5 tests in wave D.

## Safety rails
- RAIL-2 (PHI): voice + nlp deidentifier strips NID, phone, email, dates, MRN, locations.
- RAIL-5 (tenant): DICOM WADO/STOW/QIDO all require X-Tenant.
- RAIL-12 (no PHI in logs): SOAP builder receives scrubbed transcript.
- RAIL-11 (fail-closed): DICOM routes reject cross-tenant access.
