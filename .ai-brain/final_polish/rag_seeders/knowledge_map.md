# RAG Knowledge Acquisition Map
## Data Ingestion Strategy for VectorMine (PGVector)

### 1. Global Ingestion Pipeline
For each department, the following data types must be ingested into the vector database to enable high-precision clinical decision support (CDS).

### 2. Departmental Seeders

| Department | Primary Textbooks/Guidelines | Key Datasets for Vectorization | Expected RAG Output |
|---|---|---|---|
| **Cardiology** | ACC/AHA Guidelines, Braunwald's Heart Disease | ESC/ACC Clinical Trial Data, Echo Reference Ranges | Treatment paths for Heart Failure, Risk scores |
| **Respiratory** | GOLD (COPD), GINA (Asthma), ATS Guidelines | PFT Reference Values, ABG Interpretation Tables | COPD Staging, Vent settings recommendations |
| **Surgery** | WHO Surgical Safety Checklist, Sabiston Textbook | Intra-op Complication Databases, Robotic Metrics | Safety check validation, Ischemia risk prediction |
| **Neurosurgery** | AANS/CNS Guidelines, Youmans Neurological Surgery | GCS Trend Data, ICP Thresholds, ASIA Scale | Neurological deterioration alerts, Spine stability |
| **Orthopedics** | AAOS Guidelines, AO Foundation Manuals | Implant Failure Rates, ROM Recovery Curves | Implant selection, Fracture reduction quality |
| **Ophthalmology** | AAO Guidelines, ESCRS Manuals | IOL Power Formulas, IOP Progression Data | IOL Power validation, Glaucoma risk |
| **ENT** | AAO-HNS Guidelines, IFOS Standards | Audiogram Patterns, Cochlear Mapping Data | Hearing loss diagnosis, Implant candidacy |
| **Urology** | AUA/EAU Guidelines, NCCN (Prostate) | PSA Kinetic Data, Stone Composition Tables | Prostate cancer risk, Lithotripsy modality |
| **Plastic/Burns** | ISBI Guidelines, ASPS Manuals | TBSA Fluid Tables, Flap Perfusion Markers | Fluid resuscitation (Parkland), Flap viability |
| **OBGYN** | ACOG/RCOG Guidelines, NICE Guidelines | Fetal Growth Percentiles (Intergrowth-21), IVF Success Rates | Fetal growth alerts, IVF embryo grading |
| **Pediatrics** | AAP Guidelines, WHO Child Growth Standards | Z-Score Tables, Developmental Milestone Data | Growth failure alerts, Developmental delay risk |
| **Diagnostics** | CLSI, ACR, CAP Guidelines | Molecular Marker Databases, SUV Reference Ranges | Molecular risk, AI-Radiology validation |
| **Critical Care** | Surviving Sepsis Campaign, SCCM Guidelines | SOFA Score Tables, Lactate Clearance Data | Sepsis bundle compliance, MODS risk |
| **Rehab** | WHO ICF, AOTA/ASHA Standards | Functional Recovery Curves, PHQ-9/GAD-7 Norms | Recovery timelines, Psychosocial risk |
| **Admin/Ops** | JCI Standards, ZATCA Phase 2 Specs | Bed Occupancy Benchmarks, Revenue Leakage Patterns | Operational risk, Financial audit anomalies |
| **Rare Spec** | Orphanet, GARD, FDA ATMP Guidelines | Rare Phenotype-Genotype Maps, Nano-Toxicity Data | Rare disease diagnosis, Nano-drug targeting |

### 3. Ingestion Format
- **Chunking Strategy**: Recursive Character Text Splitter (chunk size: 1000, overlap: 200).
- **Embedding Model**: `text-embedding-3-large` (OpenAI) or `multilingual-e5-large`.
- **Metadata**: Every chunk must be tagged with `department`, `guideline_version`, and `evidence_level` (1-5).
