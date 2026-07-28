# Blueprint: Interventional Cardiology (IC)
## 1. AI & Intelligence Layer (The Brain)

### Prompt Engineering
**System Prompt:**
"You are the NamaMedical Interventional Cardiology Expert AI. Your role is to assist cardiologists in planning, executing, and documenting percutaneous coronary interventions (PCI). You must adhere to the latest ACC/AHA and ESC guidelines. Your primary goal is to reduce door-to-balloon time and ensure precision in stent placement and pharmacological management."

**Context:**
- Latest ESC Guidelines on Myocardial Infarction in the setting of acute coronary syndromes.
- ACC/AHA Guidelines for Coronary Artery Agnostic Intervention.
- Patient-specific history: Renal function (Creatinine/GFR) for contrast dosing, Antiplatelet status.

**Workflow & Orchestration (LangChain):**
`Input: Patient STEMI Alert` $\rightarrow$ `Chain 1: Risk Stratification (Killip Class)` $\rightarrow$ `Chain 2: Contrast Volume Calculator (based on GFR)` $\rightarrow$ `Chain 3: Procedural Checklist (Access site, Heparin dose)` $\rightarrow$ `Chain 4: Post-Op Medication Suggestion (DAPT duration)`.

**VectorMine & RAG:**
- **Vector DB:** PGVector (namaweb/db_postgres.js).
- **Indexed Content:** PDFs of latest cardiology trials, internal hospital PCI protocols, and FDA approved stent specifications.
- **RAG Query:** "What is the recommended DAPT duration for a patient with a drug-eluting stent and high bleeding risk according to the latest ESC guidelines?"

---

## 2. Backend & Logic (The Engine)

### API Specifications (OpenAPI)
- `POST /api/cardiology/pci/session`: Initialize a PCI session.
- `PATCH /api/cardiology/pci/stents`: Record stent type, size, and position.
- `GET /api/cardiology/pci/analytics`: Get door-to-balloon time metrics.

### Data & Storage (ERD)
- **Table: `pci_sessions`** (`id`, `patient_id`, `doctor_id`, `access_site`, `contrast_volume`, `door_to_balloon_time`, `timestamp`).
- **Table: `pci_stents`** (`id`, `session_id`, `vessel_name`, `stent_type`, `diameter`, `length`, `position`).
- **Table: `pci_hemodynamics`** (`id`, `session_id`, `systolic_bp`, `diastolic_bp`, `heart_rate`, `timestamp`).

### Business Flows
1. **Activation:** ER $\rightarrow$ Cardiology Alert $\rightarrow$ Cath Lab Prep.
2. **Procedure:** Access $\rightarrow$ Engagement $\rightarrow$ Intervention $\rightarrow$ Closure.
3. **Recovery:** Post-PCI Monitoring $\rightarrow$ Discharge Planning.

---

## 3. Frontend / UI-UX (The Interface)

### Wireframes & Mockups
- **Cath Lab Dashboard:** Real-time hemodynamic stream, timer for "Door-to-Balloon", and a quick-entry panel for stent details.
- **Vessel Map:** Interactive SVG of coronary arteries for marking lesion locations.

### Design System (Stitch)
- **Theme:** High-contrast "Dark Mode" for Cath Lab environments to reduce glare.
- **Components:** `Stitch-Medical-Timer`, `Stitch-Vitals-Graph`, `Stitch-Stent-Selector`.

---

## 4. Governance & Quality (The Guardrails)

### Security & Compliance
- **RBAC:** Only certified Interventional Cardiologists and Cath Lab Nurses can edit `pci_sessions`.
- **Compliance:** NPHIES coding for PCI procedures; ZATCA VAT for medical consumables (stents).

### Testing & QA
- **Unit Test:** Verify `contrast_volume_calculator` correctly warns when volume exceeds 3x GFR.
- **Integration Test:** Ensure `pci_session` creation triggers a notification to the recovery ward.

### Deployment & DevOps
- **CI/CD:** GitHub Actions $\rightarrow$ Staging $\rightarrow$ Production (Hetzner).
- **Observability:** Prometheus monitoring for API latency during critical PCI sessions.

---

## 5. Project Management & Docs
- **User Story:** "As a cardiologist, I want to record stent details during the procedure so that the medical record is accurate and immediate."
- **Acceptance Criteria:** Stent data must be saved in < 2 seconds; must include vessel name and diameter.
- **User Manual:** "How to initiate a PCI session in NamaMedical ERP."
