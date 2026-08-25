| Expert | Input |
|---|---|
| CMO | Clinical scope: General ER|عام; Trauma Center L-I/II|حوادث كبرى; Chest Pain Unit|ألم صدري; Stroke Code Stroke|جلطة; Psychiatric|نفسية; Pediatric ER|أطفال; Toxicology|سموم; Hyper/Hypothermia|حرارية; Triage ESI|فرز; Observation|ملاحظة; Minor Surgery|جراحة صغرى |
| AI Eng | RAG over dept SOPs + ICD mapping chains |
| Architect | table `er_encounters`, 5 endpoints, tenant RLS |
| DevOps | reversible migration + PM2 reload gate |
| UX | Stitch layout pick + AR/EN parity |
| Compliance | JCI ACC chapters + PDPL consent fields |
| QA | unit+integration stubs mapped to funcs |
