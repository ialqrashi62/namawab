# 02_ai_orchestration.md - Emergency Department AI Orchestration
**Expert: Lead AI Engineer**

## 1. AI Architecture: The ER Brain
Triage optimization and disposition prediction RAG.

### A. VectorMine Implementation
- **Vector Database:** PGVector storing embeddings of chief-complaint patterns and disposition outcomes.
- **Retrieval:** Semantic search to match current presentation with "Similar ED Disposition" cases.

## 2. LangChain Orchestration
- **Chain 1: ESI Adjuster:** `Input (Vitals + Chief Complaint) -> Predictive Model -> LLM (Review) -> Output (Recommended ESI with Reasoning)`.
- **Chain 2: Disposition Predictor:** `Input (Workup Results + Time in ED) -> Vector Search -> LLM (Summary) -> Output (Likelihood of Admit vs Discharge)`.
