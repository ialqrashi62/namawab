# 02_ai_orchestration.md - Support Services AI Orchestration
**Expert: Lead AI Engineer**

## 1. AI Architecture: The Operational Brain
Predictive RAG for resource optimization and patient safety monitoring.

### A. VectorMine Implementation
- **Vector Database:** PGVector storing embeddings of nursing/operational logs and equipment manuals.
- **Retrieval:** Semantic search to match current equipment failure patterns with "Fastest Fix" historical cases.

## 2. LangChain Orchestration
- **Chain 1: Nursing Workload Predictor:** `Input (Patient Acuity + Staffing) -> Predictive Model -> LLM (Analysis) -> Output (Suggested Staff Redistribution)`.
- **Chain 2: Nutrition Synergy Analysis:** `Input (Patient Diagnosis + Diet) -> Vector Search (Clinical Nutrition Guidelines) -> LLM (Analysis) -> Output (Optimized Meal Plan)`.

## 3. Guardrails
- **Verification:** AI-suggested staffing changes must be approved by the Nursing Supervisor.
- **Observability:** Tracking "Resource Utilization" vs "AI Prediction".
