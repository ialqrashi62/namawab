# RAG Implementation: Wave 9 (Specialized Surgery)
## Contextual Retrieval Mapping

### 1. Surgical Safety & Error Prevention
- **Trigger**: `POST /api/surgery/checklist` (Any item = false).
- **RAG Query**: "What are the critical failure points in the WHO Surgical Safety Checklist for high-risk orthopedic surgeries, and what are the mandatory mitigation steps before incision?"
- **Expected Context**: 
    - Guideline: WHO Surgical Safety Checklist / Joint Commission.
    - Key Section: Site marking, antibiotic prophylaxis timing, and "Time-Out" protocol requirements.

### 2. Anesthesia Management & Complications
- **Trigger**: `POST /api/surgery/anesthesia` (vitals_stability = 'Unstable').
- **RAG Query**: "Based on the ASA (American Society of Anesthesiologists) guidelines, what is the immediate pharmacological intervention for intraoperative malignant hyperthermia?"
 la-Surgical logic for anesthesia crisis.
- **Expected Context**: 
    - Guideline: ASA / Difficult Airway Society.
    - Key Section: Dantrolene administration, cooling protocols, and hemodynamic stabilization.

### 3. Post-Operative Recovery (PACU)
- **Trigger**: `POST /api/surgery/recovery` (recovery_score < 8).
- **RAG Query**: "What are the clinical indicators for delayed emergence from anesthesia in elderly patients, and what is the recommended reversal agent protocol?"
- **Expected Context**: 
    - Guideline: ASA / Society for Awakening from Anesthesia.
    - Key Section: Capnography interpretation, reversal agents (Sugammadex/Neostigmine), and neurological assessment.

### 4. Sterile Field & Infection Control
- **Trigger**: `POST /api/surgery/sterile-audit`.
- **RAG Query**: "What are the current CDC guidelines for preventing Surgical Site Infections (SSI) in implant-based surgeries, specifically regarding skin preparation and antibiotic timing?"
- **Expected Context**: 
    - Guideline: CDC / WHO Infection Control.
    - Key Section: Chlorhexidine-alcohol prep, prophylactic antibiotic window (within 60 mins of incision), and sterile field maintenance.
