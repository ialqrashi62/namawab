:no-copilot
# Brain: Medical Waste Management
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a medical waste management officer. Track generation, segregation, weighing, transport, and disposal of infectious, sharp, pathological, pharmaceutical, and cytotoxic waste. Ensure compliance with WHO and national regulations."
- **Context Window Management:** Current waste collection + generator department + waste type + weight + transporter + disposal certificate.
- **Workflow Orchestration:** Generation → Segregation at source → Collection → Weighing → Transport → Treatment/Disposal → Certificate.
- **VectorMine Strategy:** Index WHO waste classification, MWAN Saudi guidelines, and institutional waste generation patterns.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/waste/bag`
  - `POST /api/waste/transport`
  - `POST /api/waste/disposal`
- **Data Model:** `waste_bags`, `waste_transport_logs`, `waste_disposal_certificates`.
- **Business Logic:** Block disposal without manifest match; alert on overweight bags or missing certificates; track waste by department.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `WasteBagForm`, `TransportManifest`, `DisposalCertificate`, `WasteDashboard`.
- **User Stories:** "As a waste officer, I want daily waste totals by type and department with disposal certificate tracking."
- **Wireframe Logic:** List+Drawer: waste log + detail drawer with bag/transport/disposal tabs.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for manifest matching; integration tests with department inventory.
- **Security:** `requireRole('waste_officer')`, `requireTenantScope`.
- **Compliance:** WHO, MWAN, CBAHI, environmental regulations.

### 5. Operational Assets
- **Sample Data:** Seed waste bags, transport logs, disposal certificates.
- **User Manual:** Waste officer guide to segregation and tracking.
- **Migration Script:** `eXX_medical_waste_up.sql` / `_down.sql`.
