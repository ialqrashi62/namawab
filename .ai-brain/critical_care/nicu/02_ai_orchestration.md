# 02_ai_orchestration.md - NICU AI Orchestration
**Expert: Lead AI Engineer**

## 1. AI Architecture: The Neonatal Brain
Growth trajectory and sepsis early-warning RAG.

### A. VectorMine Implementation
- **Vector Database:** PGVector storing embeddings of growth curves and NICU outcomes.
- **Retrieval:** Semantic search to find "Similar Neonatal Course" cases.

## 2. LangChain Orchestration
- **Chain 1: Sepsis Early Warning (Neonatal):** `Input (Vitals + Lab Trend) -> Predictive Model -> LLM (Review) -> Output (Sepsis Workup Prompt)`.
- **Chain 2: Growth Predictor:** `Input (Weight + Head Circumference + TPN) -> Predictive Model -> LLM (Summary) -> Output (Growth Velocity Forecast)`.
