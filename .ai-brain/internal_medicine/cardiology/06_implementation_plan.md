# 06_implementation_plan.md - Cardiology Implementation Roadmap
**Expert: Principal Software Architect / DevOps Lead**

## 1. Phase 1: Database Layer (The Foundation)
- **Migration:** Create `e50_cardiology_extensions_up.sql`.
- **Tables:** `cardiology_procedures`, `ep_mapping_data`, `nuclear_imaging_results`.
- **Security:** Apply RLS policies and `tenant_id` constraints.

## 2. Phase 2: Backend Logic (The Engine)
- **Engine Update:** Enhance `cardiology_engine.js` with new methods for Cath Lab and EP logic.
- **AI Integration:** Implement the LangChain pipeline in `ai_cardiology_orchestrator.js`.
- **API Routes:** Add endpoints to `server.js` with `requireRole` and `requireTenantScope`.

## 3. Phase 3: Frontend (The Interface)
- **Module Creation:** Build `cardiology-station.js` using Stitch components.
- **Integration:** Add Cardiology to `FACILITY_ALLOWED` in `app.js`.
- **Testing:** Verify RTL/LTR and Role-based visibility.

## 4. Phase 4: QA & Validation
- **Unit Tests:** Test `cardiology_engine.js` logic.
- **Integration Tests:** Verify the Order $\rightarrow$ Result loop for Nuclear Cardiology.
- **Security Audit:** Penetration test the "Golden Access Rule" to ensure no leakage.

## 5. Deployment
- **Environment:** Deploy to Hetzner via PM2.
- **Verification:** Smoke test with dummy data in the sandbox.
