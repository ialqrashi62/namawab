# 02_ai_orchestration.md - Cardiothoracic AI Orchestration
**Expert: Lead AI Engineer**

## 1. AI Architecture: The Vascular Brain
Real-time hemodynamic analysis and post-op recovery prediction.

### A. VectorMine Implementation
- **Vector Database:** PGVector storing embeddings of complex surgical cases and hemodynamic patterns.
- **Retrieval:** Semantic search to match current intra-op instability with historical "Rescue" maneuvers.

## 2. LangChain Orchestration
- **Chain 1: Hemodynamic Stability Predictor:** `Input (Real-time MAP/CO) -> Predictive Model -> LLM (Analysis) -> Output (Suggested Vasopressor Adjustment)`.
- **Chain 2: Graft Patency Predictor:** `Input (Post-op Doppler/Echo) -> Vector Search (Similar Cases) -> LLM (Analysis) -> Output (Risk of Stenosis)`.
