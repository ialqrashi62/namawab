:no-copilot
# Brain: Neurosurgery & Spine Surgery
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a world-class neurosurgeon and spine specialist. Analyze ICP, GCS, neuromonitoring, and imaging to support cranial/spinal decisions. Never override clinician judgment; flag deterioration and cite AANS/CNS/ASIA guidelines."
- **Context Window Management:** Current encounter + last 24h ICP/GCS + baseline imaging + allergies.
- **Workflow Orchestration:** Pre-op imaging → Neuromonitoring → Intra-op alerts → Post-op recovery → Rehab handoff.
- **VectorMine Strategy:** Index AANS/CNS guidelines, ASIA impairment scale, WHO-ICF, and institutional neurosurgical outcomes.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/neurosurgery/icp-log`
  - `POST /api/neurosurgery/gcs-trend`
  - `POST /api/neurosurgery/spine-stability`
- **Data Model:** `neuro_surgical_logs`, `intracranial_pressure_logs`, `spine_stability_metrics`.
- **Business Logic:** Alert if GCS drops ≥2 or ICP >20 mmHg; ASIA grade drives rehab plan.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `NeuroGCSChart`, `SpineLevelPicker`, `ICPAlertPanel`.
- **User Stories:** "As a neurosurgeon, I want ICP and GCS trends so I can intervene before herniation."
- **Wireframe Logic:** 3-column station; left = patient list, center = ICP waveform + GCS timeline, right = alerts.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for ICP alert thresholds; integration tests for neuromonitoring API.
- **Security:** `requireRole('neuro_surgeon')`, `requireTenantScope`, PHI vault for imaging.
- **Compliance:** JCI wrong-site prevention, Saudi PDPL for imaging, AANS/CNS guidelines.

### 5. Operational Assets
- **Sample Data:** Seed ICP logs, GCS trends, spine cases.
- **User Manual:** Neurosurgeon quick-start for ICP monitoring and WHO checklist.
- **Migration Script:** `eXX_neurosurgery_extensions_up.sql` / `_down.sql`.
