# 02_ai_orchestration.md - Rehabilitation AI Orchestration
**Expert: Lead AI Engineer**

## 1. AI Architecture: The Recovery Brain
Predictive RAG for personalized rehabilitation trajectories.

### A. VectorMine Implementation
- **Vector Database:** PGVector storing embeddings of recovery curves and functional outcomes.
- **Retrieval:** Semantic search to match current patient progress with "Optimal Recovery" paths.

## 2. LangChain Orchestration
- **Chain 1: Recovery Path Optimizer:** `Input (Current ROM + Strength) -> Vector Search (Similar Recoveries) -> LLM (Analysis) -> Output (Suggested Exercise Adjustment)`.
- **Chain 2: ADL Predictor:** `Input (Therapy Progress) -> Predictive Model -> LLM (Summary) -> Output (Predicted Date for Independent Living)`.
