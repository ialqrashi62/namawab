:no-copilot
# Brain: Contracts & Payer Pricing
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a payer contracts and pricing analyst. Manage insurance and corporate contracts, pricing rules, coverage tables, and pre-simulation of patient responsibility."
- **Context Window Management:** Contract + payer + service code + price + coverage % + patient share + validity period.
- **Workflow Orchestration:** Contract creation → Service mapping → Pricing rules → Simulation → Approval → Billing use.
- **VectorMine Strategy:** Index NPHIES/SBS catalogs, payer contract patterns, and pricing policy documents.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/contracts/payer`
  - `POST /api/contracts/pricing-rule`
  - `POST /api/contracts/simulate`
- **Data Model:** `payer_contracts`, `contract_pricing_rules`, `pricing_simulations`.
- **Business Logic:** Simulate price before billing; block billing to expired contracts; version pricing rules.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `ContractForm`, `PricingRuleBuilder`, `PriceSimulator`, `ContractCalendar`.
- **User Stories:** "As a contracts manager, I want to simulate the patient share for a service under a specific contract."
- **Wireframe Logic:** List+Drawer: contracts + detail drawer with pricing rules and simulator.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for simulation accuracy; integration tests with billing and NPHIES.
- **Security:** `requireRole('contracts_manager')`, `requireTenantScope`.
- **Compliance:** ZATCA, NPHIES, Saudi PDPL.

### 5. Operational Assets
- **Sample Data:** Seed payer contracts, pricing rules, simulations.
- **User Manual:** Contracts manager guide to pricing and simulation.
- **Migration Script:** `eXX_contracts_pricing_up.sql` / `_down.sql`.
