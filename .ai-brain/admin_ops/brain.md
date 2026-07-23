# Brain: Admin & Ops (Wave 7)
## Cognitive Core: Ultra-Specialized Clinical & Operational Precision

### 1. Clinical Domain & Scope
- **Focus**: Hospital Resource Planning (HRP), Advanced Financials, Human Capital Management (HCM), and Medical Supply Chain.
- **Key Workflows**:
    - **Resource Optimization**: Dynamic bed management, staff-to-patient ratio optimization, and OR (Operating Room) scheduling.
    - **Financial Integrity**: Revenue Cycle Management (RCM), Cost-per-case analysis, and ZATCA-compliant financial auditing.
    - **HCM**: Physician credentialing, license expiry tracking, and performance-based incentive mapping.
    - **Supply Chain**: Just-in-Time (JIT) medical inventory, cold-chain monitoring, and vendor procurement logic.

### 2. RAG Strategy & Global Guidelines
- **Primary Sources**:
    - JCI (Joint Commission International) Operational Standards.
    - ZATCA (Saudi Arabia) Phase 2 E-Invoicing Guidelines.
    - ISO 9001:2015 (Quality Management).
    - Saudi Ministry of Health (MOH) Operational Regulations.
- **VectorMine Indexing**:
    - `admin_ops_efficiency_matrix`: Mapping staffing levels to patient outcome metrics.
    - `financial_leakage_patterns`: AI-driven detection of billing anomalies and revenue leakage.

### 3. Technical Implementation (Backend)
- **Database Tables**: `admin_resource_logs`, `financial_integrity_logs`, `hcm_credentialing_logs`, `supply_chain_metrics`.
- **API Endpoints**:
    - `POST /api/admin/resource-opt`: Log bed occupancy and staff allocation.
    - `POST /api/admin/financial-audit`: Log revenue leakage and cost-per-case.
    - `POST /api/admin/hcm-credential`: Log physician license and credentialing status.
    - `POST /api/admin/supply-chain`: Log inventory levels and cold-chain telemetry.

### 4. UI/UX (Stitch Google Design System)
- **Visuals**: Hospital Command Center Dashboard, Financial Leakage Heatmap, Supply Chain Flow Diagram.
- **Components**: `ResourceAllocationGrid`, `FinancialLeakageChart`, `CredentialExpiryAlert`.

### 5. Safety Rails & Compliance
- **Critical Alert**: Trigger "Operational Crisis" if bed occupancy $> 95\%$ or "Financial Risk" if revenue leakage exceeds $5\%$ of monthly turnover.
- **Tenant Isolation**: `requireTenantScope` on all admin-ops-logs.
- **Audit**: Hash-chained logs for all financial mutations and credential changes.
