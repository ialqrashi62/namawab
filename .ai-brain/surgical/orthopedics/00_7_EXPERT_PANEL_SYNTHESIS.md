| Expert | Input |
|---|---|
| CMO | Clinical scope: Arthroplasty Hip/Knee|اصطناعية; Trauma/AO|كسور; Hand & Micro|يد ميكرو; Foot & Ankle|قدم وكاحل; Sports/Arthroscopy|رياضة; Ortho-Onc|أورام; Pediatric Ortho|أطفال (DDH/clubfoot) |
| AI Eng | RAG over dept SOPs + ICD mapping chains |
| Architect | table `ortho_cases`, 5 endpoints, tenant RLS |
| DevOps | reversible migration + PM2 reload gate |
| UX | Stitch layout pick + AR/EN parity |
| Compliance | JCI ACC chapters + PDPL consent fields |
| QA | unit+integration stubs mapped to funcs |
