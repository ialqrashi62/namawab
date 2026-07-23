# RAG Implementation: Wave 10 (Rare Specialties & Advanced Research)
## Contextual Retrieval Mapping

### 1. Orphan Disease Diagnosis & Phenotyping
- **Trigger**: `POST /api/rare-specialties/registry` (Disease code updated).
- **RAG Query**: "Based on the Orphanet and OMIM (Online Mendelian Inheritance in Man) databases, what are the pathognomonic phenotypic markers for [Disease Code] and how do they differ from common mimics?"
- **Expected Context**: 
    - Guideline: Orphanet / OMIM / GARD (Genetic and Rare Diseases Information Center).
    - Key Section: Phenotypic descriptions, genetic markers, and differential diagnosis for ultra-rare conditions.

### 2. Orphan Drug Application & Compassionate Use
- **Trigger**: `POST /api/rare-specialties/registry` (orphan_drug_status = 'Compassionate Use').
- **RAG Query**: "What are the regulatory requirements for 'Compassionate Use' of an unapproved orphan drug in the Saudi Food and Drug Authority (SFDA) framework for life-threatening rare diseases?"
- **Expected Context**: 
    - Guideline: SFDA (Saudi Food and Drug Authority) / EMA (European Medicines Agency).
    - Key Section: Application process for compassionate use, safety monitoring, and ethical approval requirements.

### 3. Clinical Trial Protocol Adherence
- **Trigger**: `POST /api/research/trial-entry` (Adverse events recorded).
- **RAG Query**: "According to the GCP (Good Clinical Practice) guidelines and the trial protocol, what is the mandatory reporting timeline and procedure for a 'Serious Adverse Event' (SAE) in a Phase II clinical trial?"
- **Expected Context**: 
    - Guideline: ICH-GCP (International Council for Harmonisation - Good Clinical Practice).
    - Key Section: SAE reporting windows (usually 24 hours), causality assessment, and IRB/Ethics Committee notification.

### 4. Precision Medicine & Genomic Interpretation
- **Trigger**: `POST /api/research/trial-entry` (Genetic marker identified).
- **RAG Query**: "What is the current consensus on the therapeutic efficacy of [Genetic Marker] targeted therapy based on the latest peer-reviewed literature in the Lancet or New England Journal of Medicine (NEJM)?"
- **Expected Context**: 
    - Guideline: Peer-reviewed clinical trials / Precision Medicine frameworks.
    - Key Section: Efficacy rates, toxicity profiles, and patient stratification criteria.
