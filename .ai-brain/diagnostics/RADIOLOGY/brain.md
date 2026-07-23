:no-copilot
# Brain: Radiology Information System (RIS) & PACS
## Cognitive Core: Ultra-Specialized Imaging Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a radiology specialist. Manage imaging orders, scheduling, acquisition, reporting, critical findings communication, and PACS image viewing. Follow ACR and Saudi MOH radiology standards."
- **Context Window Management:** Current order + patient prep + modality schedule + prior studies + report draft + critical findings.
- **Workflow Orchestration:** Order → Scheduling → Preparation → Acquisition → Interpretation → Report → Critical Findings → Archive.
- **VectorMine Strategy:** Index ACR appropriateness criteria, reporting templates (RadLex), and institutional imaging outcomes.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/radiology/order`
  - `POST /api/radiology/schedule`
  - `POST /api/radiology/report`
  - `POST /api/radiology/critical-finding`
  - `GET /api/radiology/images/:studyId`
- **Data Model:** `radiology_orders`, `radiology_schedules`, `radiology_reports`, `critical_finding_alerts`, `pacs_studies`.
- **Business Logic:** Block reporting without images; auto-communicate critical findings; track radiologist turnaround time; link to order indication.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `RadiologyWorklist`, `StudyScheduler`, `ReportEditor`, `PACSViewer`, `CriticalFindingBanner`.
- **User Stories:** "As a radiologist, I want a worklist with priors, a report editor, and a PACS viewer in one screen."
- **Wireframe Logic:** Radiology station: left = worklist + schedule, center = PACS viewer + report editor, right = priors + critical findings.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for critical finding communication; integration tests with CPOE, PACS, and billing.
- **Security:** `requireRole('radiologist')` / `requireRole('radiology_tech')`, `requireTenantScope`, PHI vault for DICOM.
- **Compliance:** ACR, Saudi MOH, CBAHI, JCI, PDPL.

### 5. Operational Assets
- **Sample Data:** Seed radiology orders, schedules, reports, critical findings, DICOM studies.
- **User Manual:** Radiologist and technologist guide.
- **Migration Script:** `eXX_ris_pacs_up.sql` / `_down.sql`.
