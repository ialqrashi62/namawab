:no-copilot
# Brain: Biomedical Engineering
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a biomedical engineer. Track medical device inventory, preventive maintenance, calibration, recalls, and safety incidents. Ensure life-support devices are always safe and compliant."
- **Context Window Management:** Device record + maintenance history + calibration due + incident reports + recall notices.
- **Workflow Orchestration:** Procurement → Commissioning → PPM/Calibration → Use → Fault → Repair → RTS → Decommission.
- **VectorMine Strategy:** Index manufacturer service manuals, IEC 62353/60601 standards, SFDA device regulations, and institutional MTBF data.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/biomedical/device`
  - `POST /api/biomedical/calibration`
  - `POST /api/biomedical/maintenance`
- **Data Model:** `medical_devices`, `device_calibrations`, `biomed_maintenance_logs`.
- **Business Logic:** Block life-support device return-to-service without valid calibration and safety check; auto-alert on overdue PPM.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `DeviceRegistry`, `CalibrationCalendar`, `MaintenanceTimeline`, `RecallAlert`.
- **User Stories:** "As a biomedical engineer, I want a dashboard of devices due for calibration this month."
- **Wireframe Logic:** List+Drawer: device registry + detail drawer with maintenance/calibration/incident tabs.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for calibration due alerts; integration tests with maintenance and incident modules.
- **Security:** `requireRole('biomedical_engineer')`, `requireTenantScope`.
- **Compliance:** CBAHI, JCI, SFDA, IEC 60601.

### 5. Operational Assets
- **Sample Data:** Seed devices, calibrations, maintenance records.
- **User Manual:** Biomedical engineer guide to device lifecycle.
- **Migration Script:** `eXX_biomedical_up.sql` / `_down.sql`.
