# RAG Implementation: Wave 3 (OBGYN & Pediatrics)
## Contextual Retrieval Mapping

### 1. IVF & Assisted Reproduction
- **Trigger**: `POST /api/obgyn/ivf/embryo-grade`.
- **RAG Query**: "Based on the Gardner scale, what is the implantation success rate for a [Grade] blastocyst in a patient with [Age/AMH]?"
- **Expected Context**: 
    - Guideline: ESHRE (European Society of Human Reproduction and Embryology).
    - Key Section: Embryo quality and transfer outcomes.

### 2. Maternal-Fetal Medicine (MFM)
- **Trigger**: `POST /api/obgyn/mfm/growth-track`.
- **RAG Query**: "For a fetus with growth percentile [Value] at [GA] weeks, what is the recommended Doppler/BPP frequency according to ACOG?"
- **Expected Context**:
    - Guideline: ACOG (American College of Obstetricians and Gynecologists).
    - Key Section: Fetal Growth Restriction (FGR) management.

### 3. NICU Level III/IV
- **Trigger**: `POST /api/nicu/vent-settings`.
- **RAG Query**: "What are the target blood gas/ventilation parameters for a premature neonate with RDS on HFOV according to NALS guidelines?"
- **Expected Context**:
    - Guideline: NALS (Neonatal Acute Care).
    - Key Section: HFOV settings and $\text{CO}_2$ management.

### 4. Pediatric Growth & Development
- **Trigger**: `POST /api/pediatrics/growth-log`.
- **RAG Query**: "A child with weight Z-score [Value] and length Z-score [Value]. Does this meet the criteria for 'Failure to Thrive' according to WHO standards?"
- **Expected Context**:
    - Guideline: WHO Child Growth Standards.
    - Key Section: Z-score interpretation and nutritional intervention.

### 5. Pediatric Subspecialties (Cardio/Nephro/Neuro)
- **Trigger**: `POST /api/peds-sub/cardio` or `POST /api/peds-sub/nephro`.
- **RAG Query**: "For a pediatric patient with [CHD Diagnosis], what is the target aortic Z-score for surgical intervention?"
- **Expected Context**:
    - Guideline: AAP/AHA Pediatric Heart Guidelines.
    - Key Section: Z-score based surgical thresholds.
