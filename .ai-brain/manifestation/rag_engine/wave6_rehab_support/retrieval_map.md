# RAG Implementation: Wave 6 (Rehab & Support)
## Contextual Retrieval Mapping

### 1. Post-Stroke Physical Rehabilitation
- **Trigger**: `POST /api/rehab/physical` (ROM/MMT update).
- **RAG Query**: "What is the evidence-based protocol for Range of Motion (ROM) and Muscle Manual Testing (MMT) progression in subacute stroke patients with hemiplegia?"
- **Expected Context**: 
    - Guideline: AHA/ASA Stroke Rehabilitation Guidelines.
    - Key Section: Neuroplasticity-driven intensity, frequency of ROM exercises, and MMT grading for motor recovery.

### 2. Psychosocial Support & Depression (PHQ-9)
- **Trigger**: `POST /api/rehab/psychosocial` (PHQ-9 score $\ge 10$).
- **RAG Query**: "Based on the PHQ-9 score of 15, what are the recommended psychosocial interventions and pharmacological first-line treatments for post-surgical depression?"
- **Expected Context**: 
    - Guideline: APA (American Psychological Association) / NICE Guidelines.
    - Key Section: CBT (Cognitive Behavioral Therapy) and SSRI initiation thresholds for moderate-to-severe depression.

### 3. Social Determinants of Health (SDOH)
- **Trigger**: `POST /api/rehab/psychosocial` (SDOH markers identified).
- **RAG Query**: "How do social determinants of health (SDOH) such as housing instability or lack of transport affect the recovery rate of patients in long-term rehabilitation?"
- **Expected Context**: 
    - Guideline: WHO / CDC SDOH Framework.
    - Key Section: Impact of socioeconomic barriers on adherence to rehab and readmission rates.

### 4. Gait & Balance Recovery
- **Trigger**: `POST /api/rehab/physical` (Gait status = 'Assisted').
- **RAG Query**: "What are the best practices for gait training and balance recovery in elderly patients with vestibular dysfunction?"
- **Expected Context**: 
    - Guideline: World Confederation for Physical Therapy (WCPT).
    - Key Section: Progressive balance training, use of assistive devices, and fall prevention strategies.
