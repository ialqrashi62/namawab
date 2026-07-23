# RAG Implementation: Wave 7 (Admin & Ops)
## Contextual Retrieval Mapping

### 1. Resource Optimization & Bed Management
- **Trigger**: `GET /api/admin/resources` (Status = 'Critical').
- **RAG Query**: "What are the best practices for managing 'Bed Block' in tertiary hospitals during peak admission periods according to the IHI (Institute for Healthcare Improvement)?"
- **Expected Context**: 
    - Guideline: IHI Patient Flow Framework.
    - Key Section: Discharge planning, early discharge triggers, and surge capacity management.

### 2. Revenue Cycle Integrity & Leakage
- **Trigger**: `POST /api/finance/billing-audit` (Discrepancy detected).
- **RAG Query**: "How to identify and mitigate 'Revenue Leakage' in medical billing cycles for multi-specialty clinics under Saudi ZATCA Phase 2 regulations?"
- **Expected Context**: 
    - Guideline: ZATCA Phase 2 / Saudi Ministry of Health Finance.
    - Key Section: E-invoicing compliance, VAT reconciliation, and audit trails for medical services.

### 3. Facility Compliance & Accreditation
- **Trigger**: `GET /api/admin/compliance-status`.
- **RAG Query**: "What are the mandatory CBAHI (Saudi Central Board for Accreditation of Healthcare Institutions) requirements for the 'Patient Safety' chapter in a general hospital?"
- **Expected Context**: 
    - Guideline: CBAHI Standards.
    - Key Section: Medication safety, surgical checklists, and incident reporting protocols.

### 4. Operational Efficiency (KPIs)
- **Trigger**: `GET /api/admin/kpis`.
- **RAG Query**: "What is the industry benchmark for 'Average Length of Stay' (ALOS) in a specialized cardiac center, and how does it correlate with readmission rates?"
- **Expected Context**: 
    - Guideline: WHO / Joint Commission International (JCI).
    - Key Section: Operational KPIs, efficiency metrics, and quality-of-care benchmarks.
