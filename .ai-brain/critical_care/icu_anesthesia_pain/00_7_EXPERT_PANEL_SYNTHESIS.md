| Expert | Input |
|---|---|
| CMO | Clinical scope: MICU/SICU/Trauma ICU|مركزة عامة; CCU post-cath/CABG|قلبية; Neuro/PICU/NICU/Burn/Onc/Renal/Transplant/Obstetric ICU|تخصصية; Anesthesia OR/Obstetric/Peds/Cardiac|تخدير; Interventional Pain RF/SCS/Pumps|ألم تداخلي; PACU|إفاقة; HBOT|أكسجين ضغط |
| AI Eng | RAG over dept SOPs + ICD mapping chains |
| Architect | table `icu_flowsheets`, 5 endpoints, tenant RLS |
| DevOps | reversible migration + PM2 reload gate |
| UX | Stitch layout pick + AR/EN parity |
| Compliance | JCI ACC chapters + PDPL consent fields |
| QA | unit+integration stubs mapped to funcs |
